

#[tauri::command]
pub async fn authentication(app: tauri::AppHandle<R>, window: tauri::Window<R>) ->  String {
  log::trace!("Entr a la funcion autenticacion");

  return "hola mundo".to_string()
}