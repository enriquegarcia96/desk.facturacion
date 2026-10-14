use std::format;

use log::{trace};
use tauri::State;
use serde_json::json;
use diesel::prelude::*;

use crate::constants::constant::Constants;
use crate::domain::api_response::ApiResponse;
use crate::domain::dto::request::employee_dto::{InfoEmployeeDto};
use crate::domain::dto::response::associated_menus_dto::{MenusDto};
use crate::{infrastructure::db::connections::mysql::mysql_connection::DbPool};

#[tauri::command]
pub async fn get_menus(state: State<'_, DbPool>, request: InfoEmployeeDto) -> Result<ApiResponse, ApiResponse> {
  trace!(">>> Request {:?}", request);
  use crate::schema::employees;
  use crate::schema::roles;
  use crate::schema::permissions;
  use crate::schema::menus;

  let mut conn = state.get().map_err(|e| ApiResponse::new_error("error ".to_string(), 500, format!("{:?}", e)))?;

  let associated_menus: Vec<MenusDto> = employees::table
    .inner_join(roles::table.on(roles::id_role.eq(employees::role_id)))
    .inner_join(permissions::table.on(permissions::role_id.eq(roles::id_role)))
    .inner_join(menus::table.on(menus::id_menu.eq(permissions::menu_id)))
    .filter(employees::user_name.eq(&request.user_name))
    .filter(employees::state.eq(Constants::ACTIVO))
    .filter(menus::state.eq(Constants::ACTIVO))
    .select((menus::title_menu, menus::route))
    .load::<MenusDto>(&mut conn)
    .map_err(|e| ApiResponse::new_error(format!("ERROR"), 404, format!("El empleado NO tiene menus asociados {:?}", e)))?;

  trace!("associated_menus {:?}", associated_menus);

  Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("Menus del empleado"), json!({"menus": associated_menus})))
}