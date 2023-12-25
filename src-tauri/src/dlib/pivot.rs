use std::path;
use polars::{prelude::*, lazy::dsl::col};
use polars::datatypes;
use polars::datatypes::DataType;
use rust_xlsxwriter::*;


pub fn pivot_table(path: String, sep: u8, index: String, values: String) -> Result<(), Box<dyn std::error::Error>> {
    let idx: Vec<&str> = index.split(',').collect();
    let val: Vec<&str> = values.split(',').collect();
    let file_path = path::Path::new(&path);
    let file_name: Vec<&str> = file_path.file_name().unwrap().to_str().unwrap().split('.').collect();
    let mut schema = Schema::new();
    for i in idx.iter() {
        schema.with_column(i.to_string().into(), DataType::Utf8);
    }
    let lf = LazyCsvReader::new(&file_path)
        .with_delimiter(sep)
        .with_dtype_overwrite(Some(&Arc::new(schema)))
        .finish()?;
    // group by
    if val.len() == 1 
    {
        let gb = lf.group_by(idx)
        .agg([
            col(val[0]).sum()
        ]).collect()?;
        let header = gb.get_column_names();
        let mut workbook = Workbook::new();
        let worksheet = workbook.add_worksheet();
        for (col, col_name) in header.iter().enumerate() {
            worksheet.write_string(0, col.try_into()?, col_name.to_string())?;
        }

        for (row, row_data) in gb.iter().enumerate() 
        {
            for (col, col_data) in row_data.iter().enumerate() 
            {
                match col_data 
                {
                    datatypes::AnyValue::Float64(values) => {
                        worksheet.write_number((col+1).try_into()?, row.try_into()?, values)?;
                    }
                    datatypes::AnyValue::Utf8(values) => {
                        worksheet.write_string((col+1).try_into()?, row.try_into()?, values.to_string())?;
                    }
                    _ => {
                        worksheet.write_string((col+1).try_into()?, row.try_into()?, col_data.to_string())?;
                    },
                }
            }
        }
        let output_path = format!("{}/{}_pt.xlsx", file_path.parent().unwrap().to_string_lossy(), file_name[0]);
        workbook.save(output_path)?;
    }
    else if val.len() == 2
    {
        let gb = lf.group_by(idx)
        .agg([
            col(val[0]).sum(),
            col(val[1]).sum()
        ]).collect()?;
        let header = gb.get_column_names();
        let mut workbook = Workbook::new();
        let worksheet = workbook.add_worksheet();
        for (col, col_name) in header.iter().enumerate() {
            worksheet.write_string(0, col.try_into()?, col_name.to_string())?;
        }

        for (row, row_data) in gb.iter().enumerate() 
        {
            for (col, col_data) in row_data.iter().enumerate() 
            {
                match col_data 
                {
                    datatypes::AnyValue::Float64(values) => {
                        worksheet.write_number((col+1).try_into()?, row.try_into()?, values)?;
                    }
                    datatypes::AnyValue::Utf8(values) => {
                        worksheet.write_string((col+1).try_into()?, row.try_into()?, values.to_string())?;
                    }
                    _ => {
                        worksheet.write_string((col+1).try_into()?, row.try_into()?, col_data.to_string())?;
                    },
                }
            }
        }
        let output_path = format!("{}/{}_pt.xlsx", file_path.parent().unwrap().to_string_lossy(), file_name[0]);
        workbook.save(output_path)?;
    }
    else 
    {
        eprintln!("[warning] - Only supports up to two variables.");
    }
    Ok(())
}

#[tauri::command]
pub fn pivot(path: String, sep: String, index: String, values: String, window: tauri::Window) -> String {
    let sepu8 = sep.into_bytes()[0];
    let _pt = match pivot_table(path, sepu8, index, values)
    {
        Ok(result) => result,
        Err(error) =>
        {
            eprintln!("Error: {}", error);
            window.emit("pivotErr", &error.to_string()).unwrap();
            error.to_string();
        }
    };
    "done".to_string()
}
