use std::path;
use chrono::Utc;
use polars::frame::DataFrame;
use polars::lazy::dsl::col;
use polars::prelude::{Schema, LazyCsvReader, Arc, LazyFileListReader};
use polars::datatypes::{DataType, AnyValue};
use rust_xlsxwriter::Workbook;

pub fn write_xlsx(df: DataFrame, path: String) -> Result<(), Box<dyn std::error::Error>> {
    /*  Write dataframe to xlsx */
    let file_path = path::Path::new(&path);
    let file_name: Vec<&str> = file_path.file_name().unwrap().to_str().unwrap().split('.').collect();
    let mut workbook = Workbook::new();
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
                _ => {
                    worksheet.write_string((col+1).try_into()?, row.try_into()?, col_data.to_string())?;
                },
            }
        }
    }
    let current_time = Utc::now();
    let output_path = format!("{}/{} {}.xlsx", file_path.parent().unwrap().to_string_lossy(), file_name[0], current_time.format("%Y-%m-%d %H.%M.%S"));
    workbook.save(output_path)?;
    Ok(())
}

pub fn groupby_sum(path: String, sep: String, index: String, values: String) -> Result<(), Box<dyn std::error::Error>> {
    /* group by - sum */
    let sep_u8 = sep.into_bytes()[0];
    let idx: Vec<&str> = index.split(',').collect();
    let val: Vec<&str> = values.split(',').collect();
    let file_path = path::Path::new(&path);

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

pub fn unique_value(path: String, sep: String, column: String) -> Result<(), Box<dyn std::error::Error>> {
    /* Getting a unique value for a column */
    let sep_u8 = sep.into_bytes()[0];
    let file_path = path::Path::new(&path);

    // Convert col field datatype to utf8
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
