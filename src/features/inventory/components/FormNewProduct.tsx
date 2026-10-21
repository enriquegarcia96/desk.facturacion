import { useState } from 'react';
import {  Form, Modal } from 'antd';

import { InputsToSale } from './InputsToSale';
import { InputsToProduct } from './InputsToProduct';
import { InputsToInventory } from './InputsToInventory';
import { NewProductRequest } from '@interface/Request';
import { useInventoryStore } from '../store/inventory.store';
import { useAuthStore } from '../../auth/store/auth.store';


type Props = {
  openModal: boolean;
  typeAction: string;
  categoryId: number;
  onClosed: () => void;
}

export const FormNewProduct = ({ openModal, onClosed, typeAction, categoryId }: Props) => {
  const createNewProductAction = useInventoryStore((state) => state.createNewProductAction);
  const modifyBy = useAuthStore((state) => state.user?.userName || 'sys');
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<NewProductRequest>();

  const onCreate = async (values: NewProductRequest) => {
    const request: NewProductRequest = {...values, typeAction, modifyBy, categoryId};
    console.log('tipo deaccion ? ', request);
    const isCorrect = await createNewProductAction(request);

    if (isCorrect) {
      onClosed();
      //mensja al usuario para decuirle volver a intenetarlo 
      //para la insercion
    }

    setFormValues(values);
  };

  return (
      <Modal
        open={openModal}
        title="Creación de nuevo producto"
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
      
      <InputsToProduct />
      <InputsToSale />   
      <InputsToInventory />

    </Modal>
  );
}
