fn count_rows(path: String, sep: String, window: tauri::Window) -> Result<(), Box<dyn std::error::Error>> {
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
        let filename = std::path::Path::new(file).file_name().unwrap();
        let cntmsg = format!("{:?}|{}", filename, count);
        vec_file.push(cntmsg);
        window.emit("cntrows", vec_file.clone())?;
    }

    Ok(())
}

#[tauri::command]
pub async fn count(path: String, sep: String, window: tauri::Window) {
    let count_window = window.clone();
    let _cnt = match async {
        count_rows(path, sep, count_window)
    }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("Error: {}", error);
            window.emit("countErr", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}