import { invoke } from "@tauri-apps/api/core";

import { IOrderWithDetails } from "@interface/order.interface";
import { ICreateInvoiceRequest, ProductToSearchRequest } from "@interface/Request";
import { IActiveCategories, IApiResponse, IProductsTable } from "@interface/ApiResponse";

export class CartService {
  static getCategories = async(): Promise<IApiResponse<IActiveCategories>> => {
    return invoke<IApiResponse<IActiveCategories>>('command_active_categories', {})
  }
  
  static getProductsToTable = async(request: ProductToSearchRequest): Promise<IApiResponse<IProductsTable>> => {
    return invoke<IApiResponse<IProductsTable>>('command_search_product', {request});
  }
  
  static newInvoice = async(order: IOrderWithDetails, identityEmployee: string): Promise<IApiResponse<any>> => {
    const request: ICreateInvoiceRequest = {
      createdAt: order.createdAt,
      paymentMethod: 1,
      identityEmployee: identityEmployee,
      details: order.details,
      removedProducts: order.removedProducts
    };
    
    return invoke<IApiResponse<any>>('command_new_invoice', {request});
  }

}