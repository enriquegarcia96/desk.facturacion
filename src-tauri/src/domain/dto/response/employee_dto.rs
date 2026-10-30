use diesel::deserialize::Queryable;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct EmployeesDto {
  pub role: String,
  pub state: bool,
  pub full_name: String,
  pub user_name: String
}