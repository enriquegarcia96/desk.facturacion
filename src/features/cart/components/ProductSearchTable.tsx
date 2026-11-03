import { Button, Listy } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface Item {
  id: number;
  content: string;
  productName: string;
  barCode: string;
  price: number;
}

const items = Array.from<any, Item>({ length: 2 }, (_, index) => ({
  id: index,
  content: `Item ${index}`,
  productName: 'gaseosas',
  barCode: '766778889897',
  price: 983.78
}));

export const ProductSearchTable = () => {
  return <Listy<Item>
    items={items}
    height={400}
    rowKey="id"
    className='border border-b-blue-950'
    classNames={{
      item: 'border-b-2! border-solid! border-transparent! hover:border-black! hover:bg-[#7090b0]/20!',
    }}
    itemRender={(item) => (
      <div className='flex flex-row justify-between'>
        <p>{item.barCode}</p>
        <p>{item.productName}</p>
        <p>{item.price}</p>
        {/* ver si areglo esto para que no se  mire el boton de sobre el mouse  */}
        <Button type="text" icon={<PlusOutlined />} title="Agregar producto" className="font-bold!">
          Añadir
        </Button>
      </div>
    )}
  />;
}
