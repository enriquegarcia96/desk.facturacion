import { create } from "zustand";

import { CartService } from "../services/cart.service";
import { ProductToSearchRequest } from "@interface/Request";
import {IAddedProduct, IOrderProducts, IOrderWithDetails} from '@interface/order.interface';
import { IActiveCategory, IListProduct } from "@interface/ApiResponse";
import { fmtHN } from "../../../utils";

interface CartState {
  categories: IActiveCategory[];
  products: IListProduct[] | null;
  orderProducts: IOrderProducts[];
  order: IOrderWithDetails | null;
  isLoadingProductsToTable: boolean;
  productAddedMessage: string | null;
  isNewProductAdded: boolean;

  loadCategoryAction: () => Promise<void>;
  loadProductsToTableAction: (request: ProductToSearchRequest) => Promise<void>;
  clearProductTableAction: () => void;
  addedOrderProductAction: (order: IAddedProduct) => Promise<boolean>;
  incrementQuantityAction: (idProduct: number, indexArray: number) => void;
  decrementQuantityAction: (idProduct: number, indexArray: number) => void;
  clearMessage: () => void;
  //TODO: crear la validacion del stock.
  createInvoiceAction: (order: IOrderWithDetails, identityEmployee: string) => Promise<boolean>;
}

export const useCartStore = create<CartState>()((set) => ({
  categories: [],
  orderProducts: [],
  order: null,
  products: null,
  isLoadingProductsToTable: false,
  productAddedMessage: null,
  isNewProductAdded: false,

  loadCategoryAction: async (): Promise<void> => {
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

  clearProductTableAction: (): void => {
    set({products: null});
  },

  clearMessage: () => set({productAddedMessage: null, isNewProductAdded: false}) ,

  addedOrderProductAction: async (newProduct: IAddedProduct) : Promise<boolean> => {
    try {
      set((state) => {
        const existedOrder: IOrderWithDetails = state.order ?? {
          createdAt: fmtHN(),
          details: [],
          removedProducts: []
        };
        
        return {
          order: {
            ...existedOrder,
            details: [...existedOrder.details, newProduct]
          }
        }
      });
      return true;
    } catch (error) {
      console.error(error);
      set({productAddedMessage: null,  isNewProductAdded: false});
      return false;
    }finally{
      set({productAddedMessage: 'Nuevo producto agregado', isNewProductAdded: true});
    }
  },

  incrementQuantityAction: (idProduct: number, indexArray: number): void => {
    set(({order}) => {

      if(!order) return {};

      return {
        order: {
        ...order,
        details: order?.details.map((product, index) =>
          product.idProduct === idProduct && index === indexArray
          ? {...product, quantity: product.quantity + 1}
          : product
          ),
        },
      };
    })
  },

  decrementQuantityAction: (idProduct: number, indexArray: number): void => {
    set(({order}) => ({
      order: order && {
        ...order,
        details: order?.details.map((p, index) => 
          p.idProduct === idProduct && index === indexArray
          ? {...p, quantity: p.quantity - 1}
          : p
        )
        .filter((product) => product.quantity > 0)
      }
    }))
  },

  createInvoiceAction: async (order: IOrderWithDetails, identityEmployee: string): Promise<boolean> =>  {
    try {
      const ss = await CartService.newInvoice(order, identityEmployee);
      console.log('serocioo siuuu ', ss)
      return true;
    } catch (error) {
      console.error(error)
      return false;
    }finally{
      //TODO: limpiar la orden para quede limpio
    }
  }

}))