use rayon::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
struct Config {
    conditions: Vec<String>,
}

fn read_yaml(path: String) -> Result<Config, Box<dyn std::error::Error>> {
    let yaml_file = std::fs::File::open(path)?;
    let yaml_reader = std::io::BufReader::new(yaml_file);
    let yaml: Config = serde_yaml::from_reader(yaml_reader)?;
    Ok(yaml)
}

fn isin_write(path: String, data: Vec<Vec<String>>) -> Result<(), Box<dyn std::error::Error>> {
    let file_path = std::path::Path::new(&path);
    let file_name: Vec<&str> = file_path.file_name().unwrap().to_str().unwrap().split('.').collect();
    let current_time = chrono::Local::now();
    let file_path_copy = file_path.parent().unwrap().to_string_lossy();
    let output_path = format!("{}/{}_isin {}.csv", file_path_copy, file_name[0], current_time.format("%Y-%m-%d %H.%M.%S"));
    let mut wtr = csv::WriterBuilder::new()
        .delimiter(b'|')
        .from_writer(std::fs::File::create(output_path)?);
    let mut buffer = Vec::new();
    for row in data 
    {
        buffer.push(row);
        if buffer.len() >= 1000 {
            for buffer_row in &buffer {
                wtr.write_record(buffer_row)?;
            }
            buffer.clear();
        }
    }
    for buffer_row in &buffer {
        wtr.write_record(buffer_row)?;
    }
    wtr.flush()?;
    Ok(())
}

fn isin_select(path: String, sep: String, column: String, conditions: Vec<String>) -> Result<Vec<Vec<String>>, Box<dyn std::error::Error>> {
    let mut separator = Vec::new();
    if sep.clone() == "\\t" {
        let sep_u8 = b'\t';
        separator.push(sep_u8);
    } else {
        let sep_u8 = sep.into_bytes()[0];
        separator.push(sep_u8);
    }
    let rdr = std::io::BufReader::new(std::fs::File::open(path)?);
    let mut reader = csv::ReaderBuilder::new()
        .delimiter(separator[0])
        .from_reader(rdr);
    let headers = reader.headers()?.clone();
    let name_idx = match headers.iter().position(|field| field == column) {
        Some(idx) => idx,
        None => {
            return Err(format!("The column '{}' was not found in the headers.", column).into());
        }
    };
    let filter_rows: Vec<Vec<String>> = reader.records()
        .par_bridge()
        .filter_map(|record| {
            let record = record.ok()?;
            let values: Vec<String> = record.iter().map(|value| value.to_owned()).collect();
            if conditions.iter().any(|condition| values[name_idx] == condition.to_string().as_str()) {
                Some(values)
            } else {
                None
            }
        }).collect();
    let mut result = Vec::with_capacity(filter_rows.len() + 1);
    result.push(headers.iter().map(|h| h.to_string()).collect());
    result.extend(filter_rows);

    Ok(result)
}

#[tauri::command]
pub async fn isin(path: String, ymlpath: String, sep: String, column: String, window: tauri::Window) {
    let yaml = read_yaml(ymlpath).unwrap();
    let mut vec_cond = Vec::new();
    let isin_window = window.clone();
    for name in &yaml.conditions {
        vec_cond.push(name.to_string())
    }
    let data: Vec<Vec<String>> = match async {
        isin_select(path.clone(), sep, column, vec_cond)
    }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("Error: {}", error);
            isin_window.emit("isinErr", &error.to_string()).unwrap();
            return ();
        }
    };
    match async {
        isin_write(path, data)
    }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("Error: {}", error);
            window.emit("isinWriteErr", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}