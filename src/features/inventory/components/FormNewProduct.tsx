import { lazy, useEffect, useState } from 'react';

import {  Form, Modal, Tag } from 'antd';

import { InputsToSale } from './InputsToSale';
import { InputsToProduct } from './InputsToProduct';
import { NewProductRequest } from '@interface/Request';
import { InputsToInventory } from './InputsToInventory';
import { useAuthStore } from '../../auth/store/auth.store';
import { useInventoryStore } from '../store/inventory.store';

const Message = lazy(() => import('../../../components/shared/Message/Message'));

type Props = {
  openModal: boolean;
  typeAction: string;
  categoryId: number;
  onClosed: () => void;
  nameCategory: string;
}

  const colors: string[] = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
  '#f50',
  '#2db7f5',
  '#87d068',
  '#108ee9'
];

export const FormNewProduct = ({ openModal, onClosed, typeAction, categoryId, nameCategory }: Props) => {
  const createNewProductAction = useInventoryStore((state) => state.createNewProductAction);
  const modifyBy = useAuthStore((state) => state.user?.userName || 'sys');
  const [form] = Form.useForm();

  const [color] = useState(
    () => colors[Math.floor(Math.random() * colors.length)]
  );

  useEffect(() => {
    console.log('cuando veces entro ?', color)
    return () => {
      console.log('se limpio ?')
    };
  }, []);

  const onCreate = async (values: NewProductRequest) => {
    const request: NewProductRequest = {...values, typeAction, modifyBy, categoryId};
    const isCreateCorrect: boolean = await createNewProductAction(request);

    if (!isCreateCorrect) {
      return;
    }

    setTimeout(() => {
      onClosed();
    }, 1000);
    
  };

  const modalTitle = (
    <div className="flex items-center justify-between pr-6">
      <p className='font-bold text-base'>Nuevo Producto en</p>
      
      <Tag color={color} variant="solid" className='font-extrabold! text-base!'>
        {nameCategory}
      </Tag>
    </div>
  );

  return (
      <Modal
        open={openModal}
        title={modalTitle}
        okText="Crear"
        cancelText="Cancelar"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={onClosed}
        destroyOnHidden
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
            clearOnDestroy
            onFinish={(values) => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
      <ShowMessage />
      <InputsToProduct />
      <InputsToSale />   
      <InputsToInventory />
    </Modal>
  );
}

export const ShowMessage = () => {
  const message = useInventoryStore((state) => state.messageNewProduct);
  const newProductLoad = useInventoryStore((state) => state.newProductLoad);
  const clearMessageNewProduct = useInventoryStore((state) => state.clearMessageNewProduct);

  if (message === '') return null;
  
  return (
    <Message
      messageToUser={message}
      typeMessage={newProductLoad ? 'success' : 'error'}
      onClose={clearMessageNewProduct}
    />
  )
}

