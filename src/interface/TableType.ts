export interface TableDataCategory {
  idCategory: number;
  nameCategory: string;
}
export interface TableDataProduct {
  stock: number;
  idProduct: number;
  salePrice: number;
  productName: string;
}
export interface TableDataEmployee {
  role: string;
  state: boolean;
  fullName: string;
  userName: string;
}
export interface TableDataListProducts {
  barCode: string;
  productName: string;
  salePrice: string;
  stock: number;
}