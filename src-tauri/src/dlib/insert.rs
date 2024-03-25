use std::{
    error::Error,
    fs::File,
    io::{BufReader, BufWriter},
    path::PathBuf,
    time::Instant
};

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
        .has_headers(true)
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
        "iblank" => {
            vec_output.push(format!(
                "{}/{}_iblank {}.csv",
                path_parent.display(),
                file_name,
                current_time_str
            ));
        },
        "ifill" => {
            vec_output.push(format!(
                "{}/{}_ifill {}.csv",
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

fn insert_col(path: String, sep: String, col: String, input: String) -> Result<(), Box<dyn Error>> {
    let mut vec_col: Vec<&str> = col.split('|').collect::<Vec<&str>>();
    vec_col.reverse();
    let vec_input: Vec<&str> = input.split('|').collect::<Vec<&str>>();
    
    let mut rdr = read_csv(path.clone(), sep.clone())?;
    // 读取原始的列标题
    let mut existing_headers = Vec::new();
    let headers = rdr.headers()?.clone();
    for h in headers.iter() {
        existing_headers.push(h);
    }

    // 检查并插入新列标题
    let insert_idx = headers.len();
    for header in &vec_col {
        if !existing_headers.contains(&header) {
            existing_headers.insert(insert_idx, header);
        }
    }

    let mut wtr = write_csv(path, sep, "ifill")?;

    wtr.write_record(&existing_headers)?;

    existing_headers.clear();
    for h in headers.iter() {
        existing_headers.push(h)
    }

    // 遍历记录并插入新列的空值
    for result in rdr.records() {
        let mut record = result?;

        match vec_col.len() {
            1 => {
                if !existing_headers.contains(&vec_col[0]) {
                    record.push_field(vec_input[0]);
                }
            },
            2 => {
                if !existing_headers.contains(&vec_col[0]) {
                    record.push_field(vec_input[0]);
                }
                if !existing_headers.contains(&vec_col[1]) {
                    record.push_field(vec_input[1]);
                }
            },
            3 => {
                if !existing_headers.contains(&vec_col[0]) {
                    record.push_field(vec_input[0]);
                }
                if !existing_headers.contains(&vec_col[1]) {
                    record.push_field(vec_input[1]);
                }
                if !existing_headers.contains(&vec_col[2]) {
                    record.push_field(vec_input[2]);
                }
            }
            4 => {
                if !existing_headers.contains(&vec_col[0]) {
                    record.push_field(vec_input[0]);
                }
                if !existing_headers.contains(&vec_col[1]) {
                    record.push_field(vec_input[1]);
                }
                if !existing_headers.contains(&vec_col[2]) {
                    record.push_field(vec_input[2]);
                }
                if !existing_headers.contains(&vec_col[3]) {
                    record.push_field(vec_input[3]);
                }
            }
            _ => {} // 如果 vec_col 有超过两个元素，这里可以添加更多的匹配逻辑
        }
        
        wtr.write_record(&record)?;
    }

    Ok(())
}

fn insert_blank_cols(path: String, sep: String) -> Result<(), Box<dyn Error>> {
    let mut rdr = read_csv(path.clone(), sep.clone())?;

    // 读取原始的列标题
    let mut existing_headers = Vec::new();
    let headers = rdr.headers()?.clone();
    for h in headers.iter() {
        existing_headers.push(h);
    }
    
    // 定义要插入的新列标题
    let mut insert_headers = vec![
        "Spotlight Type", "Time Entered", "Time Updated", "UserID Entered", "Name of User Entered",
        "UserID Updated", "Name of User Updated", "Date of Journal", "Journal Type", "Journal Type Description",
        "Journal Description", "Exchange Rate", "Controlling Area for Cost and Profit Centre", "Cost Centre",
        "Cost Centre Description", "Profit Centre",	"Profit Centre Description", "Source Activity or Transaction Code"
    ];
    insert_headers.reverse();

    // 检查并插入新列标题
    let insert_idx = headers.len();
    for header in &insert_headers {
        if !existing_headers.contains(header) {
            existing_headers.insert(insert_idx, header);
        }
    }

    // 创建一个新的写入器，用于写入修改后的CSV文件
    let mut wtr = write_csv(path, sep, "iblank")?;

    // 写入新的标题行
    wtr.write_record(&existing_headers)?;

    existing_headers.clear();
    for h in headers.iter() {
        existing_headers.push(h)
    }

    // 遍历记录并插入新列的空值
    for result in rdr.records() {
        let mut record = result?;

        if !existing_headers.contains(&"Spotlight Type") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Time Entered") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Time Updated") {
            record.push_field("");
        }
        if !existing_headers.contains(&"UserID Entered") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Name of User Entered") {
            record.push_field("");
        }
        if !existing_headers.contains(&"UserID Updated") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Name of User Updated") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Date of Journal") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Journal Type") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Journal Type Description") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Journal Description") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Exchange Rate") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Controlling Area for Cost and Profit Centre") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Cost Centre") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Cost Centre Description") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Profit Centre") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Profit Centre Description") {
            record.push_field("");
        }
        if !existing_headers.contains(&"Source Activity or Transaction Code") {
            record.push_field("");
        }

        wtr.write_record(&record)?;
    }

    Ok(())
}

#[tauri::command]
pub async fn insertcol(path: String, sep: String, col: String, input: String, window: tauri::Window) {
    let start = Instant::now();
    match async { insert_col(path, sep, col, input) }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("insert_col error:: {error}");
            window.emit("insert_col_err", &error.to_string()).unwrap();
            return ();
        }
    };
    let end = Instant::now();
    let elapsed = end.duration_since(start);
    let elapsed_seconds = elapsed.as_secs_f64();
    let run_time = format!("{elapsed_seconds:.2} s");
    window.emit("run_time", run_time).unwrap();
}

#[tauri::command]
pub async fn insertblank(path: String, sep: String, window: tauri::Window) {
    let start = Instant::now();
    match async { insert_blank_cols(path, sep) }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("insert_blank_cols error:: {error}");
            window.emit("insert_blank_cols_err", &error.to_string()).unwrap();
            return ();
        }
    };
    let end = Instant::now();
    let elapsed = end.duration_since(start);
    let elapsed_seconds = elapsed.as_secs_f64();
    let run_time = format!("{elapsed_seconds:.2} s");
    window.emit("run_time", run_time).unwrap();
}