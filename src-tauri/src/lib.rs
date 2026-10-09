// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod commands;
mod infrastructure;
mod models;
mod modules;
mod schema;
mod domain;
mod constants;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let pool = infrastructure::db::connections::mysql::mysql_connection::create_pool();

  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .manage(pool)
    .invoke_handler(tauri::generate_handler![
      commands::auth::command_authentication
    ])
    .plugin(tauri_plugin_log::Builder::new().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
