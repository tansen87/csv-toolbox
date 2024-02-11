#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]


use dlib::{
    data4mysql,
    dataprocess,
    excel2csv,
    csv2xlsx,
    count,
    filter,
    sqlp,
    rename
};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            data4mysql::download,
            dataprocess::pivot,
            dataprocess::unique,
            dataprocess::concat,
            dataprocess::concatsp,
            excel2csv::etoc,
            csv2xlsx::ctox,
            count::countr,
            filter::filter,
            sqlp::query,
            rename::get,
            rename::rename,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
