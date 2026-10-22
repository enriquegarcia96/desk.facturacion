use diesel::deserialize::Queryable;
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct ProductsDto{
  pub id_product: i32,
  pub product_name: String,
  pub stock: Decimal,
  pub sale_price: Decimal
}