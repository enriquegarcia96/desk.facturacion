import { Tag, Form, InputNumber } from 'antd';

import { checkStock, formatterToStock } from '../../../utils';

export const InputsToInventory = () => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex-none'>
        <Tag key='geekblue' color='geekblue' variant='outlined' className='font-bold' >
          Inventario
        </Tag>
      </div>
      <div className='flex flex-row justify-center gap-2'>
        <Form.Item
          name='stockQuantity'
          label='Stock'
          className='font-bold'
          rules={[{ required: true, validator: checkStock }]}
          initialValue={0}
        >
        <InputNumber<number>
          formatter={formatterToStock}
          min={0}
          parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
          size='small'
          placeholder='0.0'
        />
      </Form.Item>
      </div>      
    </div>
  )
}