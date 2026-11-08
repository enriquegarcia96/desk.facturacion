import { create } from "zustand";

import { CartService } from "../services/cart.service";
import { ProductToSearchRequest } from "@interface/Request";
import {IOrderProducts} from '@interface/order.interface';
import { IActiveCategory, IListProduct } from "@interface/ApiResponse";

interface CartState {
  products: IListProduct[] | null;
  categories: IActiveCategory[];
  isLoadingProductsToTable: boolean;
  orderProducts: IOrderProducts[];


  loadCategoryAction: () => Promise<void>;
  loadProductsToTableAction: (request: ProductToSearchRequest) => Promise<void>;
  clearProductTableAction: () => void;
  addedOrderProductsAction: (order: IOrderProducts) => Promise<boolean>;
}

export const useCartStore = create<CartState>()((set) => ({
  categories: [],
  orderProducts: [],
  products: null,
  isLoadingProductsToTable: false,

  loadCategoryAction: async () => {
    set({categories: []});

    try {
      const {data} = await CartService.getCategories();
      set({categories: data.categories});
    } catch (error) {
      console.error(error);
      set({categories: []})
    }
  },

  loadProductsToTableAction: async (request: ProductToSearchRequest) => {
    set({products: [], isLoadingProductsToTable: true});
    try {
      const {data} = await CartService.getProductsToTable(request);
      set({products: data.products})
    } catch (error) {
      console.error(error);
      set({products: [], isLoadingProductsToTable: false});
    }finally{
      set({isLoadingProductsToTable: false});
    }
  },

  clearProductTableAction: () => {
    set({products: null});
  },

  addedOrderProductsAction: async (order: IOrderProducts) : Promise<boolean> => {
    try {
      set((state) => ({
        orderProducts: [...state.orderProducts, order]
      }));

      //TODO: hacer el llamado  con el serviocio
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }

  }

}))