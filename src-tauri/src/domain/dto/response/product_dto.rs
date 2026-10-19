use diesel::deserialize::Queryable;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct ProductsDto{
  pub id_product: i32,
  pub product_name: String,
  //pub stock: i32 // cambiar a flotante
  //pub sale_price: i32
}