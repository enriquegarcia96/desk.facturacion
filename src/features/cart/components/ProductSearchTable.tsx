import { useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Flex, Listy, Button, Tooltip, Spin, Empty } from "antd";

import { formattedMoney } from "../../../utils";
import { useCartStore } from "../store/cart.store";
import { TableDataListProducts } from "@interface/TableType";
import { IOrderProducts } from "@interface/order.interface";

export const ProductSearchTable = () => {
  const products = useCartStore((state) => state.products);
  const loading = useCartStore((state) => state.isLoadingProductsToTable);
  const clearTable = useCartStore((state) => state.clearProductTableAction);
  const addedOrderProductsAction = useCartStore((state) => state.addedOrderProductsAction);

  const items = products?.map<TableDataListProducts>(
    ({ barCode, salePrice, productName, stock }) => ({
      key: barCode,
      barCode,
      productName,
      salePrice,
      stock,
    }),
  );

  useEffect(() => {
    
  }, [products, loading]);

  useEffect(() => {
    return () => {
      clearTable();
    }
  }, [clearTable]);

  const addedOrderProducts = async (order: IOrderProducts) => {
    const isAddedToOrder: boolean = await addedOrderProductsAction(order);
    
    console.log(isAddedToOrder)
    if (!isAddedToOrder) {
      return;
    }
  }

  return (
    <Spin
      spinning={loading}
      size="large"
      description={"Buscando..."}
      className="h-full"
    >
      {items?.length === 0 ? (
        <Empty description={"Producto NO encontrado"} />
      ) : (
        <Listy<TableDataListProducts>
          virtual
          sticky
          items={items}
          rowKey="barCode"
          styles={{ item: { padding: 0, margin: 0, paddingTop: 3 } }}
          className="flex flex-col"
          classNames={{
            item: "border-b-2! border-solid! border-transparent! hover:border-black! hover:bg-[#7090b0]/20!",
          }}
          itemRender={({barCode, productName, salePrice, stock}) => (
            <Tooltip title={`${productName} Existencias ${stock}`}>
              <Flex align="center" className="w-full">
                <p className="text-sm font-semibold w-29 shrink-0 truncate">
                  {barCode}
                </p>
                <p className="text-sm font-semibold capitalize text-wrap flex-1">
                  {productName}
                </p>
                <p className="text-sm font-semibold shrink-0 text-right">
                  {formattedMoney(salePrice)}
                </p>
                <Button
                  type='text'
                  icon={<PlusOutlined />}
                  title="Agregar producto"
                  className="font-bold! hover:bg-transparent!"
                  onClick={() => addedOrderProducts({
                    barCode,
                    productName,
                    salePrice,
                    quantity: 1
                  })}
                >
                  Añadir
                </Button>
              </Flex>
            </Tooltip>
          )}
        />
      )}
    </Spin>
  );
};
