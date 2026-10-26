use serde::{Deserialize, Serialize};
use crate::constants::action::ActionsCrud;

#[derive(Clone, Deserialize, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct InfoEmployeeDto {
  pub user_name: String,
  pub identity_employee: String
}

#[derive(Clone, Deserialize, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NewUserDto {
  pub role_id: i32,
  pub last_name: String,
  pub user_name: String,
  pub password: String,
  pub first_name: String,
  pub employee_identity: String,
  pub type_action: ActionsCrud
}