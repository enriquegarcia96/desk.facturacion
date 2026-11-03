import { Listy } from 'antd';

interface Item {
  id: number;
  content: string;
  productName: string;
  barCode: string;
}

const items = Array.from<any, Item>({ length: 2 }, (_, index) => ({
  id: index,
  content: `Item ${index}`,
  productName: 'gaseosas',
  barCode: '766778889897'
}));


export const ProductSearchTable = () => {
  return <Listy<Item>
    items={items}
    height={400}
    rowKey="id"
    itemRender={(item) => (
      <div className='flex flex-row justify-between'>
        <p>{item.barCode}</p>
        <p>{item.productName}</p>
        <p>{item.content}</p>
      </div>
    )}
  />;
}
