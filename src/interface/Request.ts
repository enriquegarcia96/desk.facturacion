export interface LoginRequest {
  userName: string;
  password: string;
}

export interface InfoEmployeeRequest{
  userName: string;
  identityEmployee: string;
}

export interface NewCategoryRequest {
  nameCategory: string;
  userName: string;
}

export interface CategoryRequest {
  idCategory: number;
  categoryName: string;
}
export interface NewProductRequest {
  barCode: string;
  modifyBy: string;
  salePrice: number;
  costPrice: number;
  categoryId: number;
  typeAction: string;
  productName: string;
  typeMeasure: number;
  stockQuantity: number;
}
export interface NewUserRequest{
  roleId: number;
  lastName: string;
  userName: string;
  password: string;
  firstName: string;
  typeAction: string;
  employeeIdentity: string;
}
export interface UpdateStateUserRequest {
  userName: string;
  state: boolean;
}