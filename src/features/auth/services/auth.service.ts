import { invoke } from "@tauri-apps/api/core"

import { IApiResponse, IAuthEmployee } from "@interface/ApiResponse";
import { LoginRequest } from "@interface/Request";

export class AuthService {

static login = async(request: LoginRequest): Promise<IApiResponse<IAuthEmployee>> => {  
  return await invoke<IApiResponse<IAuthEmployee>>('command_authentication', {request});
}

}