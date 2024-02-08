use std::io::prelude::*;
use std::{
    fs::{File, OpenOptions},
    io::BufReader,
    error::Error
};

use sqlx::{MySqlPool, Row, Column};
use serde::{Deserialize, Serialize};
use futures::TryStreamExt;
// use tauri::api::file;


#[derive(Debug, Deserialize, Serialize)]
pub struct Config {
    url: String,
    // save_path: String,
    // replace_column: String,
    // general_ledger_table: String,
    // trial_balance_table: String,
    project_name: Vec<String>,
}

pub fn read_yaml(file_path: String) -> Result<Config, Box<dyn Error>> {
    let yaml_file = File::open(file_path)?;
    let yaml_reader = BufReader::new(yaml_file);
    let yaml: Config = serde_yaml::from_reader(yaml_reader)?;
    Ok(yaml)
}

async fn prepare_query_data(file_path: String, epath: String) -> Result<(Vec<String>, Config), Box<dyn Error>> {
    // query the code corresponding to the company name
    let yaml = read_yaml(file_path)?;
    let mut vec_code: Vec<String> = Vec::new();
    let mut incorrect_names = Vec::new();
    let pool: sqlx::Pool<sqlx::MySql> = MySqlPool::connect(&yaml.url).await?;
    for name in &yaml.project_name {
        let sql_query_code = format!(
            "SELECT DbName FROM deloitte.b_projectlist WHERE ProjectName = '{}'",
            name
        );
        let unique_code = match sqlx::query(&sql_query_code).fetch_one(&pool).await 
        {
            Ok(result) => result,
            Err(_) => 
            {
                // If the query fails, add the incorrect name to the list
                incorrect_names.push(name.to_string());
                continue;
            }
        };
        let code: &str = unique_code.get(0);
        vec_code.push(code.to_string())
    }

    // Write the incorrect names to a text file
    if !incorrect_names.is_empty() 
    {
        let mut file = match File::create(
            format!("{}/0_error_project.log", &epath)) 
            {
                Ok(file) => file,
                Err(e) => 
                {
                    eprintln!("Error creating file: {}", e);
                    return Err(Box::new(e));
                }
            };
        for name in incorrect_names 
        {
            if let Err(e) = writeln!(file, "{}", name) 
            {
                eprintln!("Error writing to file: {}", e);
            }
        }
    }
    Ok((vec_code, yaml))
}

async fn execute_query_data(vec_code: Vec<String>, yaml: Config, etable: String, rcolumn: String, epath: String, window: tauri::Window) -> Result<(), Box<dyn Error>> {
    let mut company_count = 1;
    let pool: sqlx::Pool<sqlx::MySql> = MySqlPool::connect(&yaml.url).await?;
    let mut message_log = String::new();
    File::create(format!("{}/2_logs.log", &epath)).expect("Failed to create file"); 
    let mut log_file = OpenOptions::new()
        .append(true)
        .open(format!("{}/2_logs.log", &epath))?;
    let mut gl_table = "".to_string();
    let mut tb_table = "".to_string();
    for item in etable.split("&") 
    {
        if item == "凭证表" 
        {
            gl_table = item.to_string();
        } 
        else if item == "科目余额表" 
        {
            tb_table = item.to_string();
        } 
        else if item == "核算项目明细表" 
        {
            gl_table = item.to_string();
        } 
        else if item == "核算项目余额表" 
        {
            tb_table = item.to_string();
        }
    }
    // start query data
    for (idx, code) in vec_code.iter().enumerate()
    {
        let company = yaml.project_name[idx].split("_").nth(2).unwrap_or(&yaml.project_name[idx]);
        let check_msg = format!("Checking {}, please wait...", &company);
        let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
        let check_msg_log = format!("{} => {}\n", &timestamp, &check_msg);
        log_file.write_all(check_msg_log.as_bytes())?;
        window.emit("check", &check_msg)?;
        
        // query gl headers
        let sql_query_header = format!("SELECT * FROM {}.{} LIMIT 10", code, &gl_table);
        match sqlx::query(&sql_query_header).fetch_one(&pool).await 
        {
            Ok(rows) => 
            {
                let col_num = rows.columns().len();
                let mut vec_col_name: Vec<&str> = Vec::new();
                let mut vec_col_type: Vec<String> = Vec::new();
                for num in 0..col_num 
                {
                    vec_col_name.push(rows.column(num).name());
                    vec_col_type.push(rows.column(num).type_info().to_string())
                }
                
                // query gl data
                let sql_query_gl = format!("SELECT * FROM {}.{}", code, &gl_table);
                let mut stream = sqlx::query(&sql_query_gl).fetch(&pool);
                let mut split_filename = yaml.project_name[idx].split("_");
                let filename = split_filename.nth(2).unwrap_or(&yaml.project_name[idx]);

                let emit_msg = format!("({}) {}", company_count, filename);
                let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
                let check_done_log = format!("{} => {}\n", &timestamp, &emit_msg);
                log_file.write_all(check_done_log.as_bytes())?;

                let folder_path = format!("{}\\{}", &epath, &filename);
                if !folder_exists(&folder_path) 
                {
                    std::fs::create_dir(&folder_path)?;
                }

                // gl save path
                let gl_output_path = format!("{}\\{}_{}.csv", &folder_path, &gl_table, filename);
                let mut csv_writer_gl = csv::WriterBuilder::new()
                    .delimiter(b'|')
                    .from_path(gl_output_path)?;
                // write gl headers
                csv_writer_gl.serialize(vec_col_name.clone())?;
                while let Some(row) = stream.try_next().await? 
                {
                    let mut vec_wtr_str = Vec::new();
                    for num in 0..col_num 
                    {
                        let value = match &vec_col_type[num][..] 
                        {
                            "DECIMAL" => 
                            {
                                let num: rust_decimal::Decimal = row.get(num);
                                num.to_string()
                            }
                            "SMALLINT" | "TINYINT" | "INT" => 
                            {
                                let num: i32 = row.get(num);
                                num.to_string()
                            }
                            "INT UNSIGNED" => 
                            {
                                let num: u32 = row.get(num);
                                num.to_string()
                            }
                            _ if vec_col_name[num] == &rcolumn && &gl_table == "凭证表" => 
                            {
                                let value: &str = row.get(num);
                                value.replace("|", "").to_string()
                            }
                            _ => 
                            {
                                let num: &str = row.get(num);
                                num.to_string()
                            }
                        };
                        vec_wtr_str.push(value);
                    }
                    csv_writer_gl.serialize(vec_wtr_str)?;
                }
                csv_writer_gl.flush()?;
                let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
                let out_gl = format!("{}\\{}_{}.csv", &folder_path, filename, &gl_table);
                let out_gl_log = format!("{} => {}\n", &timestamp, out_gl);
                log_file.write_all(out_gl_log.as_bytes())?;

                // query tb
                let sql_query_tb = format!("SELECT * FROM {}.{}", code, &tb_table);
                let data_tb = sqlx::query(&sql_query_tb).fetch_all(&pool).await?;
                let one_tb = sqlx::query(&sql_query_tb).fetch_one(&pool).await?;
                    let col_num = one_tb.columns().len();
                    let mut vec_col_name = Vec::new();
                    let mut vec_col_type = Vec::new();
                    for num in 0..col_num 
                    {
                        vec_col_name.push(one_tb.column(num).name());
                        vec_col_type.push(one_tb.column(num).type_info().to_string())
                    }
                let output_path = format!("{}\\{}_{}.csv", &folder_path, &tb_table, filename);
                let mut csv_writer_tb = csv::WriterBuilder::new()
                    .delimiter(b'|')
                    // .quote_style(csv::QuoteStyle::Always)
                    .from_path(output_path)?;
                csv_writer_tb.write_record(&vec_col_name)?;

                for data in data_tb 
                {
                    let mut vec_wtr_str = Vec::new();
                    for num in 0..col_num 
                    {
                        if vec_col_type[num] == "DECIMAL" 
                        {
                            let num: rust_decimal::Decimal = data.get(num);
                            vec_wtr_str.push(num.to_string())
                        } 
                        else if vec_col_type[num] == "SMALLINT" || vec_col_type[num] == "TINYINT"
                        {
                            let num: i32 = data.get(num);
                            vec_wtr_str.push(num.to_string())
                        } 
                        else 
                        {
                            let num: &str = data.get(num);
                            vec_wtr_str.push(num.to_string())
                        }
                    }
                    csv_writer_tb.serialize(vec_wtr_str)?;
                }
                csv_writer_tb.flush()?;
                let out_tb = format!("{}\\{}_{}.csv", &folder_path, filename, &tb_table);
                let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
                let out_tb_log = format!("{} => {}\n", &timestamp, out_tb);
                log_file.write_all(out_tb_log.as_bytes())?;
                
                company_count += 1;

                let msg_tb = format!("{}\n", filename);
                message_log.push_str(&msg_tb);
                window.emit("message", &emit_msg)?;
            },
            Err(error) => {
                let err_msg = format!("{} | Error: {}", &company, error);
                let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
                let err_msg_log = format!("{} => {}\n", &timestamp, &err_msg);
                window.emit("errcode", &err_msg)?;
                File::create(format!("{}/0_error_company.log", &epath)).expect("Failed to create file");
                let mut err_file = OpenOptions::new()
                    .append(true)
                    .open(format!("{}/0_error_company.log", &epath))?;
                err_file.write_all(err_msg.as_bytes()).expect("Failed to write to file");
                log_file.write_all(&err_msg_log.as_bytes())?;
                continue;
            }
        }
    }
    
    let mut successful_file = File::create(
        format!("{}/1_successful_company.log", &epath)
    ).expect("failed to create file");
    successful_file.write_all(message_log.as_bytes()).expect("failed to write to file");
    let msg_done = "Congratulations! 数据下载成功!".to_string();
    let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
    let msg_done_log = format!("{} => {}\n", &timestamp, &msg_done);
    log_file.write_all(msg_done_log.as_bytes())?;
    Ok(())
}

fn folder_exists(path: &str) -> bool {
    std::fs::metadata(path).is_ok()
}

#[tauri::command]
pub async fn download(etable: String, rcolumn: String, epath: String, file_path: String, window: tauri::Window) {
    let window_prep = window.clone();
    let window_exec = window.clone();
    let pre_epath = epath.clone();
    let (vec_code, yaml) = match prepare_query_data(file_path, pre_epath).await {
        Ok((vec_code, yaml)) => (vec_code, yaml),
        Err(error) => {
            eprintln!("Error: {}", error);
            window_prep.emit("prepareErr", &error.to_string()).unwrap();
            return ();
        }
    };

    match execute_query_data(vec_code, yaml, etable, rcolumn, epath, window).await {
        Ok(result) => result,
        Err(error) => {
            eprintln!("Error: {}", error);
            window_exec.emit("executeErr", &error.to_string()).unwrap();
            error.to_string();
        }
    };
}
