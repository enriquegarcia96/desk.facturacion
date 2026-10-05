use crate::modules::auth::auth::authentication;

#[tauri::command]
pub async fn command_authentication(app: tauri::AppHandle<R>, window: tauri::Window<R>) -> String {
  return authentication(app, window).await;
}