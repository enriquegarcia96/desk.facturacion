import { create } from "zustand";

import { CartService } from "../services/cart.service";
import { ProductToSearchRequest } from "@interface/Request";
import { IActiveCategory, IListProduct } from "@interface/ApiResponse";

interface CartState {
  products: IListProduct[] | null;
  categories: IActiveCategory[];
  isLoadingProductsToTable: boolean;


  loadCategoryAction: () => Promise<void>;
  loadProductsToTableAction: (request: ProductToSearchRequest) => Promise<void>;
  clearProductTableAction: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  categories: [],
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
  }

}))