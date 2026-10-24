use diesel::{Insertable, Queryable, Selectable};
use chrono::NaiveDateTime;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::categories)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct Category {
  pub id_category: i32,
  pub category_name: String,
  pub modify_by: String,
  pub created_on: Option<NaiveDateTime>,
  pub updated_on: Option<NaiveDateTime>,
  pub state: i8
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::categories)]
pub struct NewCategory {
  pub category_name: String,
  pub modify_by: String,
  pub state: i8
}