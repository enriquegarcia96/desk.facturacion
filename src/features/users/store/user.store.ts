import { create } from "zustand";

import { UserService } from "../services/user.service";
import { IEmployee, IRole } from "@interface/ApiResponse";
import { NewUserRequest, UpdateStateUserRequest } from "@interface/Request";
interface UserState{
  message: string;
  isLoadData: boolean;
  messageToLoad: string;
  messageNewUser: string;
  employees: IEmployee[];
  newEmployeeCreate: boolean;

  clearMessage: () => void;
  loadRolesAction: () => Promise<IRole[]>;
  getEmployeesAction: () => Promise<void>;
  addNewUserAction: (request: NewUserRequest) =>  Promise<boolean>;
  updateStateUserAction: (request: UpdateStateUserRequest) => Promise<void>;
}

export const useUserStore = create<UserState>()((set, get) => ({
  message: '',
  messageNewUser: '',
  messageToLoad: '',
  newEmployeeCreate: false,
  isLoadData: false,
  employees: [],

  addNewUserAction: async (request: NewUserRequest): Promise<boolean> => {
    set({newEmployeeCreate: false, messageNewUser: ''});

    try {
      const {code, message} = await UserService.createNewUser(request);
      if (code != 200) {
        set({newEmployeeCreate: false, messageNewUser: message});
        return false;
      }
      await get().getEmployeesAction();
      set({newEmployeeCreate: true, messageNewUser: message});
      return true;
    } catch (error) {
      console.error(error);
      set({newEmployeeCreate: false, messageNewUser: 'error ' + error});
      return false;
    }
  },

  loadRolesAction: async (): Promise<IRole[]> => {
    try {
      const {data, code, message} = await UserService.getRoles();
      if(code === 200 && data.roles.length === 0){
        set({message});
      }
      return data.roles;
    } catch (error) {
      console.error(error);
      set({message: 'error: ' + error});
      return [];
    }
  },

  clearMessage: () => set({message: ''}),

  getEmployeesAction: async (): Promise<void> => {
    set({isLoadData: true, messageToLoad: '', employees:[], messageNewUser: ''});

    try {
      const {code, data, message} = await UserService.getEmployees();
      
      if (code != 200) {
        set({messageToLoad: message, employees: data.employees});
        return;
      }   
      set({messageToLoad: message, employees: data.employees});
    } catch (error) {
      console.error(error);
      set({messageToLoad: 'error ' + error, employees: []});
    }finally{
      set({isLoadData: false});
    }
  },

  updateStateUserAction: async (request: UpdateStateUserRequest): Promise<void> => {
    set({isLoadData: true});
    try {
      await UserService.updateStateUser(request);
      await get().getEmployeesAction();
    } catch (error) {
      console.error(error);
    }finally{
      set({isLoadData: false});
    }
  }

  
}))