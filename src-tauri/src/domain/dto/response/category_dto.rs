use diesel::deserialize::Queryable;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct CategoryDto {
  pub id_category: i32,
  pub name_category: String
}