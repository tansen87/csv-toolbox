use std::{
    fs::File,
    path::Path,
    error::Error
};

use polars::{
    io::SerReader,
    frame::DataFrame,
    datatypes::{AnyValue, DataType},
    lazy::dsl::{col, functions::concat_lf_diagonal, cols},
    prelude::{Arc, Schema, CsvReader, CsvWriter, SerWriter, UnionArgs, LazyCsvReader, LazyFileListReader}
};

fn write_xlsx(df: DataFrame, path: String, fn_type: String) -> Result<(), Box<dyn Error>> {
    /*  Write dataframe to xlsx */
    let file_path = Path::new(&path);
    let file_name = match file_path.file_name() {
        Some(name) => match name.to_str() {
            Some(name_str) => name_str.split('.').collect::<Vec<&str>>(),
            None => vec![],
        },
        None => vec![],
    };
    let mut workbook = rust_xlsxwriter::Workbook::new();
    let worksheet = workbook.add_worksheet();

    // write header to xlsx
    let header = df.get_column_names();
    for (col, col_name) in header.iter().enumerate() {
        worksheet.write_string(0, col.try_into()?, col_name.to_string())?;
    }

    // write data to xlsx
    for (row, row_data) in df.iter().enumerate() 
    {
        for (col, col_data) in row_data.iter().enumerate() 
        {
            match col_data 
            {
                AnyValue::Float64(values) => {
                    worksheet.write_number((col+1).try_into()?, row.try_into()?, values)?;
                }
                AnyValue::String(values) => {
                    worksheet.write_string((col+1).try_into()?, row.try_into()?, values.to_string())?;
                }
                _ => { },
            }
        }
    }

    let file_path_copy = file_path.parent()
        .map(|parent| parent.to_string_lossy())
        .unwrap_or_else(|| "Default Path".to_string().into());

    let current_time = chrono::Local::now();
    let current_time_str = current_time.format("%Y-%m-%d-%H%M%S");

    let mut vec_output = Vec::new();
    let output_path = match fn_type.as_str() {
        "pivot" => format!(
            "{}/{}_pivot {}.xlsx",
            file_path_copy,
            file_name[0],
            current_time_str
        ),
        "unique" => format!(
            "{}/{}_unique {}.xlsx",
            file_path_copy,
            file_name[0],
            current_time_str
        ),
        "concat" => format!(
            "{}/{}_concat {}.xlsx",
            file_path_copy,
            file_name[0],
            current_time_str
        ),
        _ => format!(
            "{}/{} {}.xlsx",
            file_path_copy,
            file_name[0],
            current_time_str
        ),
    };

    vec_output.push(output_path);
    workbook.save(vec_output[0].clone())?;

    Ok(())
}

fn write_csv(df: DataFrame, path: String, fn_type: String) -> Result<(), Box<dyn Error>> {
    /*  Write dataframe to csv */
    let file_path = Path::new(&path);
    let file_name = match file_path.file_name() {
        Some(name) => match name.to_str() {
            Some(name_str) => name_str.split('.').collect::<Vec<&str>>(),
            None => vec![],
        },
        None => vec![],
    };

    let file_path_copy = file_path.parent()
        .map(|parent| parent.to_string_lossy())
        .unwrap_or_else(|| "Default Path".to_string().into());

    let current_time = chrono::Local::now();
    let current_time_str = current_time.format("%Y-%m-%d-%H%M%S");

    let mut vec_output = Vec::new();

    let output_path = match fn_type.as_str() {
        "concat" => format!(
            "{}/{}_concat {}.csv",
            file_path_copy,
            file_name[0],
            current_time_str
        ),
        "pivot" => format!(
            "{}/{}_pivot {}.csv",
            file_path_copy,
            file_name[0],
            current_time_str
        ),
        _ => format!(
            "{}/{} {}.csv",
            file_path_copy,
            file_name[0],
            current_time_str
        ),
    };
    vec_output.push(output_path);

    let mut file = File::create(vec_output[0].clone())?;
    CsvWriter::new(&mut file)
        .with_separator(b'|')
        .finish(&mut df.clone())?;

    Ok(())
}

fn groupby_sum(path: String, sep: String, index: String, values: String) -> Result<(), Box<dyn Error>> {
    /* group by - sum */
    let mut separator = Vec::new();
    let sep_u8 = if sep == "\\t" {
        b'\t'
    } else {
        sep.into_bytes()[0]
    };
    separator.push(sep_u8);

    let idx: Vec<&str> = index.split('|').collect();
    let val: Vec<&str> = values.split('|').collect();
    let file_path = Path::new(&path);

    // Convert idx field datatype to utf8, val field datatype to float64
    let mut schema = Schema::new();
    for i in idx.iter() {
        schema.with_column(i.to_string().into(), DataType::String);
    }
    for v in val.iter() {
        schema.with_column(v.to_string().into(), DataType::Float64);
    }

    // load csv file
    let lf = LazyCsvReader::new(&file_path)
        .with_separator(separator[0])
        .with_dtype_overwrite(Some(&Arc::new(schema)))
        .finish()?;

    // group by dataframe
    let gb = lf.group_by(idx)
        .agg([
            cols(val).fill_null(0).sum()
        ]).collect()?;
    
    let fn_type = "pivot".to_string();
    write_xlsx(gb.clone(), path, fn_type)?;

    Ok(())
}

fn unique_value(path: String, sep: String, column: String) -> Result<(), Box<dyn Error>> {
    /* Getting a unique value for a column */
    let mut separator = Vec::new();
    let sep_u8 = if sep == "\\t" {
        b'\t'
    } else {
        sep.into_bytes()[0]
    };
    separator.push(sep_u8);

    let file_path = Path::new(&path);

    // Convert column field datatype to utf8
    let mut schema = Schema::new();
    schema.with_column(column.to_string().into(), DataType::String);

    // load csv file
    let lf = LazyCsvReader::new(&file_path)
        .with_separator(separator[0])
        .with_dtype_overwrite(Some(&Arc::new(schema)))
        .finish()?;

    // get unique value
    let uni = lf.select([
        col(&column).unique()
    ])
    .collect()?;
    let fn_type = "unique".to_string();
    write_xlsx(uni, path, fn_type)?;

    Ok(())
}

fn concat_all(path: String, sep: String, column: String, window: tauri::Window) -> Result<(), Box<dyn Error>> {
    /* merge csv files into a xlsx or csv file */
    let mut separator = Vec::new();
    let sep_u8 = if sep == "\\t" {
        b'\t'
    } else {
        sep.into_bytes()[0]
    };
    separator.push(sep_u8);

    let vec_path: Vec<&str> = path.split(',').collect();
    let vec_col: Vec<&str> = column.split('|').collect();
    let mut lfs = Vec::new();
    let mut count: usize = 0;
    let file_len = vec_path.len();

    // Convert column field datatype to float64
    let mut schema = Schema::new();
    for file in vec_path.iter() 
    {
        // let tmp_df = if let Ok(df) = CsvReader::from_path(file)?
        //     .with_n_rows(Some(0))
        //     .finish() {
        //         df
        //     } else {
        //         return Err(format!("error file: {}", file).into());
        //     };
        let tmp_df = match CsvReader::from_path(file)?
            .with_separator(separator[0])
            .with_n_rows(Some(0))
            .finish() {
                Ok(df ) => df,
                Err(err) => {
                    let err_msg = format!("error: {} | {}", file, err);
                    window.emit("read_err", err_msg)?;
                    return Err(Box::new(err));
                }
            };
        let header = tmp_df.get_column_names();
        for h in header.iter() {
            schema.with_column(h.to_string().into(), DataType::String);
        }
        for num in vec_col.iter() {
            schema.with_column(num.to_string().into(), DataType::Float64);
        }
        let tmp_lf = LazyCsvReader::new(file)
            .with_separator(separator[0])
            .with_missing_is_null(false)
            .with_dtype_overwrite(Some(&Arc::new(schema.clone())))
            .finish()?;
        lfs.push(tmp_lf);

        let info_msg = format!("{}|done", file);
        window.emit("cat_msg", info_msg)?;

        count += 1;
        let progress = (count as f32) / (file_len as f32) * 100.0;
        let progress_s = format!("{progress:.0}");
        window.emit("cat_progress", progress_s)?;
    }

    // concat dataframe
    let union_df = concat_lf_diagonal(
        lfs, UnionArgs{parallel: true, rechunk: true, to_supertypes: true})?
        .collect()?;
    let save_path = vec_path[0].to_string();
    let row_len = union_df.shape().0;
    let fn_type = "concat".to_string();
    if row_len < 104_0000 {
        write_xlsx(union_df, save_path, fn_type.clone())?;
    } else {
        write_csv(union_df, save_path, fn_type)?;
    }

    Ok(())
}

fn concat_specific(path: String, sep: String, column: String, window: tauri::Window) -> Result<(), Box<dyn Error>> {
    /* merge sepecific columns */
    let mut separator = Vec::new();
    let sep_u8 = if sep == "\\t" {
        b'\t'
    } else {
        sep.into_bytes()[0]
    };
    separator.push(sep_u8);

    let vec_path: Vec<&str> = path.split(',').collect();
    let vec_col: Vec<&str> = column.split('|').collect();
    let mut lfs = Vec::new();
    let mut count: usize = 0;
    let file_len = vec_path.len();

    let mut schema = Schema::new();
    for file in vec_path.iter() 
    {
        for h in vec_col.iter() {
            schema.with_column(h.to_string().into(), DataType::String);
        }
        let tmp_lf = LazyCsvReader::new(file)
            .with_separator(separator[0])
            .with_missing_is_null(false)
            .with_dtype_overwrite(Some(&Arc::new(schema.clone())))
            .finish()?
            .select([cols(vec_col.clone())]);
        lfs.push(tmp_lf);

        let catsp_msg = format!("{}|done", file);
        window.emit("catsp_msg", catsp_msg)?;

        count += 1;
        let progress = (count as f32) / (file_len as f32) * 100.0;
        let progress_s = format!("{progress:.0}");
        window.emit("catsp_progress", progress_s)?;
    }

    // concat specific dataframe
    let union_df = concat_lf_diagonal(
        lfs, UnionArgs{parallel: true, rechunk: true, to_supertypes: true})?
        .collect()?;
    let save_path = vec_path[0].to_string();
    let row_len = union_df.shape().0;
    let fn_type = "concat".to_string();
    if row_len < 104_0000 {
        write_xlsx(union_df, save_path, fn_type.clone())?;
    } else {
        write_csv(union_df, save_path, fn_type)?;
    }

    Ok(())
}

#[tauri::command]
pub async fn pivot(path: String, sep: String, index: String, values: String, window: tauri::Window) {
    match async { groupby_sum(path, sep, index, values) }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("groupby_sum error: {error}");
            window.emit("pivot_err", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}

#[tauri::command]
pub async fn unique(path: String, sep: String, column: String, window: tauri::Window) {
    match async { unique_value(path, sep, column) }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("unique error: {error}");
            window.emit("unique_err", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}

#[tauri::command]
pub async fn concat(path: String, sep: String, column: String, window: tauri::Window) {
    let cat_window = window.clone();
    match async { concat_all(path, sep, column, cat_window) }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("concat error: {error}");
            window.emit("cat_err", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}

#[tauri::command]
pub async fn concatsp(path: String, sep: String, column: String, window: tauri::Window) {
    let cat_window = window.clone();
    match async { concat_specific(path, sep, column, cat_window) }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("concat_sepecific error: {error}");
            window.emit("catsp_err", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}