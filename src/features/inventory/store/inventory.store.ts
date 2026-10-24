import { IApiResponse } from './../../../interface/ApiResponse';
import { create } from "zustand";

import { ICategory, IProduct, IUnitOfMeasure } from "@interface/ApiResponse";
import {CategoryRequest, NewCategoryRequest, NewProductRequest} from '@interface/Request';
import { InventoryService } from "../services/inventory.service";

interface InventoryState {
  products: IProduct[];
  categories: ICategory[];
  unitsOfMeasure: IUnitOfMeasure[];

  newCategoryLoad: boolean;
  newProductLoad: boolean;
  isLoadingProducts: boolean;
  messageNewCategory: string;
  messageNewProduct: string;
  isLoadingCategories: boolean;

  clearMessageNewCategory: () => void;
  clearMessageNewProduct: () => void;
  loadCategoriesAction: () => Promise<void>;
  loadUnitOfMeasureAction: () => Promise<void>;
  addNewCategoryAction: (request: NewCategoryRequest) => void;
  loadProductsByCategoryAction: (request: CategoryRequest) => Promise<void>;
  createNewProductAction: (request: NewProductRequest) => Promise<boolean>;
};

export const useInventoryStore = create<InventoryState>()((set, get) => ({
  products: [],
  categories: [],
  unitsOfMeasure: [],

  messageNewCategory: '',
  messageNewProduct: '',
  newCategoryLoad: false,
  newProductLoad: false,
  isLoadingProducts: false,
  isLoadingCategories: false,

  loadCategoriesAction: async () => {
    set({isLoadingCategories: true});

    try {
      const {code, data} = await InventoryService.getCategories();
      if (code != 200){
        set({categories: []});
      }
      set({categories: data.categories});
    } catch (error) {
      console.error(error);
      set({categories: []});
    }finally{
      set({isLoadingCategories: false})
    }
  },

  addNewCategoryAction: async (request: NewCategoryRequest) => {
    set({newCategoryLoad: false, messageNewCategory: ''})
    try {
      const {code, message} = await InventoryService.createNewCategory(request);
      if(code != 200){
        set({newCategoryLoad: false, messageNewCategory: message});
      }else{
        await get().loadCategoriesAction();
        set({newCategoryLoad: true, messageNewCategory: message});
      }      
    } catch (error) {
      console.error(error);
      set({newCategoryLoad: false, messageNewCategory: 'error '+ error});
    }
  },

  clearMessageNewCategory: () => set({messageNewCategory: ''}),
  clearMessageNewProduct: () => set({messageNewProduct: ''}),

  loadProductsByCategoryAction: async (request: CategoryRequest) => {
    set({isLoadingProducts: true, products: []});

    try {
      const {data, code} = await InventoryService.getProductsByIdCategory(request);
      if (code != 200 ) {
        set({products: []});
      }
      set({products: data.products});
    } catch (error) {
      console.error(error);
      set({products: []});
    }finally{
      set({isLoadingProducts: false});
    }
  },

  loadUnitOfMeasureAction: async () => {
    try {
      const {data} = await InventoryService.getUnitsOfMeasure();
      set({unitsOfMeasure: data.units});
    } catch (error) {
      console.error(error);
      set({unitsOfMeasure: []});
    }
  },

  createNewProductAction: async (request: NewProductRequest) => {
    set({newProductLoad: false, messageNewProduct: ''});
    try {
      const {code, message} = await InventoryService.crudProduct(request);      
      if (code === 200){
        const requestCategory: CategoryRequest = {
          idCategory: request.categoryId,
          categoryName: ''
        };
        await get().loadProductsByCategoryAction(requestCategory);
        set({newProductLoad: true, messageNewProduct: message});
        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        console.error(error);
        set({messageNewProduct: error.message, newProductLoad: false});
      }else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'){
        console.error(error);
        set({messageNewProduct: error.message, newProductLoad: false});
      }
      return false;
    }
  },
  
}))
