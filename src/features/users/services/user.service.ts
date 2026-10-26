import { invoke } from "@tauri-apps/api/core";

import { IApiResponse, IRoles } from "@interface/ApiResponse"
import { NewUserRequest } from "@interface/Request";

export class UserService {

  static createNewUser = async (request: NewUserRequest): Promise<IApiResponse<any>> => {
    return invoke<IApiResponse<any>>('command_crud_user', {request});
  }

  static getRoles = async (): Promise<IApiResponse<IRoles>> => {
    return invoke<IApiResponse<IRoles>>('command_get_roles', {});
  }

}