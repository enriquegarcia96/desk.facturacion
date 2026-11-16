use tauri::State;

use crate::domain::api_response::ApiResponse;
use crate::modules::cart::invoice::{new_invoice};
use crate::domain::dto::request::invoice_dto::NewInvoiceRequest;
use crate::domain::dto::request::product_dto::ProductToSearchRequest;
use crate::modules::cart::load::{get_active_categories, search_product};
use crate::infrastructure::db::connections::mysql::mysql_connection::DbPool;

#[tauri::command]
pub async fn command_active_categories(state: State<'_, DbPool>) -> Result<ApiResponse, ApiResponse> {
  return get_active_categories(state).await;
}

#[tauri::command]
pub async fn command_search_product(state: State<'_, DbPool>, request: ProductToSearchRequest) -> Result<ApiResponse, ApiResponse> {
  return search_product(state, request).await;
}

#[tauri::command]
pub async fn command_new_invoice(state: State<'_, DbPool>, request: NewInvoiceRequest) -> Result<ApiResponse, ApiResponse> {
  return new_invoice(state, request).await;
}
