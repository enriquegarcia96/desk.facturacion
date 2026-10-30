use chrono::Utc;
use std::format;
use tauri::State;
use serde_json::json;
use diesel::prelude::*;
use diesel::MysqlConnection;
use diesel::dsl::insert_into;
use log::{error, info, trace};
use diesel::r2d2::{ConnectionManager, PooledConnection};

use crate::constants::action::ActionsCrud;
use crate::constants::constant::Constants;
use crate::domain::api_response::ApiResponse;
use crate::models::inventory_model::NewInventory;
use crate::models::product_model::{NewProduct, Product};
use crate::domain::dto::request::product_dto::ProductDto;
use crate::domain::dto::response::product_dto::ProductsDto;
use crate::domain::dto::request::category_dto::CategoryRequest;
use crate::infrastructure::db::connections::mysql::mysql_connection::DbPool;

#[tauri::command]
pub async fn get_products_by_id_category(
  state: State<'_, DbPool>,
  request: CategoryRequest,
) -> Result<ApiResponse, ApiResponse> {
  trace!("#get_products_by_id_category");
  trace!(">>> Request {:?}", request);
  use crate::schema::inventories::dsl::{inventories, product_id, stock_quantity};
  use crate::schema::products::dsl::{
      category_id, id_product, product_name, products, sale_price,
  };

  let mut conn = state.get().map_err(|e| {
      ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e))
  })?;

  let result_products = products
  .inner_join(inventories.on(product_id.eq(id_product)))
  .filter(category_id.eq(request.id_category))
  .select((id_product, product_name, stock_quantity, sale_price))
  .load::<ProductsDto>(&mut conn)
  .map_err(|e| {
      error!("Error al obtener la lista de productos {:?}", e);
      ApiResponse::new_error(
          "ERROR".to_string(),
          500,
          "No se pudo obtener la lista de productos asociados".to_string(),
      )
  })?;

  if result_products.is_empty() {
      return Ok(ApiResponse::new_success(
          format!("OK"),
          Constants::OK,
          format!("No hay productos asociados"),
          json!({"products": []}),
      ));
  }

  Ok(ApiResponse::new_success(
      format!("OK"),
      Constants::OK,
      format!("Lista de productos"),
      json!({"products": result_products}),
  ))
}

#[tauri::command]
pub async fn crud_product(
  state: State<'_, DbPool>,
  request: ProductDto,
) -> Result<ApiResponse, ApiResponse> {
  trace!("#crud_product");
  trace!("Type Action {:?}", request.type_action);

  let mut conn = state.get().map_err(|e| {
    ApiResponse::new_error(format!("Error al obtener el POOL"), 500, format!("{:?}", e))
  })?;

  let result = match request.type_action {
    ActionsCrud::ADD => insert_product(&mut conn, request),
    //ActionsCrud::EDIT => update_product(conn, request),
    //ActionsCrud::DELETE => delete_product(conn, request),
    _ => {
    return Ok(ApiResponse::new_success(
    format!("OK"),
    Constants::OK,
    format!("Opción invalida"),
    json!({}),
    ))
    }
  }?;

  Ok(result)
}

fn insert_product(
  conn: &mut PooledConnection<ConnectionManager<MysqlConnection>>,
  request: ProductDto,
) -> Result<ApiResponse, ApiResponse> {
  trace!("#insert_product");
  trace!(">>> Request {:?}", request);

  use crate::schema::inventories::dsl::inventories;
  use crate::schema::products::dsl::{bar_code, id_product, products};

  let product_bar_code = request.bar_code.clone();
  let new_product: NewProduct = NewProduct {
      product_name: request.product_name,
      modify_by: request.modify_by,
      sale_price: request.sale_price,
      cost_price: request.cost_price,
      created_on: Some(Utc::now().naive_utc()),
      updated_on: None,
      bar_code: request.bar_code,
      category_id: request.category_id,
      id_unit_of_measure: request.type_measure,
  };

  let exist_product: Option<Product> = products
      .filter(bar_code.eq(product_bar_code))
      .select(Product::as_select())
      .first::<Product>(conn)
      .optional()
      .map_err(|e| {
          ApiResponse::new_error(
          format!("ERROR"),
          Constants::UNAUTHORIZED,
          format!("error al buscar el producto {:?}", e),
          )
      })?;

  info!("#Producto encontrado? {:?}", exist_product.is_some());
  
  if exist_product.is_some() {
      return Err(ApiResponse::new_error(
        "ERROR".to_string(),
        Constants::CONFLICT,
        "El codigo de barra ya existe".to_string()
      ));
  }

  insert_into(products)
      .values(new_product)
      .execute(conn)
      .map_err(|e: diesel::result::Error| {
          error!("Error al insertar en productos: {:?}", e);
          ApiResponse::new_error(
              "ERROR".to_string(),
              500,
              "No se pudo crear el nuevo producto".to_string(),
          )
      })?;

  let id_new_product: i32 = products
      .select(id_product)
      .order(id_product.desc())
      .first::<i32>(conn)
      .map_err(|e: diesel::result::Error| {
          error!("Error al obtener el ID del nuevo producto: {:?}", e);
          ApiResponse::new_error(
              "ERROR".to_string(),
              500,
              "No se pudo obtener el ID del nuevo producto".to_string(),
          )
      })?;

  let new_inventory: NewInventory = NewInventory {
      stock_quantity: request.stock_quantity,
      product_id: id_new_product,
  };

  insert_into(inventories)
      .values(new_inventory)
      .execute(conn)
      .map_err(|e: diesel::result::Error| {
        error!("Error al insertar en inventories: {:?}", e);
        ApiResponse::new_error(
            "ERROR".to_string(),
            500,
            "No se pudo crear el nuevo ventario".to_string(),
        )
      })?;

  Ok(ApiResponse::new_success(
      "OK".to_string(),
      Constants::OK,
      "Nuevo Producto creado".to_string(),
      json!({}),
  ))
}

fn update_product(
  mut conn: PooledConnection<ConnectionManager<MysqlConnection>>,
  request: ProductDto,
) -> bool {
  trace!("#update_product");
  trace!(">>> Request {:?}", request);
  return true;
}

fn delete_product(
  mut conn: PooledConnection<ConnectionManager<MysqlConnection>>,
  request: ProductDto,
) -> bool {
  trace!("#delete_product");
  trace!(">>> Request {:?}", request);
  return true;
}
