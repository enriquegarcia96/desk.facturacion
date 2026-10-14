import {create} from 'zustand';

import { InfoEmployeeRequest } from '@interface/Request';
import { IApiResponse, IMenu, IMenus } from '@interface/ApiResponse';
import { SideMenuService } from '../services/sideMenu.service';

interface SideMenuState{
  menus: IMenu[];

  loadEmployeeMenusAction: (request: InfoEmployeeRequest) => Promise<IApiResponse<IMenus>>;
}

export const useSideMenuStore = create<SideMenuState>()((set) => ({
  menus: [],

  loadEmployeeMenusAction: async (request: InfoEmployeeRequest) => {
    try {
      console.log('entro al menus')
      const response = await SideMenuService.getMenus(request);
      set({menus: response.data.menus})
      console.log('termino de cargar la varibnale menus')
      return response;
    } catch (error) {
      console.error(error);
      const response = error as IApiResponse<IMenus>;
      set({menus: []})
      return response;
    }
  }

}))