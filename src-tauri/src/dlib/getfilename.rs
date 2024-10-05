use std::{
  error::Error,
  path::{Path, PathBuf},
};

use tauri::Emitter;

fn get_filename(path: String) -> Result<Vec<String>, Box<dyn Error>> {
  let vec_path: Vec<&str> = path.split(',').collect();
  let mut vec_filename = Vec::new();
  for p in vec_path.iter() {
    let file_path = Path::new(p);
    let file_name = match file_path.file_name() {
      Some(name) => name.to_str().unwrap_or("nil_name"),
      None => {
        return Ok(Vec::new());
      }
    };
    vec_filename.push(file_name.to_string());
  }

  Ok(vec_filename)
}

fn write_xlsx(data: Vec<String>, path: String) -> Result<(), Box<dyn Error>> {
  let vec_path: Vec<&str> = path.split(',').collect();
  let pr = PathBuf::from(vec_path[0]);
  let path_parent = pr
    .parent()
    .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "Parent path not found"))?;
  let current_time = chrono::Local::now();
  let output_path = format!(
    "{}/Filename {}.xlsx",
    path_parent.display(),
    current_time.format("%Y-%m-%d-%H%M%S")
  );
  let mut workbook = rust_xlsxwriter::Workbook::new();
  let worksheet = workbook.add_worksheet();
  worksheet.write_string(0, 0, "FileName".to_string())?;
  for (idx, value) in data.iter().enumerate() {
    worksheet.write_string((idx + 1).try_into()?, 0, value)?;
  }
  workbook.save(output_path)?;

  Ok(())
}

#[tauri::command]
pub async fn filename(path: String, window: tauri::Window) {
  let data = match (async { get_filename(path.clone()) }).await {
    Ok(result) => result,
    Err(error) => {
      window.emit("get_fname_err", &error.to_string()).unwrap();
      return ();
    }
  };
  match (async { write_xlsx(data, path) }).await {
    Ok(result) => result,
    Err(error) => {
      window.emit("write_err", &error.to_string()).unwrap();
      return ();
    }
  }
}
