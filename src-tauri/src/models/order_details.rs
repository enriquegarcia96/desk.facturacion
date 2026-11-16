
use diesel::prelude::{Insertable};
use rust_decimal::Decimal;

#[derive(Insertable)]
#[diesel(table_name = crate::schema::order_details)]
pub struct NewOrderDetail {
  pub quantity_product: Decimal
  , pub sale_price: Decimal
  , pub product_id: i32
  , pub order_id: i32
}