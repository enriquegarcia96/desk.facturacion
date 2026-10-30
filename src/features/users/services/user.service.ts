import { invoke } from "@tauri-apps/api/core";

import { NewUserRequest, UpdateStateUserRequest } from "@interface/Request";
import { IApiResponse, IEmployees, IRoles } from "@interface/ApiResponse";

export class UserService {

  static createNewUser = async (request: NewUserRequest): Promise<IApiResponse<any>> => {
    return invoke<IApiResponse<any>>('command_crud_user', {request});
  }

  static getRoles = async (): Promise<IApiResponse<IRoles>> => {
    return invoke<IApiResponse<IRoles>>('command_get_roles', {});
  }

  static getEmployees = async (): Promise<IApiResponse<IEmployees>> => {
    return invoke<IApiResponse<IEmployees>>('command_get_employees', {});
  }

  static updateStateUser = async (request: UpdateStateUserRequest): Promise<IApiResponse<any>> => {
    return invoke<IApiResponse<any>>('command_update_state', {request});
  }

}