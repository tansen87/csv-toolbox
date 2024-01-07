use polars::{
    io::SerReader,
    frame::DataFrame,
    datatypes::{AnyValue, DataType},
    lazy::dsl::{col, functions::diag_concat_lf},
    prelude::{Arc, Schema, CsvReader, CsvWriter, SerWriter, LazyCsvReader, LazyFileListReader}
};

fn write_xlsx(df: DataFrame, path: String) -> Result<(), Box<dyn std::error::Error>> {
    /*  Write dataframe to xlsx */
    let file_path = std::path::Path::new(&path);
    let file_name: Vec<&str> = file_path.file_name().unwrap().to_str().unwrap().split('.').collect();
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
                AnyValue::Utf8(values) => {
                    worksheet.write_string((col+1).try_into()?, row.try_into()?, values.to_string())?;
                }
                _ => { },
            }
        }
    }
    let current_time = chrono::Local::now();
    let output_path = format!("{}/{} {}.xlsx", file_path.parent().unwrap().to_string_lossy(), file_name[0], current_time.format("%Y-%m-%d %H.%M.%S"));
    workbook.save(output_path)?;
    Ok(())
}

fn write_csv(df: DataFrame, path: String) -> Result<(), Box<dyn std::error::Error>> {
    /*  Write dataframe to csv */
    let file_path = std::path::Path::new(&path);
    let file_name: Vec<&str> = file_path.file_name().unwrap().to_str().unwrap().split('.').collect();
    let current_time = chrono::Local::now();
    let output_path = format!("{}/{} {}.csv", file_path.parent().unwrap().to_string_lossy(), file_name[0], current_time.format("%Y-%m-%d %H.%M.%S"));
    let mut file = std::fs::File::create(output_path)?;
    CsvWriter::new(&mut file)
        .with_delimiter(b'|')
        .finish(&mut df.clone())?;
    Ok(())
}

fn groupby_sum(path: String, sep: String, index: String, values: String) -> Result<(), Box<dyn std::error::Error>> {
    /* group by - sum */
    let sep_u8 = sep.into_bytes()[0];
    let idx: Vec<&str> = index.split(',').collect();
    let val: Vec<&str> = values.split(',').collect();
    let file_path = std::path::Path::new(&path);

    // Convert idx field datatype to utf8, val field datatype to float64
    let mut schema = Schema::new();
    for i in idx.iter() {
        schema.with_column(i.to_string().into(), DataType::Utf8);
    }
    for v in val.iter() {
        schema.with_column(v.to_string().into(), DataType::Float64);
    }

    // load csv file
    let lf = LazyCsvReader::new(&file_path)
        // .with_infer_schema_length(Some(10))
        .with_delimiter(sep_u8)
        .with_dtype_overwrite(Some(&Arc::new(schema)))
        .finish()?;

    // group by: maximum 4
    let mut vec_df = Vec::new();
    if val.len() == 1 
    {
        let gb = lf.group_by(idx)
        .agg([
            col(val[0]).sum()
        ]).collect()?;
        vec_df.push(gb);
    }
    else if val.len() == 2
    {
        let gb = lf.group_by(idx)
        .agg([
            col(val[0]).sum(),
            col(val[1]).sum()
        ]).collect()?;
        vec_df.push(gb);
    }
    else if val.len() == 3
    {
        let gb = lf.group_by(idx)
        .agg([
            col(val[0]).sum(),
            col(val[1]).sum(),
            col(val[2]).sum()
        ]).collect()?;
        vec_df.push(gb);
    }
    else if val.len() == 4
    {
        let gb = lf.group_by(idx)
        .agg([
            col(val[0]).sum(),
            col(val[1]).sum(),
            col(val[2]).sum(),
            col(val[3]).sum()
        ]).collect()?;
        vec_df.push(gb);
    }
    else 
    {
        eprintln!("[warning] - Only supports up to four variables.");
    }
    write_xlsx(vec_df[0].clone(), path)?;
    Ok(())
}

fn unique_value(path: String, sep: String, column: String) -> Result<(), Box<dyn std::error::Error>> {
    /* Getting a unique value for a column */
    let sep_u8 = sep.into_bytes()[0];
    let file_path = std::path::Path::new(&path);

    // Convert column field datatype to utf8
    let mut schema = Schema::new();
    schema.with_column(column.to_string().into(), DataType::Utf8);

    // load csv file
    let lf = LazyCsvReader::new(&file_path)
        .with_delimiter(sep_u8)
        .with_dtype_overwrite(Some(&Arc::new(schema)))
        .finish()?;

    // get unique value
    let uni = lf.select([
        col(&column).unique()
    ])
    .collect()?;
    write_xlsx(uni, path)?;
    Ok(())
}

fn merge_file(path: String, sep: String, column: String, window: tauri::Window) -> Result<(), Box<dyn std::error::Error>> {
    /* merge csv files into a xlsx or csv file */
    let sep_u8 = sep.into_bytes()[0];
    let vec_path: Vec<&str> = path.split(',').collect();
    let vec_col: Vec<&str> = column.split(',').collect();
    let mut lfs = Vec::new();

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
            .with_n_rows(Some(0))
            .finish() 
            {
                Ok(df ) => df,
                Err(err) => {
                    let err_msg = format!("error: {} | {}", file, err);
                    window.emit("readerr", err_msg)?;
                    return Err(Box::new(err));
                }
            };
        let header = tmp_df.get_column_names();
        for h in header.iter() {
            schema.with_column(h.to_string().into(), DataType::Utf8);
        }
        for num in vec_col.iter() {
            schema.with_column(num.to_string().into(), DataType::Float64);
        }
        let tmp_lf = LazyCsvReader::new(file)
            .with_delimiter(sep_u8)
            .with_missing_is_null(false)
            .with_dtype_overwrite(Some(&Arc::new(schema.clone())))
            .finish()?;
        lfs.push(tmp_lf);
    }

    // concat dataframe
    let union_df = diag_concat_lf(lfs, true, true)?.collect()?;
    let save_path = vec_path[0].to_string();
    let row_len = union_df.shape().0;
    if row_len < 104_0000 {
        write_xlsx(union_df, save_path)?;
    } else {
        write_csv(union_df, save_path)?;
    }
    Ok(())
}

#[tauri::command]
pub async fn pivot(path: String, sep: String, index: String, values: String, window: tauri::Window) {
    let _pt = match async {
        groupby_sum(path, sep, index, values)
    }.await
    {
        Ok(result) => result,
        Err(error) =>
        {
            eprintln!("Error: {}", error);
            window.emit("pivotErr", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}

#[tauri::command]
pub async fn unique(path: String, sep: String, column: String, window: tauri::Window) {
    let _uni = match async {
        unique_value(path, sep, column)
    }.await
    {
        Ok(result) => result,
        Err(error) =>
        {
            eprintln!("Error: {}", error);
            window.emit("uniqueErr", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}

#[tauri::command]
pub async fn concat(path: String, sep: String, column: String, window: tauri::Window) {
    let cct_window = window.clone();
    let _cct = match async {
        merge_file(path, sep, column, cct_window)
    }.await
    {
        Ok(result) => result,
        Err(error) =>
        {
            eprintln!("Error: {}", error);
            window.emit("concatErr", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}
