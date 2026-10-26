use tauri::State;

use crate::domain::api_response::ApiResponse;
use crate::modules::users::user::{crud_user, get_roles};
use crate::domain::dto::request::employee_dto::NewUserDto;
use crate::{infrastructure::db::connections::mysql::mysql_connection::DbPool};

#[tauri::command]
pub async fn command_crud_user(state: State<'_, DbPool>, request: NewUserDto) -> Result<ApiResponse, ApiResponse> {
  return crud_user(state, request).await;
}

#[tauri::command]
pub async fn command_get_roles(state: State<'_, DbPool>) -> Result<ApiResponse, ApiResponse> {
  return get_roles(state).await;
}