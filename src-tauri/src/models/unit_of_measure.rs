use diesel::{Selectable, deserialize::Queryable};
use crate::schema::units_of_measure;

#[derive(Queryable, Selectable, Debug)]
#[diesel(table_name = units_of_measure)]
#[diesel(check_for_backend(diesel::mysql::Mysql))]
pub struct UnitOfMeasure {
  pub id_unit: i32,
  pub name_unit: String,
  pub symbol: String
}