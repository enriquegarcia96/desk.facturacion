use chrono::NaiveDateTime;
use rust_decimal::Decimal;
use diesel::prelude::Insertable;

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