import { Button, Form, Input, Select, Space } from 'antd';

export const ProductsCard = () => {
  const [form] = Form.useForm();

  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' });
        break;
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' });
        break;
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' });
        break;
      default:
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
  };

  return (
    <Form
      form={form}
      layout='vertical'
      name="control-hooks"
      onFinish={onFinish}
      
      style={{ maxWidth: 600 }}
    >
      <div>
        <Form.Item
        name="product" 
        label="Buscar Productos"
        className='font-medium'
        rules={[{ required: true, message: 'Requerido' }]}
      >
        <Input
          size='small'
          placeholder='Código de barra o nombre'
        />
      </Form.Item>

      </div>

        <div>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
        <Select
          size='small'
          allowClear
          placeholder="Select a option and change input text above"
          onChange={onGenderChange}
          options={[
            { label: 'male', value: 'male' },
            { label: 'female', value: 'female' },
            { label: 'other', value: 'other' },
          ]}
        />
      </Form.Item>
        </div>

    </Form>
  );
}
