import { useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Flex, Listy, Button, Tooltip, Spin } from "antd";

import {formattedMoney} from '../../../utils';
import { useCartStore } from "../store/cart.store";
import { TableDataListProducts } from "@interface/TableType";

export const ProductSearchTable = () => {
  const products = useCartStore((state) => state.products);
  const loading = useCartStore((state) => state.isLoadingProductsToTable);

  const items = products.map<TableDataListProducts>(
    ({ barCode, salePrice, productName, stock }) => ({
      key: barCode,
      barCode,
      productName,
      salePrice,
      stock,
    }),
  );

  useEffect(() => {
    console.log("entra por primera vez y se carga");
  }, [products, loading]);

  return (
    <Spin spinning={loading}  size='large' description={'Buscando...'} className="h-full">
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
        itemRender={({productName, barCode, salePrice, stock}) => (
          <Tooltip title={`${productName} Existencias ${stock}`}>
            <Flex align='center' className="w-full">
              <p className="text-sm font-semibold w-29 shrink-0 truncate">{barCode}</p>
              <p className="text-sm font-semibold capitalize text-wrap flex-1">{productName}</p>
              <p className="text-sm font-semibold shrink-0 text-right">{formattedMoney(salePrice)}</p>
              <Button
                type="text"
                icon={<PlusOutlined />}
                title="Agregar producto"
                className="font-bold! hover:bg-transparent!"
              >
                Añadir
              </Button>
            </Flex>
          </Tooltip>
        )}
      />
    </Spin>
  );
};
