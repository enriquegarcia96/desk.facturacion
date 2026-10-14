use tauri::State;

use crate::domain::api_response::ApiResponse;
use crate::modules::configurations::menu::{get_menus};
use crate::domain::dto::request::employee_dto::InfoEmployeeDto;
use crate::infrastructure::db::connections::mysql::mysql_connection::DbPool;

#[tauri::command]
pub async fn command_get_menus(pool: State<'_, DbPool>, request: InfoEmployeeDto) -> Result<ApiResponse, ApiResponse> {
  return get_menus(pool, request).await;
}