import { useState } from 'react';
import {  Form, Input, Modal, Radio } from 'antd';
import { InputsToProduct } from './InputsToProduct';
import { InputsToSale } from './InputsToSale';
import { InputsToInventory } from './InputsToInventory';

interface Values {
  title?: string;
  description?: string;
  modifier?: string;
}

type Props = {
  openModal: boolean;
  onClosed: () => void;
}

export const FormNewProduct = ({ openModal, onClosed }: Props) => {
  console.log('openModal', openModal);
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<Values>();

  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);
    setFormValues(values);
    onClosed();
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
