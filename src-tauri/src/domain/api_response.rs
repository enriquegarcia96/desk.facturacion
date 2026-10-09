use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ApiResponse {
  status_code: String,
  code: u16,
  message: String,
  data: Value
}

impl ApiResponse {
  pub fn new_success(status_code: String, code: u16, message: String, data: Value) -> Self {
    ApiResponse { status_code, code, message, data }
  }

  pub fn new_error(status_code: String, code: u16, message: String) -> Self {
    ApiResponse { status_code, code, message, data: Value::Null }
  }
}
