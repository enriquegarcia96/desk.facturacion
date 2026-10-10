use diesel::deserialize::FromSqlRow;
use serde::Serialize;


#[derive(Serialize, FromSqlRow, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AuthDto {
  pub identity_employee: String,
  pub user_name: String,
  pub state: i8
}