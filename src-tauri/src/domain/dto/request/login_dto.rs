use serde::{Deserialize, Serialize};

#[derive(Clone, Deserialize, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserDto {
  pub user_name: String,
  pub password: String
}
