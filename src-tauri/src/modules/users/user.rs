use std::format;
use tauri::State;
use serde_json::json;
use log::{info, trace, error};
use diesel::dsl::{insert_into, update};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::{BoolExpressionMethods, ExpressionMethods, JoinOnDsl, MysqlConnection, OptionalExtension, QueryDsl, RunQueryDsl, SelectableHelper, TextExpressionMethods};

use crate::constants::action::ActionsCrud;
use crate::constants::constant::Constants;
use crate::models::employee_model::Employee;
use crate::domain::api_response::ApiResponse;
use crate::domain::dto::response::roles_dto::{RolesDto};
use crate::domain::dto::request::employee_dto::{NewUserDto, UpdateStateForCheckedDto};
use crate::domain::dto::response::employee_dto::{EmployeesDto};
use crate::infrastructure::db::connections::mysql::mysql_connection::DbPool;

#[tauri::command]
pub async fn crud_user(state: State<'_, DbPool>, request: NewUserDto) -> Result<ApiResponse, ApiResponse> {
  trace!("#crud_user");
  trace!(">>> Request {:?}", request.type_action);
  
  let mut conn = state.get().map_err(|e| {
    ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e))
  })?;

  let result = match request.type_action {
    ActionsCrud::ADD => insert_user(&mut conn, request),

    _ => {
    return Ok(ApiResponse::new_success(
      "OK".to_string(), 
      Constants::OK,
      "Opción invalida".to_string(),
      json!({})
    ));
    }
  }?;
  
  Ok(result)
}

fn insert_user(
  conn: &mut PooledConnection<ConnectionManager<MysqlConnection>>,
  request: NewUserDto) 
  -> Result<ApiResponse, ApiResponse> {
  
  use crate::schema::employees::dsl::{employees, employee_identity, user_name};

  trace!("#insert_user");
  trace!(">>> Request {:?}", request);
  
  let user_identity = request.employee_identity.clone();
  let user_name_copy = request.user_name.clone();
  let exist_user: Option<Employee> = employees
    .filter(employee_identity.eq(&user_identity).or(user_name.eq(&user_name_copy)))
    .select(Employee::as_select())
    .first::<Employee>(conn)
    .optional()
    .map_err(|e| {
      ApiResponse::new_error(
      format!("ERROR"),
      Constants::UNAUTHORIZED,
      format!("Error al buscar el usuario {:?}", e),
      )
    })?;

  info!("#Empleado encontrado {:?}", exist_user.is_some());

  if let Some(emp) = exist_user {
    if emp.user_name == user_name_copy {
      info!("<<< El user_name ya existe {:?}", request.user_name);
      return Ok(ApiResponse::new_success(
      "ERROR".to_string(),
      Constants::CONFLICT,
      "El userName ya existe".to_string(),
      json!({})
      ));
    }

    if emp.employee_identity == user_identity {
      info!("<<< La identidad ya existe {:?}", request.employee_identity);
      return Ok(ApiResponse::new_success(
      "ERROR".to_string(),
      Constants::CONFLICT,
      "La identidad del empleado ya existe".to_string(),
      json!({})
      ));
    }
  }

  let new_user: Employee = Employee {
    employee_identity: request.employee_identity
    ,role_id: request.role_id
    ,first_name: request.first_name
    ,last_name: request.last_name
    ,user_name: request.user_name
    ,password: request.password
    ,state: Constants::ACTIVO
  };

  insert_into(employees)
    .values(new_user)
    .execute(conn)
    .map_err(|e: diesel::result::Error| {
      error!("Error al insertar en employees: {:?}", e);
      ApiResponse::new_error(
        "ERROR".to_string(),
        500,
        "No se pudo crear el nuevo empleado".to_string(),
      )
    })?;

  Ok(ApiResponse::new_success(
    "OK".to_string(),
    Constants::OK,
    "Nuevo empleado creado".to_string(),
    json!({})
  ))
}

#[tauri::command]
pub async fn get_roles(state_tauri: State<'_, DbPool>) -> Result<ApiResponse, ApiResponse> {
  trace!("#get_roles");
  use crate::schema::roles::dsl::{state, id_role, role_name, roles};

  let mut conn = state_tauri.get().map_err(|e| ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e)))?;

  let result_roles = roles
    .filter(state.eq(Constants::ACTIVO))
    .select((id_role, role_name))
    .order_by(role_name.desc())
    .load::<RolesDto>(&mut conn)
    .map_err(|e| ApiResponse::new_error(format!("ERROR"), 404, format!("Error al consultar las categorias {:?}", e)))?;

  if result_roles.is_empty(){
    return Ok(ApiResponse::new_success(
      "OK".to_string(),
      Constants::OK, 
      "No hay roles".to_string(), 
      json!({"roles": result_roles})
    ));
  }

  info!("#result_roles {:?}", result_roles);
  
  Ok(ApiResponse::new_success(
    "OK".to_string(),
    Constants::OK,
    "Lista de roles".to_string(),
    json!({"roles": result_roles})
  ))
}

#[tauri::command]
pub async fn get_employees(state_tauri: State<'_, DbPool>) -> Result<ApiResponse, ApiResponse> {
  trace!("#get_employees");
  use crate::schema::roles::dsl::{roles, role_name, id_role};
  use crate::schema::employees::dsl::{employees, state, first_name, last_name, user_name, role_id};
  
  let mut conn = state_tauri.get().map_err(|e| ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e)))?;

  let result_employees: Vec<EmployeesDto> = employees
    .inner_join(roles.on(id_role.eq(role_id)))
    .select((role_name
      , state.eq(Constants::ACTIVO)
      , first_name.concat(" ").concat(last_name)
      , user_name
    ))
    .order_by(state.desc())
    .load::<EmployeesDto>(&mut conn)
    .map_err(|e: diesel::result::Error| {
      error!("Error al obtener la lista de empleados: {:?}", e);
      ApiResponse::new_error(
        "ERROR".to_string(),
        Constants::ERRORDB,
        "No se pudo obtener la lista de empleados".to_string(),
      )
    })?;

  if result_employees.is_empty() {
    trace!("#List employees {:?}", result_employees);

    return Ok(ApiResponse::new_success(
      "OK".to_string(),
      Constants::OK,
      "No hay empleados".to_string(),
      json!({"employees": []})
    ))
  }

  info!("#List employees {:?}", result_employees);

  Ok(ApiResponse::new_success(
    "OK".to_string(),
    Constants::OK,
    "Lista de empleados".to_string(),
    json!({"employees": result_employees})
  ))
}

#[tauri::command]
pub async fn update_state_checked(state_tauri: State<'_, DbPool>, request: UpdateStateForCheckedDto) -> Result<ApiResponse, ApiResponse> {
  trace!("#update_state_checked");
  trace!(">>> Request {:?}", request);
  use crate::schema::employees::dsl::{employees, state, user_name};
  
  let mut conn = state_tauri.get().map_err(|e| ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e)))?;

  update(employees)
    .filter(user_name.eq(&request.user_name))
    .set(state.eq(request.state as i8))
    .execute(&mut conn)
    .map_err(|e: diesel::result::Error| {
      error!("Error al actualizar el empleado: {:?} {:?}", &request.user_name, e);
      ApiResponse::new_error(
        "ERROR".to_string(),
        Constants::ERRORDB,
        "No se pudo actualizar al empleado".to_string(),
      )
  })?;

  Ok(ApiResponse::new_success(
    "OK".to_string(),
    Constants::OK,
    "Actualización correcta".to_string(), 
    json!({})
  ))
}