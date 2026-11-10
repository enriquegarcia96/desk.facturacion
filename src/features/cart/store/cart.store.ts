import { create } from "zustand";

import { CartService } from "../services/cart.service";
import { ProductToSearchRequest } from "@interface/Request";
import {IOrderProducts} from '@interface/order.interface';
import { IActiveCategory, IListProduct } from "@interface/ApiResponse";

interface CartState {
  categories: IActiveCategory[];
  products: IListProduct[] | null;
  orderProducts: IOrderProducts[];
  isLoadingProductsToTable: boolean;

  loadCategoryAction: () => Promise<void>;
  loadProductsToTableAction: (request: ProductToSearchRequest) => Promise<void>;
  clearProductTableAction: () => void;
  addedOrderProductAction: (order: IOrderProducts) => Promise<boolean>;
  incrementQuantityAction: (barCode: string, indexArray: number) => void;
  decrementQuantityAction: (barCode: string, indexArray: number) => void;
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
      console.log(data)
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

  addedOrderProductAction: async (order: IOrderProducts) : Promise<boolean> => {
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
  },

  incrementQuantityAction: (barCode: string, indexArray: number): void => {
    set((state) => ({
      orderProducts: state.orderProducts.map((p, index) => (
        p.barCode === barCode && index === indexArray 
          ? {...p, quantity: p.quantity + 1} 
          : p
      ))
    }))
  },

  decrementQuantityAction: (barCode: string, indexArray: number) => {
    set((state) => ({
      orderProducts: state.orderProducts.map((p, index) =>
        p.barCode === barCode && index === indexArray ?
        {...p, quantity: p.quantity - 1} : p
      )
      .filter((product) => product.quantity > 0)
    }))
  }
}))