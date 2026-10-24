// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod commands;
mod infrastructure;
mod models;
mod modules;
mod schema;
mod domain;
mod constants;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let pool = infrastructure::db::connections::mysql::mysql_connection::create_pool();

  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .manage(pool)
    .invoke_handler(tauri::generate_handler![
      commands::auth::command_authentication
      ,commands::configuration::command_get_menus
      ,commands::inventory::command_get_categories
      ,commands::inventory::command_new_category
      ,commands::inventory::command_get_products
      ,commands::inventory::command_get_units
      ,commands::inventory::command_crud_product
    ])
    .plugin(tauri_plugin_log::Builder::new().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
