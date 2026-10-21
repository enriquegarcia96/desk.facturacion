import { create } from "zustand";

import { ICategory, IProduct, IUnitOfMeasure } from "@interface/ApiResponse";
import {CategoryRequest, NewCategoryRequest, NewProductRequest} from '@interface/Request';
import { InventoryService } from "../services/inventory.service";

interface InventoryState {
  products: IProduct[];
  categories: ICategory[];
  unitsOfMeasure: IUnitOfMeasure[];

  newCategoryLoad: boolean;
  messageNewCategory: string;
  isLoadingCategories: boolean;

  clearMessageNewCategory: () => void;
  loadCategoriesAction: () => Promise<void>;
  loadUnitOfMeasureAction: () => Promise<void>;
  addNewCategoryAction: (request: NewCategoryRequest) => void;
  loadProductsByCategoryAction: (request: CategoryRequest) => void;
  createNewProductAction: (request: NewProductRequest) => Promise<boolean>;
};

export const useInventoryStore = create<InventoryState>()((set, get) => ({
  products: [],
  categories: [],
  unitsOfMeasure: [],

  messageNewCategory: '',
  newCategoryLoad: false,
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

  loadProductsByCategoryAction: async (request: CategoryRequest) => {
    try {
      const {data} = await InventoryService.getProductsByCategory(request);
      console.log(data);
      set({products: data.products});
    } catch (error) {
      console.error(error);
      set({products: []})
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
    try {
      const {code} = await InventoryService.crudProduct(request);

      if (code === 200){
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  
}))
