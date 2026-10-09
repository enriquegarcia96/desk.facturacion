use tauri::State;

use crate::domain::api_response::ApiResponse;
use crate::modules::auth::auth::authentication;
use crate::domain::dto::request::login_dto::UserDto;
use crate::infrastructure::db::connections::mysql::mysql_connection::DbPool;

#[tauri::command]
pub async fn command_authentication(pool: State<'_, DbPool>, request: UserDto) -> Result<ApiResponse, ApiResponse> {
  return authentication(pool, request).await;
}