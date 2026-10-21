use tauri::State;

use crate::domain::api_response::ApiResponse;
use crate::domain::dto::request::product_dto::ProductDto;
use crate::modules::inventory::category::{create_new_category};
use crate::infrastructure::db::connections::mysql::mysql_connection::DbPool;
use crate::domain::dto::request::category_dto::{NewCategoryDto, CategoryRequest};
use crate::modules::inventory::inventorys::{get_categories, get_units_of_measure};
use crate::modules::inventory::product::{get_products_by_id_category, crud_product};

#[tauri::command]
pub async fn command_get_categories(state: State<'_, DbPool>) -> Result<ApiResponse, ApiResponse> {
  return get_categories(state).await;
}

#[tauri::command]
pub async fn command_new_category(state: State<'_, DbPool>, request: NewCategoryDto) -> Result<ApiResponse, ApiResponse> {
  return create_new_category(state, request).await;
}

#[tauri::command]
pub async fn command_get_products(state: State<'_, DbPool>, request: CategoryRequest) -> Result<ApiResponse, ApiResponse> {
  return get_products_by_id_category(state, request).await;
}

#[tauri::command]
pub async fn command_get_units(state: State<'_, DbPool>) -> Result<ApiResponse, ApiResponse> {
  return get_units_of_measure(state).await;
}

#[tauri::command]
pub async fn command_crud_product(state: State<'_, DbPool>, request: ProductDto) -> Result<ApiResponse, ApiResponse> {
  return crud_product(state, request).await;
}