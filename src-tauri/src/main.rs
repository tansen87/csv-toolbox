#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use dlib::{cat, count, csv2xlsx, excel2csv, getfilename, insert, rename, search, select};

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_os::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_http::init())
    .invoke_handler(tauri::generate_handler![
      excel2csv::etoc,
      csv2xlsx::ctox,
      cat::concat,
      count::count,
      rename::get_rename_headers,
      rename::rename,
      getfilename::filename,
      select::get_select_headers,
      select::select,
      search::get_search_headers,
      search::search,
      insert::insertblank,
      insert::insertcol
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
