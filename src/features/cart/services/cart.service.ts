import { invoke } from "@tauri-apps/api/core";

import { ProductToSearchRequest } from "@interface/Request";
import { IActiveCategories, IApiResponse, IProductsTable } from "@interface/ApiResponse";

export class CartService {
  static getCategories = async(): Promise<IApiResponse<IActiveCategories>> => {
    return invoke<IApiResponse<IActiveCategories>>('command_active_categories', {})
  }

  static getProductsToTable = async(request: ProductToSearchRequest): Promise<IApiResponse<IProductsTable>> => {
    return invoke<IApiResponse<IProductsTable>>('command_search_product', {request});
  }

}