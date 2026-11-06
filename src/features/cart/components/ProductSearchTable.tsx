import { Flex, Listy, Tag, Button, Badge, Card, Tooltip } from "antd";

import { PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useCartStore } from "../store/cart.store";
import { TableDataListProducts } from "@interface/TableType";
import {formattedMoney} from '../../../utils';

export const ProductSearchTable = () => {
  const products = useCartStore((state) => state.products);

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
  }, [products]);

  return (
    <>      
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
            <Flex align="center" className="w-full border">
              <p className="text-sm">{barCode}</p>
              <p className="text-sm border text-wrap">{productName}</p>
              <p className="text-sm">{formattedMoney(salePrice)}</p>
              <div className="flex-1" />
              <Button
                type="text"
                icon={<PlusOutlined />}
                title="Agregar producto"
                className="font-medium! hover:bg-transparent!"
              >
                Añadir
              </Button>
            </Flex>
          </Tooltip>
        )}
      />
    </>
  );
};
