import { Form, Input, Tag, InputNumber  } from "antd";

export const InputsToProduct = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex-none">
        <Tag key='geekblue' color='geekblue' variant='outlined' className='font-bold' >
          Info. de producto
        </Tag>
      </div>
      
      <div className="flex flex-row justify-center gap-2">
        <Form.Item
          name="productName"
          label="Producto"
          className='font-bold'
          rules={[
            {
              required: true,
              message: "Por favor ingresa el nombre producto",
            },
          ]}
        >
          <Input size='small' placeholder='Ej. Queso' />
        </Form.Item>
        <Form.Item
          name="barcode"
          label="Código de barra"
          className='font-bold'
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <Input size="small" placeholder='Ej. 3462788' />
        </Form.Item>
      </div>
    </div>
  );
};
