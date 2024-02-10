use std::{
    error::Error,
    path::PathBuf
};
use rayon::prelude::*;
use calamine::{Reader, Range, DataType};

fn write_range(path: String, window: tauri::Window) -> Result<(), Box<dyn Error>> {
    /* convert excel to csv */
    let vec_path: Vec<&str> = path.split(',').collect();
    let mut count: usize = 0;
    let file_len = vec_path.len();

    for file in vec_path.iter() 
    {
        let sce = PathBuf::from(file);
        let dest = sce.with_extension("csv");
        let mut wtr = csv::WriterBuilder::new()
            .delimiter(b'|')
            .from_path(dest)?;
        let mut workbook = calamine::open_workbook_auto(&sce)?;
        let range = if let Some(result) = workbook.worksheet_range_at(0) {
            result?
        } else {
            Range::empty()
        };

        let (row_count, col_count) = range.get_size();
        // check row count
        if row_count == 0 {
            let warning_msg = format!("{file}| is empty, skipping processing."); 
            window.emit("rowcnterr", warning_msg)?;
            count += 1;
            continue;
        }

        let mut rows_iter = range.rows();

        // amortize allocations
        let mut record = csv::StringRecord::with_capacity(500, col_count);

        let mut col_name: String;

        // get the first row as header
        let first_row = match rows_iter.next() {
            Some(first_row) => first_row,
            None => &[DataType::Empty],
        };
        for cell in first_row 
        {
            col_name = match *cell 
            {
                DataType::String(ref s) => s.to_string(),
                DataType::Empty => String::new(),
                DataType::Error(ref _e) => String::new(),
                DataType::Int(ref i) => i.to_string(),
                DataType::DateTime(ref f) | DataType::Float(ref f) => f.to_string(),
                DataType::Bool(ref b) => b.to_string(),
                DataType::DateTimeIso(ref dt) => dt.to_string(),
                DataType::DurationIso(ref d) => d.to_string(),
                DataType::Duration(ref d) => d.to_string(),
            };
            record.push_field(&col_name);
        }
        wtr.write_record(&record)?;

        let mut rows = Vec::with_capacity(row_count);
        // process rest of the rows
        for row in rows_iter {
            rows.push(row);
        }

        // set RAYON_NUM_THREADS
        let ncpus = 4;
        // set chunk_size to number of rows per core/thread
        // let chunk_size = row_count.div_ceil(ncpus);
        let chunk_size = (row_count + ncpus - 1) / ncpus;

        let processed_rows: Vec<Vec<csv::StringRecord>> = rows
            .par_chunks(chunk_size)
            .map(|chunk| {
                let mut record = csv::StringRecord::with_capacity(500, col_count);
                let mut cell_date_flag: bool = false;
                let mut float_val = 0_f64;
                let mut float_flag: bool = false;
                let mut work_date;
                let mut ryu_buffer = ryu::Buffer::new();
                let mut itoa_buffer = itoa::Buffer::new();

                let mut processed_chunk = Vec::with_capacity(chunk_size);

                for row in chunk 
                {
                    for cell in *row 
                    {
                        match *cell 
                        {
                            DataType::Empty => record.push_field(""),
                            DataType::String(ref s) => record.push_field(s),
                            DataType::Int(ref i) => record.push_field(itoa_buffer.format(*i)),
                            DataType::Float(ref f) => {
                                float_val = *f;
                                float_flag = true;
                                cell_date_flag = false;
                            },
                            DataType::DateTime(ref f) => {
                                float_val = *f;
                                float_flag = true;
                                cell_date_flag = true;
                            },
                            DataType::Error(ref e) => record.push_field(&format!("{e:?}")),
                            DataType::Bool(ref b) => {
                                record.push_field(if *b { "true" } else { "false" });
                            },
                            DataType::DateTimeIso(ref dt) => record.push_field(dt),
                            DataType::DurationIso(ref d) => record.push_field(d),
                            DataType::Duration(ref d) => record.push_field(ryu_buffer.format(*d)),
                        };

                        #[allow(clippy::cast_precision_loss)]
                        if float_flag {
                            if cell_date_flag 
                            {
                                // its a date, so convert it
                                work_date = if float_val.fract() > f64::EPSILON 
                                {
                                    // if it has a fractional part, then its a datetime
                                    if let Some(dt) = cell.as_datetime() {
                                        dt.to_string()
                                    } else {
                                        format!("ERROR: Cannot convert {float_val} to datetime")
                                    }
                                } else if let Some(d) = cell.as_date() {
                                    // if it has no fractional part and calamine can return it
                                    // as_date, then its a date
                                    d.to_string()
                                } else {
                                    format!("ERROR: Cannot convert {float_val} to date")
                                };
                                record.push_field(&work_date);
                                // its not a date, so just push the ryu-formatted float value if its
                                // not an integer or the candidate
                                // integer is too big or too small to be an i64
                            } else if float_val.fract().abs() > f64::EPSILON
                                || float_val > i64::MAX as f64
                                || float_val < i64::MIN as f64
                            {
                                record.push_field(ryu_buffer.format_finite(float_val));
                            } else {
                                // its an i64 integer. We can't use ryu to format it, because it
                                // will be formatted as a
                                // float (have a ".0"). So we use itoa.
                                record.push_field(itoa_buffer.format(float_val as i64));
                            }
                            // reset the float flag
                            float_flag = false;
                        }
                    }

                    processed_chunk.push(record.clone());
                    record.clear();
                }
                processed_chunk
            })
            .collect();

        for processed_chunk in processed_rows {
            for processed_row in processed_chunk {
                wtr.write_record(&processed_row)?;
            }
        }

        wtr.flush()?;

        let info_msg = format!("{}|done", file);
        window.emit("infomsg", info_msg)?;

        count += 1;
        let progress = (count as f32) / (file_len as f32) * 100.0;
        let progress_s = format!("{progress:.0}");
        window.emit("pgse2c", progress_s)?;
    }

    Ok(())
}

#[tauri::command]
pub async fn etoc(path: String, window: tauri::Window) {
    let file_window = window.clone();
    match async { write_range(path, file_window) }.await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("Error: {}", error);
            window.emit("etocerr", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}