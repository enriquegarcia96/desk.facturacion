import { invoke } from "@tauri-apps/api/core"

import { IApiResponse, IAuth } from "@interface/ApiResponse";
import { LoginRequest } from "@interface/Request";

export class AuthService {

static login = async(request: LoginRequest): Promise<IApiResponse<IAuth>> => {  
  return await invoke<IApiResponse<IAuth>>('command_authentication', {request});
}

}