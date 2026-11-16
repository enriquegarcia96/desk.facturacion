use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

#[derive(Clone, Deserialize, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DetailProducts {
  pub sale_price: String
  , pub quantity: Decimal
  , pub id_product: i32
}

#[derive(Clone, Deserialize, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct RemovedProducts {
  removed_at: String
  , bar_code: String
  , quantity: Decimal
  , sale_price: Decimal
  , id_product: i32
  , identity_employee: String
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewInvoiceRequest {
  pub created_at: String
  , pub identity_employee: String
  , pub payment_method: i32
  , pub details: Vec<DetailProducts>
  , pub removed_products: Vec<RemovedProducts>
}