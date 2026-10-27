import { create } from "zustand";

import { IEmployee, IRole } from "@interface/ApiResponse";
import { NewUserRequest } from "@interface/Request";
import { UserService } from "../services/user.service";

interface UserState{
  message: string;
  isLoadData: boolean;
  newEmployeeCreate: boolean;


  clearMessage: () => void;
  loadRolesAction: () => Promise<IRole[]>;
  getEmployeesAction: () => Promise<IEmployee[]>;
  addNewUserAction: (request: NewUserRequest) =>  Promise<boolean>;
}

export const useUserStore = create<UserState>()((set) => ({
  message: '',
  newEmployeeCreate: false,
  isLoadData: false,

  addNewUserAction: async (request: NewUserRequest): Promise<boolean> => {
    set({newEmployeeCreate: false, message: ''});

    try {
      const {code, message} = await UserService.createNewUser(request);
      if (code != 200) {
        set({newEmployeeCreate: false, message});
        return false;
      }
      console.log(message)
      set({newEmployeeCreate: true, message});
      return true;
    } catch (error) {
      console.error(error);
      set({newEmployeeCreate: false, message: 'error ' + error});
      return false;
    }
  },

  loadRolesAction: async (): Promise<IRole[]> => {
    set({message: ''});
    try {
      const {data, code, message} = await UserService.getRoles();
      if(code === 200 && data.roles.length === 0){
        set({message});
      }
      set({message});
      return data.roles;
    } catch (error) {
      console.error(error);
      set({message: 'error: ' + error});
      return [];
    }
  },

  clearMessage: () => set({message: ''}),

  getEmployeesAction: async (): Promise<IEmployee[]> => {
    set({isLoadData: true, message: ''});

    try {
      const {code, data, message} = await UserService.getEmployees();
      console.log(data)
      if (code != 200) {
        
      }   
      set({message: message, isLoadData: false})
      return data.employees;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
}))