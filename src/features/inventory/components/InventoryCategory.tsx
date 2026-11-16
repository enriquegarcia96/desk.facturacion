import { Button, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { IoAddOutline, IoFileTrayFullOutline } from 'react-icons/io5';

import { NewCategoryRequest } from '@interface/Request';
import { useAuthStore } from '../../auth/store/auth.store';
import { useInventoryStore } from '../store/inventory.store';

export const InventoryCategory = () => {
  const [form] = Form.useForm();
  const [_clientReady, setClientReady] = useState<boolean>(false);
  const {addNewCategoryAction} = useInventoryStore();
  const employee = useAuthStore((state) => state.user);

  useEffect(() => {
    setClientReady(true);
  }, []);
  
  const onFinish = (request: NewCategoryRequest) => {
    const newRequest: NewCategoryRequest = {
      nameCategory: request.nameCategory,
      userName: employee?.userName || 'sys'
    };
    addNewCategoryAction(newRequest);
    form.resetFields();
  };

  return (
    <div className='flex justify-center-safe w-full py-1 mb-1 mt-1 bg-white rounded-xl'>
      <Form form={form} name='horizontal_login' layout='inline' onFinish={onFinish}>
      <Form.Item
        name='nameCategory'
        label={'Crear Categoria'}
        className='font-extrabold'
        rules={[
          {required: true, message: 'Favor, ingrese un nombre'}
          , {whitespace: true, message: 'No se aceptan campos vacios'}
        ]}
        extra='Máximo 40 caracteres'
      >
        <Input
          prefix={<IoFileTrayFullOutline />}
          placeholder='Ej. Refrescos'
          maxLength={40}
          minLength={1}
        />
      </Form.Item>
      
      <Form.Item shouldUpdate>
        {() => (
          <Button
            icon={<IoAddOutline />}
            type='primary'
            htmlType='submit'
            // disabled={
            //   !clientReady ||
            //   !form.isFieldsTouched(true) ||
            //   form.getFieldsError().some(({ errors }) => errors.length)
            // }
          >
            Guardar Categoria
          </Button>
        )}
      </Form.Item>
    </Form>      
    </div>
  );
}
