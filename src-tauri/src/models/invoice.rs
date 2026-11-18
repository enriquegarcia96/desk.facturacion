use chrono::NaiveDateTime;
use rust_decimal::Decimal;
use diesel::{Selectable, deserialize::Queryable, prelude::Insertable};

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::invoices)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct Invoice {
  pub id_invoice: i32
  , pub total_amount: Decimal
  , pub client_name: String
  , pub client_rtn: String
  , pub order_id: i32
  , pub identity_employee: String
  , pub created_on: NaiveDateTime
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::invoices)]
pub struct NewInvoice {
  pub total_amount: Decimal
  , pub client_name: String
  , pub client_rtn: String
  , pub order_id: i32
  , pub identity_employee: String
  , pub created_on: NaiveDateTime
}