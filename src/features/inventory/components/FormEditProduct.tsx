import { lazy, useEffect, useState } from 'react';

import {  Form, Modal } from 'antd';

import { InputsToSale } from './InputsToSale';
import { InputsToProduct } from './InputsToProduct';
import { NewProductRequest } from '@interface/Request';
import { InputsToInventory } from './InputsToInventory';
import { useAuthStore } from '../../auth/store/auth.store';
import { useInventoryStore } from '../store/inventory.store';
import { IEditableProduct } from '@interface/product.interface';

const Message = lazy(() => import('../../../components/shared/Message/Message'));

type Props = {
  openModal: boolean;
  typeAction: string;
  onClosed: () => void;
  product: IEditableProduct;
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

export const FormEditProduct = ({ openModal, onClosed, typeAction, product }: Props) => {
  const [form] = Form.useForm();

  const modifyBy = useAuthStore((state) => state.user?.userName || 'sys');
  const createNewProductAction = useInventoryStore((state) => state.createNewProductAction);

  const [color] = useState(
    () => colors[Math.floor(Math.random() * colors.length)]
  );

  useEffect(() => {
    console.log('se crea FormEditProduct', product)
  }, []);

  const onCreate = async (values: NewProductRequest) => {
    const request: NewProductRequest = {...values, typeAction, modifyBy};
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
      <p className='font-bold text-base'>Editar Producto en</p>
      
      {/* <Tag color={color} variant="solid" className='font-extrabold! text-base!'>
        {nameCategory}
      </Tag> */}
    </div>
  );

  return (
      <Modal
        open={openModal}
        title={modalTitle}
        okText="Editar"
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

        {/*
        //TODO:hacer que los inputs recizan datos 
        */}
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