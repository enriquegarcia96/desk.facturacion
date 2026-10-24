use serde::{Deserialize, Serialize};

#[derive(Clone, Deserialize, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NewCategoryDto {
  pub name_category: String,
  pub user_name: String
}

#[derive(Clone, Deserialize, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CategoryRequest {
  pub id_category: i32,
  pub category_name: String
}