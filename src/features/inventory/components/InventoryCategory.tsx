import { Button, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { IoAddOutline, IoFileTrayFullOutline } from 'react-icons/io5';

import { NewCategoryRequest } from '@interface/Request';
import { useAuthStore } from '../../auth/store/auth.store';
import { useInventoryStore } from '../store/inventory.store';

export const InventoryCategory = () => {
  const [form] = Form.useForm();
  const [clientReady, setClientReady] = useState<boolean>(false);
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
  };

  return (
    <div className='flex justify-center-safe w-full py-1 mb-1 mt-1 bg-white rounded-xl'>
      <Form form={form} name='horizontal_login' layout='inline' onFinish={onFinish}>
      <Form.Item
        name='nameCategory'
        rules={[{ required: true, message: 'Por favor, ingrese un nombre' }]}
        extra='Máximo 40 caracteres'
      >
        <Input
          prefix={<IoFileTrayFullOutline />}
          placeholder='Ej. Cereales'
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
            disabled={
              !clientReady ||
              !form.isFieldsTouched(true) ||
              form.getFieldsError().some(({ errors }) => errors.length)
            }
          >
            Nueva Categoria
          </Button>
        )}
      </Form.Item>
    </Form>      
    </div>
  );
}
