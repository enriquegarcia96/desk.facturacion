use rust_decimal::Decimal;
use diesel::{deserialize::Queryable};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct ProductsDto{
  pub id_product: i32,
  pub product_name: String,
  pub stock: Decimal,
  pub sale_price: Decimal,
  pub cost_price: Decimal,
  pub cost_price_old: Decimal
}
#[derive(Serialize, Deserialize, Debug, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct ProductsToTableDto {
  pub bar_code: String,
  pub product_name: String,
  pub sale_price: Decimal,
  pub stock: Decimal,
  pub id_product: i32
}