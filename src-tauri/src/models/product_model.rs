use chrono::NaiveDateTime;
use diesel::prelude::Insertable;
use rust_decimal::Decimal;

#[derive(Insertable)]
#[diesel(table_name = crate::schema::products)]
pub struct NewProduct {
  pub product_name: String,
  pub modify_by: String,
  pub sale_price: Decimal,
  pub cost_price: Decimal,
  pub created_on: Option<NaiveDateTime>,
  pub updated_on: Option<NaiveDateTime>,
  pub bar_code: String,
  pub category_id: i32,
  pub id_unit_of_measure: i32,
}