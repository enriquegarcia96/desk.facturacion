import { create } from "zustand";

import { fmtHN } from "../../../utils";
import { CartService } from "../services/cart.service";
import { ProductToSearchRequest } from "@interface/Request";
import {IAddedProduct, IOrderProducts, IOrderWithDetails} from '@interface/order.interface';
import { IActiveCategory, IInvoice, IInvoiceId, IListProduct } from "@interface/ApiResponse";

interface CartState {
  categories: IActiveCategory[];
  products: IListProduct[] | null;
  orderProducts: IOrderProducts[];
  order: IOrderWithDetails | null;
  isLoadingProductsToTable: boolean;
  message: string | null;
  isAdded: boolean;

  loadCategoryAction: () => Promise<void>;
  loadProductsToTableAction: (request: ProductToSearchRequest) => Promise<void>;
  clearProductTableAction: () => void;
  addedOrderProductAction: (order: IAddedProduct) => Promise<boolean>;
  incrementQuantityAction: (idProduct: number, indexArray: number) => void;
  decrementQuantityAction: (idProduct: number, indexArray: number) => void;
  clearMessage: () => void;
  //TODO: crear la validacion del stock.
  createInvoiceAction: (order: IOrderWithDetails, identityEmployee: string) => Promise<IInvoiceId>;
  getProductsByInvoiceAction: (invoiceId: number) => Promise<IInvoice>;
}

export const useCartStore = create<CartState>()((set) => ({
  categories: [],
  orderProducts: [],
  order: null,
  products: null,
  isLoadingProductsToTable: false,
  message: null,
  isAdded: false,

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

  clearMessage: () => set({message: null, isAdded: false}),

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
      set({message: null,  isAdded: false});
      return false;
    }finally{
      set({message: 'Nuevo producto agregado', isAdded: true});
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

  createInvoiceAction: async (order: IOrderWithDetails, identityEmployee: string): Promise<IInvoiceId> =>  {
    try {
      const {code, data} = await CartService.newInvoice(order, identityEmployee);
      if(code === 200){
        set({message: 'Venta registrada', isAdded: true, order: null});
        return data;
      }

      set({ message: "No se pudo efectuar la venta", isAdded: false });
      return { invoiceId: 0 };
    } catch (error) {
      console.error(error);
      const ss: IInvoiceId = {
        invoiceId: 0
      };
      set({ message: "No se pudo efectuar la venta", isAdded: false });
      return  ss;
    }finally{
      //TODO: limpiar la orden para quede limpio
    }
  },

  getProductsByInvoiceAction: async (invoiceId: number): Promise<IInvoice> => {
    try {
      const {data} = await CartService.getProductsByInvoice(invoiceId);
      console.log(data)
      return data.invoice;
    } catch (error) {
      console.error(error);
      const dd: IInvoice = {dateInvoice: '', invoiceDetail: [], totalAmountInvoice: '', idInvoice: 0};
      return dd;
    }
  }

}))