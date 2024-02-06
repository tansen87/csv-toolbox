use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
struct Config {
    conditions: Vec<String>,
}

fn read_yaml(path: String) -> Result<Config, Box<dyn std::error::Error>> {
    let yaml_file = std::fs::File::open(path)?;
    let yaml_reader = std::io::BufReader::new(yaml_file);
    let yaml: Config = serde_yaml::from_reader(yaml_reader)?;
    Ok(yaml)
}

fn equal_filter(path: String, sep: String, column: String, conditions: Vec<String>) -> Result<(), Box<dyn std::error::Error>> {
    let file: std::fs::File = std::fs::File::open(path.clone())?;
    let mut rdr = csv::ReaderBuilder::new()
        .delimiter(sep.as_bytes()[0])
        .from_reader(std::io::BufReader::new(file));

    let headers = rdr.headers()?.clone();

    let name_idx = match headers.iter().position(|field| field == column) {
        Some(idx) => idx,
        None => {
            return Err(format!("The column '{}' was not found in the headers.", column).into());
        }
    };

    let path = std::path::PathBuf::from(path);
    let file_name = path.file_stem()
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "File stem not found"))?
        .to_str()
        .map_or("", |s| s);

    let path_parent = path.parent()
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "Parent path not found"))?;

    let current_time = chrono::Local::now();
    
    let output_path = format!(
        "{}/{}_precision {}.csv",
        path_parent.display(),
        file_name,
        current_time.format("%Y-%m-%d %H.%M.%S")
    );

    let file = std::fs::File::create(&output_path)?;
    let mut wtr = csv::WriterBuilder::new()
        .delimiter(b'|') 
        .from_writer(std::io::BufWriter::new(file));

    // Write headers to the output file
    wtr.write_record(&headers)?;

    for result in rdr.records() {
        let record = result?;
        let value = record.get(name_idx).unwrap();
        if conditions.contains(&value.to_string()) {
            wtr.write_record(&record)?;
        }
    }

    Ok(())
}

fn contains_filter(path: String, sep: String, column: String, conditions: Vec<String>) -> Result<(), Box<dyn std::error::Error>> {
    let file = std::fs::File::open(path.clone())?;
    let mut rdr = csv::ReaderBuilder::new()
        .delimiter(sep.as_bytes()[0])
        .from_reader(std::io::BufReader::new(file));

    let headers = rdr.headers()?.clone();

    let path = std::path::PathBuf::from(path);
    let file_name = path.file_stem()
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "File stem not found"))?
        .to_str()
        .map_or("", |s| s);

    let path_parent = path.parent()
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "Parent path not found"))?;

    let current_time = chrono::Local::now();
    
    let output_path = format!(
        "{}/{}_fuzzy {}.csv",
        path_parent.display(),
        file_name,
        current_time.format("%Y-%m-%d %H.%M.%S")
    );

    let file = std::fs::File::create(&output_path)?;
    let mut wtr = csv::WriterBuilder::new()
        .delimiter(b'|')
        .from_writer(std::io::BufWriter::new(file));

    // Write headers to the output file
    wtr.write_record(&headers)?;

    let name_idx = match headers.iter().position(|field| field == column) {
        Some(idx) => idx,
        None => {
            return Err(format!("The column '{}' was not found in the headers.", column).into());
        }
    };

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
        }
    }

    Ok(())
}

#[tauri::command]
pub async fn filter(path: String, ymlpath: String, sep: String, column: String, mode: String, isinput: bool, condition: String, window: tauri::Window) {
    if isinput {
        let vec_conditions: Vec<&str> = condition.split('|').collect();
        let vec_strings: Vec<String> = vec_conditions.iter().map(|&condition| condition.to_string()).collect();
        if mode == "equal" {
            match async { equal_filter(path, sep, column, vec_strings) }.await {
                Ok(result) => result,
                Err(error) => {
                    eprintln!("Error: {}", error);
                    window.emit("equalErr", &error.to_string()).unwrap();
                    return ();
                }
            };
        } else if mode == "contains" {
            match async { contains_filter(path, sep, column, vec_strings) }.await {
                Ok(result) => result,
                Err(error) => {
                    eprintln!("Error: {}", error);
                    window.emit("containsErr", &error.to_string()).unwrap();
                    return ();
                }
            };
        }
    } else {
        let yml_window = window.clone();
        let mut vec_cond = Vec::new();
        let yaml = match read_yaml(ymlpath) {
            Ok(yaml) => yaml,
            Err(e) => {
                let errmsg = format!("Error loading YAML: {:?}", e);
                eprintln!("{}", errmsg);
                yml_window.emit("ymlerr", errmsg).unwrap();
                return ();
            },
        };
        for name in &yaml.conditions {
            vec_cond.push(name.to_string())
        }

        if mode == "equal" {
            match async { equal_filter(path, sep, column, vec_cond) }.await {
                Ok(result) => result,
                Err(error) => {
                    eprintln!("Error: {}", error);
                    window.emit("equalErr", &error.to_string()).unwrap();
                    return ();
                }
            };
        } else if mode == "contains" {
            match async { contains_filter(path, sep, column, vec_cond) }.await {
                Ok(result) => result,
                Err(error) => {
                    eprintln!("Error: {}", error);
                    window.emit("containsErr", &error.to_string()).unwrap();
                    return ();
                }
            };
        }
    }
}
