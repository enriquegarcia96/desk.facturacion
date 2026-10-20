import { useEffect, useState } from 'react';
import { Tag, Form, InputNumber, Select } from 'antd';

import { useInventoryStore } from '../store/inventory.store';
import  { formatter } from '../../../utils/';

export const InputsToSale = () => {
  const {unitsOfMeasure} = useInventoryStore();
  const [loadingSelect, setLoadingSelect] = useState(true);
  const loadUnitOfMeasureAction = useInventoryStore((state) => state.loadUnitOfMeasureAction);

  useEffect(() => {
    const loadUnits = async () => {
      try {
        await loadUnitOfMeasureAction();
      } finally {
        setLoadingSelect(false);
      }
    };
    loadUnits();
  }, [loadUnitOfMeasureAction]);

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
        rules={[{ required: true, message: 'Requerido' }]}
      >
        <Select
          placeholder='Seleccione'
          size='small'
          options={unitsOfMeasure}
          loading={loadingSelect}
        />
      </Form.Item>

      <Form.Item
        name='salePrice'
        label='Precio de venta'
        className='font-bold'
        rules={[{ required: true, message: 'Requerido'}]}
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

      <Form.Item
        name='costPrice'
        label='Precio de compra'
        className='font-bold'
        rules={[{ required: true, message: 'Requerido' }]}
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
