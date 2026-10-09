use std::collections::HashMap;
use std::format;

use tauri::State;
use serde_json::{Value, json};
use log::{info, trace};
//use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper};
use diesel::prelude::*;

use crate::domain::api_response::ApiResponse;
use crate::domain::dto::request::login_dto::UserDto;
use crate::domain::json_template::TemplateJson;
use crate::models::employee_model::Employee;
use crate::{infrastructure::db::connections::mysql::mysql_connection::DbPool};
use crate::constants::constant::Constants;

#[tauri::command]
pub async fn authentication(state: State<'_, DbPool>, request: UserDto) ->  Result<ApiResponse, ApiResponse> {
  use crate::schema::employees;
  use crate::schema::roles;
  use crate::schema::permissions;
  use crate::schema::menus;

  trace!(">>> Request {:?}", request);
  let mut conn = state.get().map_err(|e| ApiResponse::new_error("error ".to_string(), 500, format!("{:?}", e)))?;

  let result_employee = employees::table
    .filter(employees::user_name.eq(&request.user_name))
    .select(Employee::as_select())
    .first(&mut conn)
    .map_err(|e| ApiResponse::new_error(format!("ERROR"), Constants::UNAUTHORIZED, format!("Usuario o contraseña incorrectos {:?}", e)))?;
  
  trace!("result_employee {:?}", result_employee);

  if !result_employee.password.eq(&request.password){
    return Err(ApiResponse::new_error(format!("ERROR"), Constants::UNAUTHORIZED, format!("Usuario o contraseña incorrectos")));
  }

  if result_employee.state == Constants::INACTIVO {
    return Err(ApiResponse::new_error(format!("ERROR"), Constants::UNAUTHORIZED, format!("Usuario Inactivo")));
  }

  let associated_menus: Vec<(String, String)> = employees::table
    .inner_join(roles::table.on(roles::id_role.eq(employees::role_id)))
    .inner_join(permissions::table.on(permissions::role_id.eq(roles::id_role)))
    .inner_join(menus::table.on(menus::id_menu.eq(permissions::menu_id)))
    .filter(employees::user_name.eq(&request.user_name))
    .select((menus::title_menu, menus::route))
    .load(&mut conn)
    .map_err(|e| ApiResponse::new_error(format!("ERROR"), 404, format!("El empleado NO tiene menus asociados {:?}", e)))?;

  info!("associated_menus {:?}", associated_menus);

  for ss in &associated_menus {
    trace!("{} and {} ", ss.0, ss.1)
  }

  //TODO: armar el array de json para mandarlo al frontend
  let ss: TemplateJson;
  let mut dd: HashMap<String, Value> = HashMap::new();
  for menu in &associated_menus {
    dd.insert(menu.0.clone(), Value::Number(221.into()));
  }


  Ok(ApiResponse::new_success("status_code".to_string(), 200, "message".to_string(), json!({"sss":222})))
}