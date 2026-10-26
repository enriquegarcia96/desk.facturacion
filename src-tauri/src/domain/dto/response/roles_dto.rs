use diesel::deserialize::Queryable;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Queryable, Debug)]
#[serde(rename_all = "camelCase")]
pub struct RolesDto {
  pub value: i32,
  pub label: String
}