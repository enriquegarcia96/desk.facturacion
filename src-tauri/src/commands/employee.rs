use tauri::State;

use crate::domain::api_response::ApiResponse;
use crate::domain::dto::request::employee_dto::{NewUserDto, UpdateStateForCheckedDto};
use crate::modules::users::user::{crud_user, get_roles, get_employees, update_state_checked};
use crate::{infrastructure::db::connections::mysql::mysql_connection::DbPool};

#[tauri::command]
pub async fn command_crud_user(state: State<'_, DbPool>, request: NewUserDto) -> Result<ApiResponse, ApiResponse> {
  return crud_user(state, request).await;
}

#[tauri::command]
pub async fn command_get_roles(state: State<'_, DbPool>) -> Result<ApiResponse, ApiResponse> {
  return get_roles(state).await;
}

#[tauri::command]
pub async fn command_get_employees(state: State<'_, DbPool>) -> Result<ApiResponse, ApiResponse> {
  return get_employees(state).await;
}

#[tauri::command]
pub async fn command_update_state(state: State<'_, DbPool>, request: UpdateStateForCheckedDto) -> Result<ApiResponse, ApiResponse> {
  return update_state_checked(state, request).await;
}