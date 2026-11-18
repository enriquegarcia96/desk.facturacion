use tauri::State;

use crate::domain::api_response::ApiResponse;
use crate::modules::cart::invoice::get_products_by_invoice;
use crate::infrastructure::db::connections::mysql::mysql_connection::DbPool;

#[tauri::command]
pub async fn command_products_by_invoice(state: State<'_, DbPool>, invoice_id: i32) -> Result<ApiResponse, ApiResponse> {
  return get_products_by_invoice(state, invoice_id).await;
}