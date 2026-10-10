export interface IApiResponse<T>{
  statusCode: string;
  message: string;
  code: number;
  data: T;
}

export interface IMenus {
  titleMenu: string;
  route: string;
}

export interface IAuthEmployee {
  identityEmployee: string;
  userName: string;
  state: number;
}