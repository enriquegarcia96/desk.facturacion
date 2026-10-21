use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Clone, Serialize)]
pub enum ActionsCrud {
  ADD, EDIT, DELETE
}