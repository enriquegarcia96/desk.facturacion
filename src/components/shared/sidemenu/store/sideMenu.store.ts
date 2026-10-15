import {create} from 'zustand';

import { InfoEmployeeRequest } from '@interface/Request';
import { SideMenuService } from '../services/sideMenu.service';
import { IApiResponse, IMenu, IMenus } from '@interface/ApiResponse';
interface SideMenuState{
  menus: IMenu[];

  loadEmployeeMenusAction: (request: InfoEmployeeRequest) => Promise<IApiResponse<IMenus>>;
}

export const useSideMenuStore = create<SideMenuState>()((set) => ({
  menus: [],

  loadEmployeeMenusAction: async (request: InfoEmployeeRequest) => {
    try {
      const response = await SideMenuService.getMenus(request);
      set({menus: response.data.menus})
      return response;
    } catch (error) {
      console.error(error);
      const response = error as IApiResponse<IMenus>;
      set({menus: []})
      return response;
    }
  }

}))