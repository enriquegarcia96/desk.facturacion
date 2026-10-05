use diesel::{Selectable, deserialize::Queryable, prelude::Insertable};

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::schema::employees)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct Employees {
  employee_identity: String,
  role_id: i32,
  first_name: String,
  last_name: String,
  user_name: String,
  password: String,
  state: i8
}