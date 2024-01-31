fn count_rows(path: String, sep: String) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    /* count csv rows */
    let mut separator = Vec::new();
    if sep.clone() == "\\t" {
        let sep_u8 = b'\t';
        separator.push(sep_u8);
    } else {
        let sep_u8 = sep.into_bytes()[0];
        separator.push(sep_u8);
    }
    let vec_path: Vec<&str> = path.split(',').collect();
    let mut vec_file = Vec::new();
    for file in vec_path.iter() {
        let mut rdr = csv::ReaderBuilder::new()
            .delimiter(separator[0])
            .has_headers(true)
            .from_reader(std::fs::File::open(file)?);

        let mut record = csv::ByteRecord::new();

        rdr.read_byte_record(&mut record)?;
        let mut count: u64 = 1;

        while rdr.read_byte_record(&mut record)? {
            count += 1;
        }
        let filename = std::path::Path::new(file).file_name().unwrap().to_str().unwrap();
        let cntmsg = format!("{}|{}", filename, count);
        vec_file.push(cntmsg);
    }

    Ok(vec_file)
}

#[tauri::command]
pub async fn countr(path: String, sep: String, window: tauri::Window) -> Vec<String> {
    let cnt = match async {
        count_rows(path, sep)
    }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("Error: {}", error);
            window.emit("countErr", &error.to_string()).unwrap();
            return Vec::new();
        }
    };
    cnt
}