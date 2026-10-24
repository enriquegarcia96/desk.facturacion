use diesel::deserialize::Queryable;
use serde::{Serialize};

#[derive(Serialize, Debug, Queryable)]
#[serde(rename_all = "camelCase")]
pub struct UnitOfMeasureDto{
  pub value: i32,
  pub label: String,
}