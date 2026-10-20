use std::format;

use log::trace;
use tauri::State;
use serde_json::json;
use diesel::{ ExpressionMethods, RunQueryDsl};
use diesel::query_dsl::methods::{FilterDsl, SelectDsl};

use crate::constants::constant::Constants;
use crate::schema::products::product_name;
use crate::constants::action::ActionsCrud;
use crate::domain::api_response::ApiResponse;
use crate::domain::dto::response::product_dto::ProductsDto;
use crate::domain::dto::request::product_dto::NewProductDto;
use crate::domain::dto::request::category_dto::{CategoryRequest};
use crate::infrastructure::db::connections::mysql::mysql_connection::{DbPool};

#[tauri::command]
pub async fn get_products_by_id_category(state: State<'_, DbPool>, request: CategoryRequest) -> Result<ApiResponse, ApiResponse> {
  trace!("#get_products_by_id_category");
  trace!(">>> Request");
  use crate::schema::products::dsl::{products, category_id, id_product};
  //use crate::schema::categories::dsl::{id_category,category_name,categories};

  let mut conn = state.get().map_err(|e| ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e)))?;

  let result_products = products
    .filter(category_id.eq(request.id_category)
      //.and(category_name.eq(request.category_name))
    )
    .select((id_product, product_name))
    .load::<ProductsDto>(&mut conn)
    .map_err(|e| ApiResponse::new_error(format!("ERROR"), 404, format!("Error al consultar las categorias {:?}", e)))?;

    if result_products.is_empty(){
      return Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("No hay productos asociados"), json!({"products": []})));
    }
    

  Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("Lista de productos"), json!({"products": result_products})))
}
enum Action { Add, Edit, Delete }
#[tauri::command]
pub async fn crud_product(state: State<'_, DbPool>, request: NewProductDto) -> Result<ApiResponse, ApiResponse> {
  trace!("#crud_product");
  trace!(">>> Request {:?}", request);  

  let mut conn = state.get().map_err(|e| ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e)))?;

  let sss: bool = match request.type_action {
    ActionsCrud::ADD => insert_product(conn, request),
    ActionsCrud::EDIT => update_product(conn, request),
    ActionsCrud::DELETE => delete_product(conn, request),
    _ => return Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("Opcion invalida"), json!({})))
  };

  Ok(ApiResponse::new_success(format!("OK"), 200, format!("cruids"), json!({"":[]})))
}

fn insert_product(conn: State<'_, Pool<ConnectionManager<MysqlConnection>>>, request: NewProductDto) -> bool {
  trace!("#insert_product");
  trace!(">>> Request {:?}", request);
  return  true;
}

fn update_product(state: State<'_, DbPool>, request: NewProductDto) -> bool {
  trace!("#insert_product");
  trace!(">>> Request {:?}", request);
  return  true;
}

fn delete_product(state: State<'_, DbPool>, request: NewProductDto) -> bool {
  trace!("#insert_product");
  trace!(">>> Request {:?}", request);
  return  true;
}