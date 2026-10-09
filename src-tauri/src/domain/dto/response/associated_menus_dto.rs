use diesel::deserialize::Queryable;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Queryable, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MenusDto {
  pub title_menu: String,
  pub route: String
}