use diesel::prelude::Insertable;
use rust_decimal::Decimal;

#[derive(Insertable)]
#[diesel(table_name = crate::schema::inventories)]
pub struct NewInventory {
  pub stock_quantity: Decimal,
  pub product_id: i32
}