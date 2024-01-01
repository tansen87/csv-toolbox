use std::{fs, path};
use calamine::{open_workbook_auto, Reader};
use std::io::{BufWriter, Write};

fn write_range(path: String, window: tauri::Window) -> Result<(), Box<dyn std::error::Error>> {
    /* convert excel to csv */
    let vec_path: Vec<&str> = path.split(',').collect();

    for file in vec_path.iter() 
    {
        let sce = path::PathBuf::from(file);
        let dest = sce.with_extension("csv");
        let mut dest = BufWriter::new(fs::File::create(dest)?);
        let mut workbook = open_workbook_auto(&sce)?;
        let sheets = workbook.sheet_names().first().unwrap().to_owned();
        let range = workbook.worksheet_range(&sheets.as_str())?;

        let n = range.get_size().1 - 1;
        for r in range.rows() 
        {
            for (i, c) in r.iter().enumerate() 
            {
                match *c 
                {
                    calamine::DataType::Empty => Ok(()),
                    calamine::DataType::String(ref s)
                    | calamine::DataType::DateTimeIso(ref s)
                    | calamine::DataType::DurationIso(ref s) => write!(dest, "{}", s),
                    calamine::DataType::Float(ref f) 
                    | calamine::DataType::DateTime(ref f) 
                    | calamine::DataType::Duration(ref f) => write!(dest, "{}", f),
                    calamine::DataType::Int(ref i) => write!(dest, "{}", i),
                    calamine::DataType::Error(ref e) => write!(dest, "{:?}", e),
                    calamine::DataType::Bool(ref b) => write!(dest, "{}", b),
                }?;
                if i != n {
                    write!(dest, "|")?;
                }
            }
            write!(dest, "\r\n")?;
        }

        let msg = format!("{} converted.", file);
        window.emit("success_msg", msg)?;
    } 
    Ok(())
}

#[tauri::command]
pub async fn etoc(path: String, window: tauri::Window) {
    let wtr_window = window.clone();
    let file_window = window.clone();
    let _e2c = match async {
        write_range(path, file_window)
    }.await
    {
        Ok(result) => result,
        Err(error) =>
        {
            eprintln!("Error: {}", error);
            wtr_window.emit("etocerr", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}