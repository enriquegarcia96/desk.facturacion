import { Form, Input, Tag } from "antd";

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
            { required: true, message: "Requerido" },
          ]}
        >
          <Input size='small' placeholder='Ej. Queso' />
        </Form.Item>
        <Form.Item
          name="barCode"
          label="Código de barras"
          className='font-bold'
          normalize={(value: string) => value?.replace(/\D/g, '')}
          rules={[{ required: true, message: 'Ingresa el código de barras' }]}
        >
          <Input
            size="small"
            placeholder="Ej. 007351269"
            maxLength={100}
            inputMode="numeric"
          />
        </Form.Item>
      </div>
    </div>
  );
};
