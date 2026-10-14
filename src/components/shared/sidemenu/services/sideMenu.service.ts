
import { invoke } from '@tauri-apps/api/core';

import {InfoEmployeeRequest} from '@interface/Request';
import { IApiResponse, IMenus } from '@interface/ApiResponse';

export class SideMenuService {

  static getMenus = async(request: InfoEmployeeRequest): Promise<IApiResponse<IMenus>> => {
    return await invoke<IApiResponse<IMenus>>('command_get_menus', {request});
  }

}