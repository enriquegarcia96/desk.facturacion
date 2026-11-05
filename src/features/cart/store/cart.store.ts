import { create } from "zustand";

import { CartService } from "../services/cart.service";
import { ProductToSearchRequest } from "@interface/Request";
import { IActiveCategory, IListProduct } from "@interface/ApiResponse";

interface CartState {
  products: IListProduct[];
  categories: IActiveCategory[];


  loadCategoryAction: () => Promise<void>;
  loadProductsToTableAction: (request: ProductToSearchRequest) => Promise<void>;
}

export const useCartStore = create<CartState>()((set) => ({
  categories: [],
  products: [],

  loadCategoryAction: async () => {
    set({categories: [], products: []});

    try {
      const {data} = await CartService.getCategories();
      set({categories: data.categories});
    } catch (error) {
      console.error(error);
      set({categories: []})
    }
  },

  loadProductsToTableAction: async (request: ProductToSearchRequest) => {
    set({products: []});

    try {
      const {code, data} = await CartService.getProductsToTable(request);
      console.log(data)
      set({products: data.products as IListProduct[]})//mejorar
    } catch (error) {
      console.error(error);
      set({products: []});
    }
  }

}))