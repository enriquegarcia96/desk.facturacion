import { Tag, Form, Input } from 'antd';

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
      >
        <Input size='small' />
      </Form.Item>
      </div>      
    </div>
  )
}
