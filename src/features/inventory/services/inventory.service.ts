import { invoke } from "@tauri-apps/api/core";

import {NewCategoryRequest, CategoryRequest} from '@interface/Request';
import { IApiResponse, ICategories, IProducts, IUnitsOfMeasure } from "@interface/ApiResponse";

export class InventoryService {

  static getCategories = async (): Promise<IApiResponse<ICategories>> => {
    return invoke<IApiResponse<ICategories>>('command_get_categories', {})
  }

  static createNewCategory = async (request: NewCategoryRequest): Promise<IApiResponse<any>> => {
    return invoke<IApiResponse<any>>('command_new_category', {request});
  }

  static getProductsByCategory = async (request: CategoryRequest): Promise<IApiResponse<IProducts>> => {
    return invoke<IApiResponse<IProducts>>('command_get_products', {request});
  }

  static getUnitsOfMeasure = async(): Promise<IApiResponse<IUnitsOfMeasure>> => {
    return invoke<IApiResponse<IUnitsOfMeasure>>('command_get_units', {});
  }
}