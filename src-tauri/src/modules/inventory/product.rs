use std::format;
use diesel::dsl::insert_into;
use log::trace;
use tauri::State;
use serde_json::json;
use diesel::query_dsl::methods::{FilterDsl, SelectDsl};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::{ ExpressionMethods, MysqlConnection, RunQueryDsl};

use crate::constants::constant::Constants;
use crate::schema::products::product_name;
use crate::constants::action::ActionsCrud;
use crate::models::product_model::NewProduct;
use crate::domain::api_response::ApiResponse;
use crate::domain::dto::request::product_dto::ProductDto;
use crate::domain::dto::response::product_dto::ProductsDto;
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

#[tauri::command]
pub async fn crud_product(state: State<'_, DbPool>, request: ProductDto) -> Result<ApiResponse, ApiResponse> {
  trace!("#crud_product");
  trace!(">>> Request {:?}", request);  

  let conn = state.get().map_err(|e| ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e)))?;

  let ss = match request.type_action {
    ActionsCrud::ADD => insert_product(conn, request),
    //ActionsCrud::EDIT => update_product(conn, request),
    //ActionsCrud::DELETE => delete_product(conn, request),
    _ => return Ok(ApiResponse::new_success(format!("OK"), Constants::OK, format!("Opción invalida"), json!({})))
  };

  Ok(ApiResponse::new_success(format!("OK"), 200, format!("cruids"), json!({})))
}

fn insert_product(mut conn: PooledConnection<ConnectionManager<MysqlConnection>>, request: ProductDto) -> Result<bool, ApiResponse> {
  trace!("#insert_product");
  trace!(">>> Request {:?}", request);
  use crate::schema::products::dsl::{products};
  //use crate::schema::inventories::dsl::{inventories};

  //TODO validaciones de cada campo

  let new_product: NewProduct = NewProduct {
    product_name: request.product_name
    , modify_by: request.modify_by
    , sale_price: request.sale_price
    , cost_price: request.cost_price
    , created_on: request.created_on
    , updated_on: None
    , bar_code: request.bar_code
    , category_id: request.category_id
    , id_unit_of_measure: request.type_measure
  };

  insert_into(products)
    .values(new_product)
    .execute(&mut conn)
    .map_err(|e: diesel::result::Error| ApiResponse::new_error(format!("ERROR"), 404, format!("Al insertar el nuevo registro {:?}", e)))?;    

  Ok(true)
}

fn update_product(mut conn: PooledConnection<ConnectionManager<MysqlConnection>>, request: ProductDto) -> bool {
  trace!("#insert_product");
  trace!(">>> Request {:?}", request);
  return  true;
}

fn delete_product(mut conn: PooledConnection<ConnectionManager<MysqlConnection>>, request: ProductDto) -> bool {
  trace!("#insert_product");
  trace!(">>> Request {:?}", request);
  return  true;
}