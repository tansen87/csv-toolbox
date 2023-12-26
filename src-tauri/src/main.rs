#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]


use dlib::data4mysql;
use dlib::dataprocess;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            data4mysql::download,
            dataprocess::pivot
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
