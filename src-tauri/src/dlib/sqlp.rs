use std::{
    borrow::Cow,
    collections::HashMap,
    error::Error,
    fs::File,
    io::{Read, Write, BufWriter},
    path::{Path, PathBuf},
};

use polars::{
    datatypes::DataType, prelude::{
        Arc,
        CsvReader,
        CsvWriter,
        Schema,
        SerReader,
        DataFrame,
        SerWriter,
        LazyCsvReader,
        LazyFileListReader,
    },
    sql::SQLContext
};

#[derive(Default, Clone, PartialEq)]
enum OutputMode {
    #[default]
    Csv,
    None,
}

impl OutputMode {
    fn execute_query(&self, query: &str, ctx: &mut SQLContext, sep: String, output: Option<String>, window: tauri::Window) -> Result<(usize, usize), Box<dyn Error>> {
        let mut df = DataFrame::default();
        let execute_inner = || {
            df = ctx
                .execute(query)
                .and_then(polars::prelude::LazyFrame::collect)?;

            // we don't want to write anything if the output mode is None
            if matches!(self, OutputMode::None) {
                return Ok(());
            }

            // let w = File::create(&flag_output)?;
            let w = match output {
                Some(path) => {
                    Box::new(File::create(path)?) as Box<dyn Write>
                },
                None => Box::new(std::io::stdout()) as Box<dyn Write>,
            };
            let mut w = BufWriter::with_capacity(256_000, w);
            let out_result = match self {
                OutputMode::Csv => CsvWriter::new(&mut w)
                    .with_separator(sep.into_bytes()[0])
                    .n_threads(4)
                    .finish(&mut df),
                OutputMode::None => Ok(()),
            };

            w.flush()?;
            out_result
        };

        match execute_inner() {
            Ok(()) => Ok(df.shape()),
            Err(e) => {
                eprintln!("Failed to execute query: {query}: {e}");
                let errmsg = format!("Failed to execute query: {query}: {e}");
                window.emit("execerr", errmsg)?;
                return Ok((0, 0));
            },
        }
    }
}

impl std::str::FromStr for OutputMode {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "csv" => Ok(OutputMode::Csv),
            _ => Err(format!("Invalid output mode: {s}")),
        }
    }
}

fn prepare_query(filepath: Vec<&str>, sqlsrc: &str, sep: String, window: tauri::Window) -> Result<(), Box<dyn Error>> {
    let mut ctx = SQLContext::new();
    let sepu8 = sep.clone().into_bytes()[0];
    let mut output: Vec<Option<String>> = Vec::new();
    let current_time = chrono::Local::now().format("%Y-%m-%d %H.%M.%S");
    let output_suffix = format!("sqlp {}.csv", current_time);
    for path in filepath.clone() {
        let mut output_path = PathBuf::from(path);
        output_path.set_extension(output_suffix.clone());
        let output_str = if let Some(output_path_str) = output_path.to_str() {
            Some(output_path_str.to_string())
        } else {
            None
        };

        output.push(output_str);
    }

    let optimization_state = polars::lazy::frame::OptState {
            projection_pushdown: true,
            predicate_pushdown:  true,
            type_coercion:       true,
            simplify_expr:       true,
            file_caching:        true,
            slice_pushdown:      true,
            comm_subplan_elim:   true,
            comm_subexpr_elim:   true,
            streaming:           false,
            fast_projection:     true,
            eager:               false,
        };

    let mut table_aliases = HashMap::with_capacity(filepath.len());
    let mut lossy_table_name = Cow::default();
    let mut table_name;
    let mut schema = Schema::new();

    for (idx, table) in filepath.iter().enumerate() 
    {
        // as we are using the table name as alias, we need to make sure that the table name is a
        // valid identifier. if its not utf8, we use the lossy version
        table_name = Path::new(table)
            .file_stem()
            .and_then(std::ffi::OsStr::to_str)
            .unwrap_or_else(|| {
                lossy_table_name = Path::new(table).to_string_lossy();
                &lossy_table_name
            });
        table_aliases.insert(table_name.to_string(), format!("_t_{}", idx + 1));

        let tmp_df = match CsvReader::from_path(table).unwrap()
            .with_separator(sepu8)
            .with_n_rows(Some(1))
            .with_n_threads(Some(1))
            .finish() {
                Ok(df ) => df,
                Err(err) => {
                    let err_msg = format!("error: {} | {}", table, err);
                    eprintln!("{}", err_msg);
                    return Ok(());
                }
            };
        let header = tmp_df.get_column_names();
        for h in header.iter() {
            schema.with_column(h.to_string().into(), DataType::String);
        }

        let lf = LazyCsvReader::new(table)
            .has_header(true)
            .with_missing_is_null(true)
            .with_separator(sepu8)
            .with_dtype_overwrite(Some(&Arc::new(schema.clone())))
            .low_memory(true)
            .finish()?;

        ctx.register(table_name, lf.with_optimizations(optimization_state));
    }
    
    let output_mode: OutputMode = OutputMode::Csv;
    let no_output: OutputMode = OutputMode::None;

    // check if the query is a SQL script
    let queries = if Path::new(&sqlsrc)
        .extension()
        .map_or(false, |ext| ext.eq_ignore_ascii_case("sql"))
    {
        let mut file = File::open(&sqlsrc).unwrap();
        let mut sql_script = String::new();
        file.read_to_string(&mut sql_script).unwrap();
        sql_script
            .split(';')
            .map(std::string::ToString::to_string)
            .filter(|s| !s.trim().is_empty())
            .collect()
    } else {
        // its not a sql script, just a single query
        vec![sqlsrc.to_string().clone()]
    };

    let num_queries = queries.len();
    let last_query: usize = num_queries.saturating_sub(1);
    let mut is_last_query;
    let mut current_query = String::new();

    for (idx, query) in queries.iter().enumerate() {
        // check if this is the last query in the script
        is_last_query = idx == last_query;

        // replace aliases in query
        current_query.clone_from(query);
        for (table_name, table_alias) in &table_aliases {
            // we quote the table name to avoid issues with reserved keywords and
            // other characters that are not allowed in identifiers
            current_query = current_query.replace(table_alias, &(format!(r#""{table_name}""#)));
        }

        let exec_window = window.clone();
        let exec1_window = window.clone();

        if is_last_query {
            // if this is the last query, we use the output mode specified by the user
            output_mode.execute_query(&current_query, &mut ctx, sep.clone(), output[0].clone(), exec_window).unwrap()
        } else {
            // this is not the last query, we only execute the query, but don't write the output
            no_output.execute_query(&current_query, &mut ctx, sep.clone(), output[0].clone(), exec1_window).unwrap()
        };
    }

    Ok(())
}

#[tauri::command]
pub async fn query(path: String, sqlsrc: String, sep: String, window: tauri::Window) {
    let filepath: Vec<&str> = path.split(',').collect();
    let prep_window = window.clone();
    match async {
        prepare_query(filepath, &sqlsrc.as_str(), sep, prep_window)
    }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("Error: {}", error);
            window.emit("queryErr", &error.to_string()).unwrap();
            return ();
        }
    }
}
