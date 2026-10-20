import { Tag, Form, InputNumber } from 'antd';

import { formatter } from '../../../utils';

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
        rules={[{ required: true, message: 'Please input the title of collection!' }]}
        initialValue={0.0}
      >
        <InputNumber<number>
          min={0}
          formatter={formatter}
          parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
          size='small'
          placeholder='L. 0.0'
        />
      </Form.Item>
      </div>      
    </div>
  )
}