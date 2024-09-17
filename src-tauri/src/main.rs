#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use dlib::{
  excel2csv,
  csv2xlsx,
  cat,
  count,
  rename,
  getfilename,
  select,
  search,
  insert,
};

fn main() {
  tauri::Builder
    ::default()
    .invoke_handler(
      tauri::generate_handler![
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
      ]
    )
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
