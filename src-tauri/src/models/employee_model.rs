use diesel::{Selectable, deserialize::Queryable, prelude::Insertable};

#[derive(Queryable, Insertable, Selectable, Debug)]
#[diesel(table_name = crate::schema::employees)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct Employee {
  pub employee_identity: String,
  pub role_id: i32,
  pub first_name: String,
  pub last_name: String,
  pub user_name: String,
  pub password: String,
  pub state: i8
}