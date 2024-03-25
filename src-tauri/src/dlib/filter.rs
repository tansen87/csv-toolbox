use std::{
    fs::File,
    io::{BufReader, BufWriter},
    path::PathBuf,
    error::Error
};

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
struct Config {
    conditions: Vec<String>,
}

fn read_yaml(path: String) -> Result<Config, Box<dyn Error>> {
    let yaml_file = File::open(path)?;
    let yaml_reader = BufReader::new(yaml_file);
    let yaml: Config = serde_yaml::from_reader(yaml_reader)?;

    Ok(yaml)
}

pub fn read_csv(path: String, sep: String) -> Result<csv::Reader<BufReader<File>>, Box<dyn Error>> {
    let mut separator = Vec::new();
    let sep_u8 = if sep == "\\t" {
        b'\t'
    } else {
        sep.into_bytes()[0]
    };
    separator.push(sep_u8);

    let file = File::open(path.clone())?;

    let rdr = csv::ReaderBuilder::new()
        .delimiter(separator[0])
        .from_reader(BufReader::new(file));

    Ok(rdr)
}

pub fn write_csv(path: String, sep: String, mode: &str) ->Result<csv::Writer<BufWriter<File>>, Box<dyn Error>> {
    let mut separator = Vec::new();
    let sep_u8 = if sep == "\\t" {
        b'\t'
    } else {
        sep.into_bytes()[0]
    };
    separator.push(sep_u8);

    let path = PathBuf::from(path);
    let file_name = path.file_stem()
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "File stem not found"))?
        .to_str()
        .map_or("", |s| s);

    let path_parent = path.parent()
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "Parent path not found"))?;

    let current_time = chrono::Local::now();
    let current_time_str = current_time.format("%Y-%m-%d-%H%M%S").to_string();
    let mut vec_output = Vec::new();
    match mode {
        "equal" => {
            vec_output.push(format!(
                "{}/{}_equal {}.csv",
                path_parent.display(),
                file_name,
                current_time_str
            ));
        },
        "contains" => {
            vec_output.push(format!(
                "{}/{}_contains {}.csv",
                path_parent.display(),
                file_name,
                current_time_str
            ));
        },
        "startswith" => {
            vec_output.push(format!(
                "{}/{}_startswith {}.csv",
                path_parent.display(),
                file_name,
                current_time_str
            ));
        },
        _ => {}
    }

    let file = File::create(&vec_output[0])?;
    let wtr = csv::WriterBuilder::new()
        .delimiter(separator[0]) 
        .from_writer(BufWriter::new(file));

    Ok(wtr)
}

fn equal_filter(path: String, sep: String, column: String, conditions: Vec<String>, window: tauri::Window) -> Result<(), Box<dyn Error>> {
    let mut count: usize = 0;
    let mut rdr = read_csv(path.clone(), sep.clone())?;

    let headers = rdr.headers()?.clone();

    let name_idx = match headers.iter().position(|field| field == column) {
        Some(idx) => idx,
        None => {
            return Err(format!("The column '{}' was not found in the headers.", column).into());
        }
    };

    let mut wtr = write_csv(path, sep, "equal")?;

    // Write headers to the output file
    wtr.write_record(&headers)?;

    for result in rdr.records() {
        let record = result?;
        let value = record.get(name_idx).unwrap();
        if conditions.contains(&value.to_string()) {
            wtr.write_record(&record)?;
            count += 1;
        }
    }

    window.emit("equal_count", count)?;

    Ok(())
}

fn contains_filter(path: String, sep: String, column: String, conditions: Vec<String>, window: tauri::Window) -> Result<(), Box<dyn Error>> {
    let mut count: usize = 0;
    let mut rdr = read_csv(path.clone(), sep.clone())?;

    let headers = rdr.headers()?.clone();

    let name_idx = match headers.iter().position(|field| field == column) {
        Some(idx) => idx,
        None => {
            return Err(format!("The column '{}' was not found in the headers.", column).into());
        }
    };

    let mut wtr = write_csv(path, sep, "contains")?;

    // Write headers to the output file
    wtr.write_record(&headers)?;

    for result in rdr.records() {
        let record = result?;
        let value = record.get(name_idx).unwrap().to_string();
        let mut found = false;
        for condition in &conditions {
            if value.to_lowercase().contains(&condition.to_lowercase()) {
                found = true;
                break;
            }
        }

        if found {
            wtr.write_record(&record)?;
            count += 1;
        }
    }

    window.emit("contains_count", count)?;

    Ok(())
}

fn startswith_filter(path: String, sep: String, column: String, conditions: Vec<String>, window: tauri::Window) -> Result<(), Box<dyn Error>> {
    let mut count: usize = 0;
    let mut rdr = read_csv(path.clone(), sep.clone())?;

    let headers = rdr.headers()?.clone();

    let name_idx = match headers.iter().position(|field| field == column) {
        Some(idx) => idx,
        None => {
            return Err(format!("The column '{}' was not found in the headers.", column).into());
        }
    };

    let mut wtr = write_csv(path, sep, "startswith")?;

    // Write headers to the output file
    wtr.write_record(&headers)?;

    for result in rdr.records() {
        let record = result?;
        let value = record.get(name_idx).unwrap();
        // Check if any condition matches
        if conditions.iter().any(|cond| value.starts_with(cond)) {
            wtr.write_record(&record)?;
            count += 1;
        }
    }

    window.emit("startswith_count", count)?;

    Ok(())
}

#[tauri::command]
pub async fn filter(path: String, ymlpath: String, sep: String, column: String, mode: String, isinput: bool, condition: String, window: tauri::Window) {
    let equal_window = window.clone();
    let contains_window = window.clone();
    let startswith_window = window.clone();

    if isinput {
        let vec_conditions: Vec<&str> = condition.split('|').collect();
        let vec_strings: Vec<String> = vec_conditions.iter().map(|&condition| condition.to_string()).collect();
        if mode == "equal" 
        {
            match async { equal_filter(path, sep, column, vec_strings, equal_window) }.await {
                Ok(result) => result,
                Err(error) => {
                    eprintln!("equal_filter error: {error}");
                    window.emit("equal_err", &error.to_string()).unwrap();
                    return ();
                }
            };
        } 
        else if mode == "contains" 
        {
            match async { contains_filter(path, sep, column, vec_strings, contains_window) }.await {
                Ok(result) => result,
                Err(error) => {
                    eprintln!("contains_filter error: {error}");
                    window.emit("contains_err", &error.to_string()).unwrap();
                    return ();
                }
            };
        } 
        else if mode == "startswith" 
        {
            match async { startswith_filter(path, sep, column, vec_strings, startswith_window) }.await {
                Ok(result) => result,
                Err(error) => {
                    eprintln!("startswith_filter error: {error}");
                    window.emit("startswith_err", &error.to_string()).unwrap();
                    return ();
                }
            }
        }
    } else {
        let yml_window = window.clone();
        let mut vec_cond = Vec::new();
        let yaml = match read_yaml(ymlpath) {
            Ok(yaml) => yaml,
            Err(e) => {
                let errmsg = format!("Error loading YAML: {:?}", e);
                eprintln!("{}", errmsg);
                yml_window.emit("yml_err", errmsg).unwrap();
                return ();
            },
        };
        for name in &yaml.conditions {
            vec_cond.push(name.to_string())
        }

        if mode == "equal" 
        {
            match async { equal_filter(path, sep, column, vec_cond, equal_window) }.await {
                Ok(result) => result,
                Err(error) => {
                    eprintln!("equal_filter error: {error}");
                    window.emit("equal_err", &error.to_string()).unwrap();
                    return ();
                }
            };
        } 
        else if mode == "contains" 
        {
            match async { contains_filter(path, sep, column, vec_cond, contains_window) }.await {
                Ok(result) => result,
                Err(error) => {
                    eprintln!("contains_filter error: {error}");
                    window.emit("contains_err", &error.to_string()).unwrap();
                    return ();
                }
            };
        } 
        else if mode == "startswith" 
        {
            match async { startswith_filter(path, sep, column, vec_cond, startswith_window) }.await {
                Ok(result) => result,
                Err(error) => {
                    eprintln!("startswith_filter error: {error}");
                    window.emit("startswith_err", &error.to_string()).unwrap();
                    return ();
                }
            }
        }
    }
}
