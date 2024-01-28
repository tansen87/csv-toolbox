fn count_rows(path: String) -> Result<Vec<String>, Box<dyn std::error::Error>> {
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
        let filename = std::path::Path::new(file).file_name().unwrap().to_str().unwrap();
        let cntmsg = format!("{}|{}", filename, count);
        vec_file.push(cntmsg);
    }

    Ok(vec_file)
}

#[tauri::command]
pub async fn countr(path: String, window: tauri::Window) -> Vec<String> {
    let cnt = match async {
        count_rows(path)
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