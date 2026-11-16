interface IOrder {
  createdAt: string;
}
interface IOrderDetail {
  quantity: number;
  salePrice: string;
  idProduct: number;
  identityEmployee?: string;
  productName?: string;
}
interface IRemovedOrderProduct extends IOrderDetail {
  removedAt: string;
  barCode: string;
}
export interface IAddedProduct extends IOrderDetail {
  barCode: string;
  // productName: string;
}
export interface IOrderWithDetails extends IOrder {
  details: IOrderDetail[];
  removedProducts: IRemovedOrderProduct[];
}
export interface IOrderProducts {
  barCode: string;
  quantity: number;
  salePrice: string;
  productName: string;
  idProduct: number;
  //productsRemoved?: IOrderProductsRemoved[];
}