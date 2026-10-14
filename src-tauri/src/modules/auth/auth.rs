use std::{format};
use tauri::State;
use serde_json::{json};
use log::{info, trace};
use diesel::prelude::*;

use crate::constants::constant::Constants;
use crate::models::employee_model::Employee;
use crate::domain::api_response::ApiResponse;
use crate::domain::dto::response::auth_dto::AuthDto;
use crate::domain::dto::request::login_dto::UserDto;
use crate::{infrastructure::db::connections::mysql::mysql_connection::DbPool};

#[tauri::command]
pub async fn authentication(state: State<'_, DbPool>, request: UserDto) ->  Result<ApiResponse, ApiResponse> {
  use crate::schema::employees;
  use crate::schema::roles;

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

  let data_employee: Vec<AuthDto> = employees::table
    .inner_join(roles::table.on(roles::id_role.eq(employees::role_id)))
    .filter(employees::user_name.eq(&request.user_name))
    .select((employees::employee_identity, employees::user_name, employees::state, roles::role_name))
    .load::<AuthDto>(&mut conn)
    .map_err(|e| ApiResponse::new_error(format!("ERROR"), 404, format!("El empleado NO tiene menus asociados {:?}", e)))?;

  trace!("<<< data_employee {:?}", data_employee);

  Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("Informacion del Empleado"), json!({"employee": data_employee})))
}