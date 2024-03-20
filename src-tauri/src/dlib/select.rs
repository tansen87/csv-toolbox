use std::{
    collections::BTreeMap,
    fs::File,
    io::BufWriter,
    path::Path
};

fn select_columns(path: String, sep: String, cols: String, window: tauri::Window) -> Result<(), Box<dyn std::error::Error>> {
    let mut separator = Vec::new();
    let sep_u8 = if sep == "\\t" {
        b'\t'
    } else {
        sep.into_bytes()[0]
    };
    separator.push(sep_u8);
    let cols_select: Vec<&str> = cols.split('|').collect();
    let vec_path: Vec<&str> = path.split(',').collect();

    let mut countf: usize = 0;
    let mut count_mistake: usize = 0;
    let file_len = vec_path.len();

    for f in vec_path.iter() 
    {   
        let file_path = Path::new(&f);
        let file_name = match file_path.file_name() {
            Some(name) => match name.to_str() {
                Some(name_str) => name_str.split('.').collect::<Vec<&str>>(),
                None => vec![],
            },
            None => vec![],
        };
        let current_time = chrono::Local::now();
        let file_path_copy = file_path.parent()
            .map(|parent| parent.to_string_lossy())
            .unwrap_or_else(|| "Default Path".to_string().into());
        let output_path = format!(
            "{}/{}_select {}.csv",
            file_path_copy,
            file_name[0],
            current_time.format("%Y-%m-%d %H.%M.%S")
        );

        let mut rdr = csv::ReaderBuilder::new()
            .delimiter(separator[0])
            .has_headers(true)
            .from_reader(File::open(f)?);

        let headers = rdr.headers()?.clone();

        // 遍历header以查找所选列的索引
        let mut col_indices: BTreeMap<&str, usize> = BTreeMap::new();
        let mut idx = 0;
        for header in headers.iter() {
            if cols_select.contains(&header) {
                col_indices.insert(header, idx);
            }
            idx += 1;
        }

        // 创建一个向量来存储按照cols_select顺序排列的索引值
        let mut vec_indices = Vec::new();
        for col_select in cols_select.iter() {
            if let Some(&index) = col_indices.get(col_select) {
                vec_indices.push(index);
            }
        }

        let mut wtr = csv::WriterBuilder::new()
            .delimiter(separator[0]) 
            .from_writer(BufWriter::new(File::create(output_path)?));

        wtr.write_record(cols_select.iter())?;
        let mut record = csv::ByteRecord::new();
        // while rdr.read_byte_record(&mut record)? {
        //     wtr.write_record(vec_indices.iter().map(|&i| &record[i]))?;
        // }

        while rdr.read_byte_record(&mut record)? {
            match wtr.write_record(vec_indices.iter().map(|&i| &record[i])) {
                Ok(()) => (),
                Err(e) => {
                    let wtr_msg = format!("{}.{}|error|{}", file_name[0], file_name[1], e);
                    window.emit("wtr_err", wtr_msg)?;
                    count_mistake += 1;
                    break;
                }
            }
        }

        wtr.flush()?;

        if count_mistake == 0 {
            let select_msg = format!("{}.{}", file_name[0], file_name[1]);
            window.emit("select_msg", select_msg.clone())?;
        }

        countf += 1;
        count_mistake = 0;
        let progress = (countf as f32) / (file_len as f32) * 100.0;
        let progress_s = format!("{progress:.0}");
        window.emit("sel_progress", progress_s)?;
    }

    Ok(())
}

#[tauri::command]
pub async fn select(path: String, sep: String, cols: String, window: tauri::Window) {
    let sel_window = window.clone();
    match async { select_columns(path, sep, cols, sel_window) }.await {
        Ok(result) => result,
        Err(err) => {
            eprintln!("select columns error: {err}");
            window.emit("select_err", &err.to_string()).unwrap();
        }
    }
}
