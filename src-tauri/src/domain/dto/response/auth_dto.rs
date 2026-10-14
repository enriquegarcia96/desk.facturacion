use diesel::deserialize::{Queryable};
use serde::Serialize;


#[derive(Serialize, Queryable, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AuthDto {
  pub identity_employee: String,
  pub user_name: String,
  pub state: i8,
  pub role_name: String
}