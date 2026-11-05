import { invoke } from "@tauri-apps/api/core";

import { ProductToSearchRequest } from "@interface/Request";
import { IActiveCategories, IApiResponse, IProducts } from "@interface/ApiResponse";

export class CartService {
  static getCategories = async(): Promise<IApiResponse<IActiveCategories>> => {
    return invoke<IApiResponse<IActiveCategories>>('command_active_categories', {})
  }

  static getProductsToTable = async(request: ProductToSearchRequest): Promise<IApiResponse<IProducts>> => {
    return invoke<IApiResponse<IProducts>>('command_search_product', {request});
  }

}