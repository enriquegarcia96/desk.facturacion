import {create} from 'zustand';

import { LoginRequest } from '@interface/Request';
import { IApiResponse, IAuth, IAuthEmployee } from '@interface/ApiResponse';
import { AuthService } from '../services/auth.service';

interface AuthState {
  user: IAuthEmployee | null;
  isError: boolean;

  hasRole: () => boolean;
  loginAction: (request: LoginRequest) => Promise<IApiResponse<IAuth>>;
  logoutAction: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) =>({
  user: null,
  isError: false,

  hasRole: (): boolean =>  {
    let hasRole: boolean;

    switch (get().user?.roleName) {
      case 'administrador':
      case 'ventas':
        hasRole = true;
      break;    
      default:
        hasRole = false;
      break;
    }
    return hasRole;
  },

  loginAction: async (request: LoginRequest) => {
    try {
      const response = await AuthService.login(request);
      for(const emp of response.data.employee){
        set({user: emp, isError: false});
      }
      return response
    } catch (error) {
      console.error(error);
      const response = error as IApiResponse<IAuth>;
      set({user: undefined, isError: true})
      return response;
    }
  },

  logoutAction() {},
}))