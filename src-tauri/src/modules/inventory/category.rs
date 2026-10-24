use tauri::State;
use std::format;
use serde_json::json;
use log::{info, trace};
use diesel::prelude::*;
use diesel::dsl::insert_into;

use crate::utils::util::uppercase_words;
use crate::constants::constant::Constants;
use crate::domain::api_response::ApiResponse;
use crate::models::category_model::{Category, NewCategory};
use crate::domain::dto::request::category_dto::NewCategoryDto;
use crate::infrastructure::db::connections::mysql::mysql_connection::DbPool;

#[tauri::command]
pub async fn create_new_category(state: State<'_, DbPool>, request: NewCategoryDto) -> Result<ApiResponse, ApiResponse> {
  trace!("#Creacion nueva categoria");
  trace!(">>> request {:?}", request);
  use crate::schema::categories;

  let mut conn = state.get().map_err(|e| {
      ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e))
  })?;
  
  let result_query = categories::table
    .filter(categories::category_name.eq(&request.name_category))
    .select(Category::as_select())
    .load::<Category>(&mut conn)
    .map_err(|e: diesel::result::Error| ApiResponse::new_error(format!("ERROR"), 404, format!("Al buscar la categoria {:?}", e)))?;

  if result_query.is_empty() {
    info!("#crea nueva categoria");
    
    let new_category: NewCategory = NewCategory {
      category_name: uppercase_words(request.name_category),
      modify_by: request.user_name,
      state: Constants::ACTIVO
    };

    insert_into(categories::table)
      .values(new_category)
      .execute(&mut conn)
      .map_err(|e: diesel::result::Error| ApiResponse::new_error(format!("ERROR"), 404, format!("Al insertar el nuevo registro {:?}", e)))?;

    return Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("Nueva Categoria Creada"), json!({})));
  }

  Ok(ApiResponse::new_error("ERROR".to_string(), 404, "El nombre de la categoria ya existe".to_uppercase()))
}
