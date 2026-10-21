use rust_decimal::Decimal;
use serde::Deserialize;
use chrono::NaiveDateTime;

use crate::constants::action::ActionsCrud;

#[derive(Clone, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ProductDto {
  pub type_action: ActionsCrud,
  pub product_name: String,
  pub modify_by: String,
  pub sale_price: Decimal,
  pub cost_price: Decimal,
  pub created_on: Option<NaiveDateTime>,
  pub updated_on: Option<NaiveDateTime>,
  pub bar_code: String,
  pub category_id: i32,
  pub type_measure: i32,
}