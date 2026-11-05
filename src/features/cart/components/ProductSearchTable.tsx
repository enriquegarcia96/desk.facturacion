import { Button, Listy } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useCartStore } from '../store/cart.store';
import { TableDataListProducts } from '@interface/TableType';

export const ProductSearchTable = () => {

  const products = useCartStore((state) => state.products);

  const items = products.map<TableDataListProducts>(({barCode, salePrice, productName, stock}) => ({
    key: barCode,
    barCode,
    productName,
    salePrice, 
    stock
  }))

  useEffect(() => {
    console.log('entra por primera vez y se carga')
  }, [products]);

  return (
    <>
      <Listy<TableDataListProducts>
      items={items}
      height={400}
      rowKey='barCode'
      className='border border-b-blue-950 justify-between'
      classNames={{
        item: 'border-b-2! border-solid! border-transparent! hover:border-black! hover:bg-[#7090b0]/20!',
      }}
      itemRender={(item) => (
        <div className='flex justify-between gap-3'>
          <p className='border border-amber-600'>{item.barCode}</p>
          <p className='border border-b-blue-500'>{item.productName}</p>
          <p>{item.salePrice}</p>
          {/* ver si areglo esto para que no se  mire el boton de sobre el mouse  */}
          <Button type="text" icon={<PlusOutlined />} title="Agregar producto" className="font-bold!">
            Añadir
          </Button>
        </div>
      )}
      />
    </>
  )
}
