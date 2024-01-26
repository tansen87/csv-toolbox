fn count_rows(path: String, window: tauri::Window) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    /* count csv rows */
    let vec_path: Vec<&str> = path.split(',').collect();
    let mut vec_file = Vec::new();
    for file in vec_path.iter() {
        let mut rdr = csv::ReaderBuilder::new()
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

    Ok(vec_file)
}

#[tauri::command]
pub async fn countr(path: String, window: tauri::Window) -> Vec<String> {
    let count_window = window.clone();
    let cnt = match async {
        count_rows(path, count_window)
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