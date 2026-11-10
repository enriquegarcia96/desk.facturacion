export interface IOrderProducts {
  barCode: string;
  quantity: number;
  salePrice: string;
  productName: string;
  id_product: number;
  //productsRemoved?: IOrderProductsRemoved[];
}

interface IOrderProductsRemoved extends IOrderProducts {
  id_state: number;
}