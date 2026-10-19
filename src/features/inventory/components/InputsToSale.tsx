import { Tag, Form, InputNumber, Dropdown, Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

export const InputsToSale = () => {
  const items = [
  { key: '1', label: 'Action 1' },
  { key: '2', label: 'Action 2' },
  ];

  useEffect(() => {

    return () => {
      console.log('limpiexaaa')
    };

  }, []);

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex-none'>
        <Tag key='geekblue' color='geekblue' variant='outlined' className='font-bold' >
          Precio de venta y Costo de compra
        </Tag>
      </div>

      <div className='flex flex-row justify-center gap-2'>
      <Form.Item
        name='typeMeasure'
        label='Tipo de Metrica'
        className='font-bold'
        rules={[{ required: true, message: 'Por favor ingrese el precio de venta' }]}
      >
        <Dropdown menu={{items}}>
          <Button>
            <Space>
              UNI
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Form.Item>

      <Form.Item
        name='salePrice'
        label='Precio de venta'
        className='font-bold'
        rules={[{ required: true, message: 'Por favor ingrese el precio de venta' }]}
      >
        <InputNumber size='small' type={'number'} placeholder='L. 0.0' />
      </Form.Item>

      <Form.Item
        name='costPrice'
        label='Precio de compra'
        className='font-bold'
        rules={[{ required: true, message: 'Por favor ingrese el precio de compra' }]}
      >
        <InputNumber style={{ width: '50%' }} min={1} size='small' type={'number'} placeholder='L. 0.0' />
      </Form.Item>
      </div>
    
    </div>
  )
}
