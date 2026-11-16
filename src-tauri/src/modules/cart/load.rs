use std::format;
use tauri::State;
use serde_json::json;
use diesel::prelude::*;
use log::{error, info, trace};

use crate::constants::constant::Constants;
use crate::domain::api_response::ApiResponse;
use crate::domain::dto::response::category_dto::ActiveCategories;
use crate::domain::dto::response::product_dto::ProductsToTableDto;
use crate::domain::dto::request::product_dto::ProductToSearchRequest;
use crate::infrastructure::db::connections::mysql::mysql_connection::{DbPool};

#[tauri::command]
pub async fn get_active_categories(state: State<'_, DbPool>) -> Result<ApiResponse, ApiResponse> {
  trace!("#get_cart_categories");
  
  use crate::schema::categories;

  let mut conn = state.get().map_err(|e| ApiResponse::new_error(format!("Error al obtener el POOL"), Constants::ERRORDB, format!("{:?}", e)))?;

  let result_categories: Vec<ActiveCategories> = categories::table
    .filter(categories::state.eq(Constants::ACTIVO))
    .select((categories::id_category, categories::category_name))
    .order_by(categories::category_name.asc())
    .load::<ActiveCategories>(&mut conn)
    .map_err(|e: diesel::result::Error| {
      error!("Error obtener la lista de categorias: {:?}", e);
      ApiResponse::new_error(
        "ERROR".to_string(),
        Constants::ERRORDB,
        "Error al consultar las categorias".to_string()
      )
    })?;

  if result_categories.is_empty() {
    return Ok(ApiResponse::new_success(
      "OK".to_string(),
      Constants::OK,
      "No hay categorias".to_string(),
      json!({"categories": result_categories})
    ));
  }

  trace!("result_list {:?}", result_categories);

  Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("categorias activas"), json!({"categories": result_categories})))
}

#[tauri::command]
pub async fn search_product(state: State<'_, DbPool>, request: ProductToSearchRequest) -> Result<ApiResponse, ApiResponse> {
  trace!("#search_bar_code_or_category_name");
  trace!(">>> Request: {:?}", request);

  use crate::schema::inventories::dsl::{inventories, product_id, stock_quantity};
  use crate::schema::products::dsl::{products, bar_code, product_name, category_id, sale_price, id_product};

  let mut conn = state.get().map_err(|e| {
    ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e))
  })?;

  let mut query_dynamic = products
    .inner_join(inventories.on(product_id.eq(id_product)))
    .into_boxed();

  if let Some(ref code_bar_or_name) = request.code_bar_or_product_name {
    let pattern  = format!("%{}%", code_bar_or_name.to_lowercase());
    query_dynamic = query_dynamic
      .filter(
        bar_code.eq(code_bar_or_name.to_string())
        .or(product_name.like(pattern))
      );
  }

  if let Some(cat_id) = request.category_id {
    query_dynamic = query_dynamic
      .filter(category_id.eq(cat_id));
  }
  
  let result_products = query_dynamic
    .select((bar_code, product_name, sale_price, stock_quantity, id_product))
    .load::<ProductsToTableDto>(&mut conn)
    .map_err(|e: diesel::result::Error| {
        error!("Error al obtener los productos {:?}", e);
        ApiResponse::new_error(
          "ERROR".to_string(),
          Constants::ERRORDB,
          "No se pudo obtener la lista de productos".to_string(),
        )
    })?;

  info!("#result_products {:?}", result_products);
  
  Ok(ApiResponse::new_success(
    "OK".to_string(),
    Constants::OK,
    "Lista de productos".to_string(),
    json!({"products": result_products})))
}