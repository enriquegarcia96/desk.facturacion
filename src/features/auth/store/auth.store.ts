import {create} from 'zustand';

import { LoginRequest } from '@interface/Request';
import { IApiResponse, IAuthEmployee } from '@interface/ApiResponse';
import { AuthService } from '../services/auth.service';

interface AuthState {
  response: IApiResponse<IAuthEmployee> | null;
  isError: boolean;

  loginAction: (request: LoginRequest) => Promise<IApiResponse<IAuthEmployee>>;
  logoutAction: () => void;
}

export const useAuthStore = create<AuthState>()((set) =>({
  response: null,
  isError: false,

  loginAction: async (request: LoginRequest) => {
    try {
      const data = await AuthService.login(request);      
      set({response: data, isError: false})
      return data;
    } catch (error) {
      const errorResponse = error as IApiResponse<IAuthEmployee>;
      set({ response: errorResponse, isError: true });
      console.error("<<< ERROR ", errorResponse);
      return errorResponse;
    }
  },

  logoutAction() {},

}))