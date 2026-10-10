use std::format;
use tauri::State;
use serde_json::{json};
use log::{info, trace};
use diesel::prelude::*;

use crate::constants::constant::Constants;
use crate::models::employee_model::Employee;
use crate::domain::api_response::ApiResponse;
use crate::domain::dto::response::auth_dto::AuthDto;
use crate::domain::dto::request::login_dto::UserDto;
use crate::domain::dto::response::associated_menus_dto::MenusDto;
use crate::{infrastructure::db::connections::mysql::mysql_connection::DbPool};

#[tauri::command]
pub async fn authentication(state: State<'_, DbPool>, request: UserDto) ->  Result<ApiResponse, ApiResponse> {
  use crate::schema::employees;
  use crate::schema::roles;
  use crate::schema::permissions;
  use crate::schema::menus;

  trace!(">>> Request {:?}", request);
  let mut conn = state.get().map_err(|e| ApiResponse::new_error("error ".to_string(), 500, format!("{:?}", e)))?;

  let result_employee: Employee = employees::table
    .filter(employees::user_name.eq(&request.user_name))
    .select(Employee::as_select())
    .first(&mut conn)
    .map_err(|e| ApiResponse::new_error(format!("ERROR"), Constants::UNAUTHORIZED, format!("Usuario o contraseña incorrectos {:?}", e)))?;
  
  trace!("result_employee {:?}", result_employee);

  if !result_employee.password.eq(&request.password){
    return Err(ApiResponse::new_error(format!("ERROR"), Constants::UNAUTHORIZED, format!("Usuario o contraseña incorrectos NotFound")));
  }

  if result_employee.state == Constants::INACTIVO {
    info!("<<< user_name {} inactivo", result_employee.user_name);
    return Err(ApiResponse::new_error(format!("ERROR"), Constants::UNAUTHORIZED, format!("Usuario Inactivo")));
  }

  let data_employee: AuthDto = AuthDto {
    identity_employee: result_employee.employee_identity
    , user_name: result_employee.user_name
    , state: result_employee.state 
  };

  /*
  let associated_menus: Vec<MenusDto> = employees::table
    .inner_join(roles::table.on(roles::id_role.eq(employees::role_id)))
    .inner_join(permissions::table.on(permissions::role_id.eq(roles::id_role)))
    .inner_join(menus::table.on(menus::id_menu.eq(permissions::menu_id)))
    .filter(employees::user_name.eq(&request.user_name))
    .select((menus::title_menu, menus::route))
    .load::<MenusDto>(&mut conn)
    .map_err(|e| ApiResponse::new_error(format!("ERROR"), 404, format!("El empleado NO tiene menus asociados {:?}", e)))?;
   */

  trace!("<<< data_employee {:?}", data_employee);

  Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("Informacion del Empleado"), json!({"employee": data_employee})))
}