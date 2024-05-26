use std::{ error::Error, path::{ Path, PathBuf } };

use polars::{
  io::csv::read::{ CsvReadOptions, CsvParseOptions },
  frame::DataFrame,
  datatypes::{ DataType, AnyValue },
  prelude::{ Arc, SerReader },
};

fn write_xlsx(df: DataFrame, dest: PathBuf) -> Result<(), Box<dyn Error>> {
  /* write dataframe to xlsx */
  let mut workbook = rust_xlsxwriter::Workbook::new();
  let worksheet = workbook.add_worksheet();

  // write headers to xlsx
  let headers = df.get_column_names();
  for (col, col_name) in headers.iter().enumerate() {
    worksheet.write_string(0, col.try_into()?, col_name.to_string())?;
  }

  // write data to xlsx
  for (row, row_data) in df.iter().enumerate() {
    for (col, col_data) in row_data.iter().enumerate() {
      match col_data {
        AnyValue::Float64(values) => {
          worksheet.write_number((col + 1).try_into()?, row.try_into()?, values)?;
        }
        AnyValue::Float32(values) => {
          worksheet.write_string((col + 1).try_into()?, row.try_into()?, values.to_string())?;
        }
        AnyValue::String(values) => {
          worksheet.write_string((col + 1).try_into()?, row.try_into()?, values)?;
        }
        AnyValue::Int64(values) => {
          worksheet.write_string((col + 1).try_into()?, row.try_into()?, values.to_string())?;
        }
        AnyValue::Int32(values) => {
          worksheet.write_string((col + 1).try_into()?, row.try_into()?, values.to_string())?;
        }
        AnyValue::Int16(values) => {
          worksheet.write_string((col + 1).try_into()?, row.try_into()?, values.to_string())?;
        }
        AnyValue::Int8(values) => {
          worksheet.write_string((col + 1).try_into()?, row.try_into()?, values.to_string())?;
        }
        AnyValue::UInt32(values) => {
          worksheet.write_string((col + 1).try_into()?, row.try_into()?, values.to_string())?;
        }
        AnyValue::UInt16(values) => {
          worksheet.write_string((col + 1).try_into()?, row.try_into()?, values.to_string())?;
        }
        AnyValue::UInt8(values) => {
          worksheet.write_string((col + 1).try_into()?, row.try_into()?, values.to_string())?;
        }
        _ => { }
      }
    }
  }
  workbook.save(dest)?;

  Ok(())
}

fn write_range(
  path: String,
  sep: String,
  window: tauri::Window
) -> Result<(), Box<dyn Error>> {
  /* csv to xlsx */
  let vec_path: Vec<&str> = path.split(',').collect();
  let mut separator = Vec::new();
  if sep.clone() == "\\t" {
    let sep_u8 = b'\t';
    separator.push(sep_u8);
  } else {
    let sep_u8 = sep.into_bytes()[0];
    separator.push(sep_u8);
  }

  let mut count: usize = 0;
  let file_len = vec_path.len();

  for file in vec_path.iter() {
    let file_name = match Path::new(&file).file_name() {
      Some(name) =>
        match name.to_str() {
          Some(name_str) => name_str.split('.').collect::<Vec<&str>>(),
          None => vec![],
        }
      None => vec![],
    };

    let sce = PathBuf::from(file);
    let dest = sce.with_extension("xlsx");
    let df = CsvReadOptions::default()
        .with_parse_options(
          CsvParseOptions::default()
          .with_separator(separator[0])
          .with_missing_is_null(false))
        .with_dtype_overwrite(Some(Arc::new(vec![DataType::String])))
        .try_into_reader_with_file_path(Some(file.into()))?
        .finish()?;
    let rows = df.shape().0;
    if rows < 104_0000 {
      write_xlsx(df, dest)?;
      let c2x_msg = format!("{}", file);
      window.emit("c2x_msg", c2x_msg)?;
    } else {
      let rows_msg = format!("{}.{}|rows:{}, cannot converted.", file_name[0], file_name[1], rows);
      window.emit("rows_err", rows_msg)?;
    }

    count += 1;
    let progress = ((count as f32) / (file_len as f32)) * 100.0;
    let progress_s = format!("{progress:.0}");
    window.emit("c2x_progress", progress_s)?;
  }

  Ok(())
}

#[tauri::command]
pub async fn ctox(path: String, sep: String, window: tauri::Window) {
  let copy_window = window.clone();
  match (async { write_range(path, sep, copy_window) }).await {
    Ok(result) => result,
    Err(error) => {
      eprintln!("write_range error: {error}");
      window.emit("c2x_err", &error.to_string()).unwrap();
      error.to_string();
    }
  };
}
