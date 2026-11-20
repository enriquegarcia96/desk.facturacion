use tauri::State;
use serde_json::json;
use std::fmt::Debug;
use std::str::FromStr;
use rust_decimal::Decimal;
use diesel::dsl::insert_into;
use log::{error, info, trace};

use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, PooledConnection};

use crate::utils::util::{format_utc_as_honduras_time, get_now};
use crate::models::invoice::NewInvoice;
use crate::models::order_model::NewOrder;
use crate::constants::constant::Constants;
use crate::domain::api_response::ApiResponse;
use crate::models::order_details::NewOrderDetail;
use crate::domain::dto::response::invoice_dto::{InvoiceDetailDto, InvoiceDto, InvoiceInfoDto};
use crate::infrastructure::db::connections::mysql::mysql_connection::{DbPool};
use crate::domain::dto::request::invoice_dto::{DetailProducts, NewInvoiceRequest};

diesel::define_sql_function! {
  fn last_insert_id() -> diesel::sql_types::Integer;
}

#[tauri::command]
pub async fn new_invoice(state: State<'_, DbPool>, request: NewInvoiceRequest) -> Result<ApiResponse, ApiResponse> {
  trace!("#new_invoice");
  trace!(">>> Request: {:?}", request);

  let mut conn = state
    .get()
    .map_err(|e| { 
      error!("Error al obtener la conexión: {:?}", e);
      ApiResponse::new_error(
        "ERROR".to_string(),
        Constants::ERRORDB,
        "No se pudo obtener el pool".to_string(),
      )
    })?;

  //TODO: crear la ordern y crear funciones por separado
  // let date_order = chrono::NaiveDateTime::parse_from_str(&request.created_at, "%Y-%m-%d %H:%M:%S").unwrap();
  let new_order: NewOrder = NewOrder {
    order_date: chrono::NaiveDateTime::parse_from_str(&request.created_at, "%Y-%m-%d %H:%M:%S").unwrap()
    , identity_employee: request.identity_employee.clone()
    , payment_method_id: request.payment_method
  };

  let id_order: i32 = create_order(&mut conn, new_order)
    .map_err(|e| { 
      error!("Error al obtener el id order: {:?}", e);
      ApiResponse::new_error(
        "ERROR".to_string(),
        Constants::ERRORDB,
        "Error al crear la nueva orden".to_string(),
      )
    })?;
  info!("id_order {:?}", id_order);

  //TODO: meter en detalle de order
  create_details_order(&mut conn, id_order, request.details)
  .map_err(|e| { 
      error!("Error al obtener el id order: {:?}", e);
      ApiResponse::new_error(
        "ERROR".to_string(),
        Constants::ERRORDB,
        "Error al crear la nueva orden".to_string(),
      )
  })?;
  
  //TODO: crear la factura
  let ddd = create_invoice(&mut conn, id_order, request.identity_employee.clone())
    .map_err(|e| {
      error!("Error al crear la factura: {:?}", e);
      ApiResponse::new_error(
        "ERROR".to_string(),
        Constants::ERRORDB,
        "Error al crear la factura".to_string(),
      )
    })?;

  //TODO: validar el etxk de cada proerducvto

  Ok(ApiResponse::new_success(
    "OK".to_string()
    , Constants::OK
    , "Nueva factura".to_string()
    , json!({"invoiceId": ddd})
  ))
}


fn create_order(conn: &mut PooledConnection<ConnectionManager<MysqlConnection>>, new_order: NewOrder) -> Result<i32, diesel::result::Error> {
  trace!("#create_order");
  use crate::schema::orders::dsl::{orders};

  insert_into(orders)
    .values(new_order)
    .execute(conn)?;

  let new_id_order: i32 = diesel::select(last_insert_id())
  .get_result(conn)?;

  Ok(new_id_order)
} 

fn create_details_order(conn: &mut PooledConnection<ConnectionManager<MysqlConnection>>, id_order: i32, products: Vec<DetailProducts>) -> Result<bool, diesel::result::Error> {
  trace!("#create_details_order");
  trace!(">>> id_order {:?}", id_order);

  use crate::schema::order_details::dsl::{order_details};

  //TODO: ver si aqui es para rebajar los stock de los productos
  for product in products {
    let order_detail_model: NewOrderDetail = NewOrderDetail { 
      quantity_product: product.quantity
      , sale_price: Decimal::from_str(&product.sale_price).unwrap()
      , product_id: product.id_product
      , order_id: id_order
    };

    //TOdO: ver como capturar si hay un error al insertar
    insert_into(order_details)
    .values(order_detail_model)
    .execute(conn)?;
  }

  Ok(true)
}


fn create_invoice(conn: &mut PooledConnection<ConnectionManager<MysqlConnection>>, id_order: i32, identity_employee: String) -> Result<i32, diesel::result::Error> {
  trace!("#create_invoice");
  use diesel::dsl::sum;
  use crate::schema::invoices::dsl::{invoices};
  use crate::schema::order_details::dsl::{order_details, order_id, sale_price, quantity_product};

  let amount_total: Option<Decimal> = order_details
    .filter(order_id.eq(id_order))
    .select(sum(sale_price * quantity_product))
    .first(conn)?;

  let new_invoice: NewInvoice = NewInvoice {
    total_amount: amount_total.unwrap_or(Decimal::ZERO)
    , client_name: "consumiodor final".to_string()
    , client_rtn: "0209199700192".to_string()
    , order_id: id_order
    , identity_employee: identity_employee
    , created_on: get_now()
  };

  insert_into(invoices)
  .values(new_invoice)
  .execute(conn)?;

  let new_id_invoice = diesel::select(last_insert_id())
  .get_result(conn)?;

  Ok(new_id_invoice)
}


#[tauri::command]
pub async fn get_products_by_invoice(state: State<'_, DbPool>, invoice_id: i32) -> Result<ApiResponse, ApiResponse> {
  use crate::schema::orders;
  use crate::schema::products;
  use crate::schema::invoices;
  use crate::schema::order_details;

  let mut conn = state.get().map_err(|e| ApiResponse::new_error("error ".to_string(), 500, format!("{:?}", e)))?;

  let invoice_detail = invoices::table
    .inner_join(orders::table.on(orders::id_order.eq(invoices::order_id)))
    .inner_join(order_details::table.on(order_details::order_id.eq(orders::id_order)))
    .inner_join(products::table.on(products::id_product.eq(order_details::product_id)))
    .filter(invoices::id_invoice.eq(invoice_id))
      .select((order_details::sale_price * order_details::quantity_product
        , order_details::sale_price
        , products::product_name
        , order_details::quantity_product
        ))
    .load::<InvoiceDetailDto>(&mut conn)
    .map_err(|e| ApiResponse::new_error(format!("ERROR"), Constants::ERRORDB, format!("El empleado NO tiene menus asociados {:?}", e)))?;

  let invoice_info: InvoiceInfoDto = invoices::table
    .filter(invoices::id_invoice.eq(invoice_id))
    .select((invoices::created_on, invoices::total_amount, invoices::id_invoice))
    .first(&mut conn)
    .map_err(|e| ApiResponse::new_error(format!("ERROR"), Constants::ERRORDB, format!("El empleado NO tiene menus asociados {:?}", e)))?;

  let invoice: InvoiceDto = InvoiceDto {
    date_invoice: format_utc_as_honduras_time(invoice_info.date_invoice)
    , invoice_detail
    , total_amount_invoice: invoice_info.total_amount_invoice
    , id_invoice: invoice_info.id_invoice
  };

  Ok(ApiResponse::new_success(
    "OK".to_string()
    , Constants::OK
    , "Lista de productos por factura".to_string()
    , json!({"invoice": invoice})
  ))
}