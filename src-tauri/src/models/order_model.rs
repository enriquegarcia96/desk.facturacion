use chrono::NaiveDateTime;
use diesel::{Selectable, deserialize::Queryable, prelude::Insertable};

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::orders)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct Order {
  pub id_order: i32
  , pub order_date: NaiveDateTime
  , pub identity_employee: String
  , pub payment_method_id: i32
  , pub created_on: Option<NaiveDateTime>
}


#[derive(Insertable)]
#[diesel(table_name = crate::schema::orders)]
pub struct NewOrder {
  pub order_date: NaiveDateTime
  , pub identity_employee: String
  , pub payment_method_id: i32
  //TODO: ver si coloca la feahc de created_on
}