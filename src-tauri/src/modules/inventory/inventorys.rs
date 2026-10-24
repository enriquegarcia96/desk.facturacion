use log::trace;
use std::format;
use tauri::State;
use serde_json::json;
use diesel::prelude::*;

use crate::constants::constant::Constants;
use crate::domain::api_response::ApiResponse;
use crate::domain::dto::response::category_dto::CategoryDto;
use crate::domain::dto::response::unit_of_mesuare::UnitOfMeasureDto;
use crate::infrastructure::db::connections::mysql::mysql_connection::{DbPool};

#[tauri::command]
pub async fn get_categories(state: State<'_, DbPool>) -> Result<ApiResponse, ApiResponse> {
  trace!("obtiene la lista de categorias");
  use crate::schema::categories;

  let mut conn = state.get().map_err(|e| ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e)))?;

  let result_categories = categories::table
    .filter(categories::state.eq(Constants::ACTIVO))
    .select((categories::id_category, categories::category_name))
    .order_by(categories::created_on.desc())
    .load::<CategoryDto>(&mut conn)
    .map_err(|e| ApiResponse::new_error(format!("ERROR"), 404, format!("Error al consultar las categorias {:?}", e)))?;

  if result_categories.is_empty() {
    return Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("No hay categorias"), json!({"categories": result_categories})));
  }

  trace!("result_list {:?}", result_categories);

  Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("Lista de categorias"), json!({"categories": result_categories})))
}

#[tauri::command]
pub async fn get_units_of_measure(state: State<'_, DbPool>) -> Result<ApiResponse, ApiResponse> {
  trace!("#get_units_of_measure");
  use crate::schema::units_of_measure::dsl::{units_of_measure, id_unit, name_unit};

  let mut conn = state.get().map_err(|e| ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e)))?;

  let result_units: Vec<UnitOfMeasureDto> = units_of_measure
    .select((id_unit, name_unit))
    .load::<UnitOfMeasureDto>(&mut conn)
    .map_err(|e| ApiResponse::new_error(format!("ERROR"), 404, format!("Error al obtener la lista de metricas {:?}", e)))?;

  if result_units.is_empty(){
    return Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("No se encontraron unidades de medidas"), json!({})));
  }

  Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("Lista de metricas"), json!({"units": result_units})))
}