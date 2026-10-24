import type { IconType } from 'react-icons';
export interface IApiResponse<T>{
  statusCode: string;
  message: string;
  code: number;
  data: T;
}

export interface IMenus{
  menus: IMenu[];
}
export interface IMenu {
  titleMenu: string;
  subTitle?: string;
  Icon: IconType;
  route: string;
}
export interface IAuth{
  employee: IAuthEmployee[];
}
export interface IAuthEmployee {
  identityEmployee: string;
  userName: string;
  roleName: string;
  state: number;
}

export interface ICategories{
  categories: ICategory[];
}

export interface ICategory {
  nameCategory: string;
  idCategory: number;
}

export interface IProducts {
  products: IProduct[];
}

export interface IProduct {
  productName: string;
  idProduct: number;
  salePrice: number;
  stock: number;
}

export interface IUnitsOfMeasure{
  units: IUnitOfMeasure[];
}

export interface IUnitOfMeasure{
  value: number;
  label: string;
}