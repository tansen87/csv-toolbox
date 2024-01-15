use polars::{
    io::SerReader,
    frame::DataFrame,
    datatypes::{DataType, AnyValue},
    prelude::{Arc, CsvReader, Schema}
};

fn write_xlsx(df: DataFrame, dest: std::path::PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    /* write dataframe to xlsx */
    println!("{}", df);
    let mut workbook = rust_xlsxwriter::Workbook::new();
    let worksheet = workbook.add_worksheet();

    // write headers to xlsx
    let headers = df.get_column_names();
    for (col, col_name) in headers.iter().enumerate() {
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
                    worksheet.write_string((col+1).try_into()?, row.try_into()?, values)?;
                }
                _ => { },
            }
        }
    }
    workbook.save(dest)?;
    Ok(())
}

fn write_range(path: String, sep: String, column: String, window: tauri::Window) -> Result<(), Box<dyn std::error::Error>> {
    /* csv to xlsx */
    let vec_path: Vec<&str> = path.split(',').collect();
    let vec_col: Vec<&str> = column.split(',').collect();
    let mut separator = Vec::new();
    if sep.clone() == "\\t" {
        let sep_u8 = b'\t';
        separator.push(sep_u8);
    } else {
        let sep_u8 = sep.into_bytes()[0];
        separator.push(sep_u8);
    }

    let mut schema = Schema::new();

    for file in vec_path.iter() 
    {
        let tmp_df = match CsvReader::from_path(file)?
            .with_separator(separator[0])
            .with_n_rows(Some(0))
            .finish()
        {
            Ok(df) => df,
            Err(err) => {
                let err_msg = format!("error: {} | {}", file, err);
                window.emit("readerr", err_msg)?;
                return Err(Box::new(err));
            }
        };
        let headers = tmp_df.get_column_names();
        for s in headers.iter() {
            schema.with_column(s.to_string().into(), DataType::String);
        }
        for num in vec_col.iter() {
            schema.with_column(num.to_string().into(), DataType::Float64);
        }

        let sce = std::path::PathBuf::from(file);
        let dest = sce.with_extension("xlsx");
        let df = CsvReader::from_path(file)?
            .with_separator(separator[0])
            .with_missing_is_null(false)
            .with_dtypes(Some(Arc::new(schema.clone())))
            .finish()?;
        let rows = df.shape().0;
        if rows < 104_0000 {
            write_xlsx(df, dest)?;
        } else {
            let rows_msg = format!("{} - {}, cannot converted.", file, rows);
            window.emit("rowserr", rows_msg)?;
        }
    }
    Ok(())
}

#[tauri::command]
pub async fn ctox(path: String, sep: String, column: String, window: tauri::Window) {
    let copy_window = window.clone();
    let _c2x = match async {
        write_range(path, sep, column, copy_window)
    }.await
    {
        Ok(result) => result,
        Err(error) => {
            eprintln!("Error: {}", error);
            window.emit("ctoxerr", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}