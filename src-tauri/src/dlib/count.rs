use std::{
    fs::File,
    path::Path,
    error::Error
};

fn count_rows(path: String, sep: String, window: tauri::Window) -> Result<Vec<String>, Box<dyn Error>> {
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
    let mut countf: usize = 0;
    let file_len = vec_path.len();

    for file in vec_path.iter() {
        let mut rdr = csv::ReaderBuilder::new()
            .delimiter(separator[0])
            .has_headers(true)
            .from_reader(File::open(file)?);

        let mut record = csv::ByteRecord::new();

        rdr.read_byte_record(&mut record)?;
        let mut count: u64 = 1;

        while rdr.read_byte_record(&mut record)? {
            count += 1;
        }
        let filename = Path::new(file).file_name().unwrap().to_str().unwrap();
        let cntmsg = format!("{}|{}", filename, count);
        window.emit("infomsg", cntmsg.clone())?;
        vec_file.push(cntmsg);

        countf += 1;
        let progress = (countf as f32) / (file_len as f32) * 100.0;
        let progress_s = format!("{progress:.0}");
        window.emit("pgscount", progress_s)?;
    }

    Ok(vec_file)
}

#[tauri::command]
pub async fn countr(path: String, sep: String, window: tauri::Window) -> Vec<String> {
    let cnt_window = window.clone();
    let cnt = match async { count_rows(path, sep, cnt_window) }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("Error: {}", error);
            window.emit("countErr", &error.to_string()).unwrap();
            return Vec::new();
        }
    };
    cnt
}