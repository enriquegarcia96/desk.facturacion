use rust_decimal::Decimal;
use chrono::{NaiveDateTime};
use serde::{Deserialize, Serialize};
use diesel::deserialize::Queryable;

#[derive(Serialize, Deserialize, Debug, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct InvoiceDetailDto {
  pub amount: Decimal
  , pub sale_price: Decimal
  , pub product_name: String
  , pub quantity_product: Decimal
}

#[derive(Serialize, Deserialize, Debug, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct InvoiceInfoDto {
  pub date_invoice: NaiveDateTime
  , pub total_amount_invoice: Decimal
  , pub id_invoice: i32
}

#[derive(Serialize, Deserialize, Debug, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct InvoiceDto {
  pub date_invoice: String
  , pub total_amount_invoice: Decimal
  , pub id_invoice: i32
  , pub invoice_detail: Vec<InvoiceDetailDto>
}