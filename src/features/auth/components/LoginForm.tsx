import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";

import { ShopTwoTone } from '@ant-design/icons';


type FieldType = {
  username?: string;
  password?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

export const LoginForm = () => {
  return (
    <section>
      <div className="bg-white relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-20 max-w-7xl">
        <div className="w-full max-w-md mx-auto md:max-w-sm md:px-0 md:w-96 sm:px-4">
          <div className="flex flex-col">
            <div>
              <h1 className="text-4xl text-black">Pulperia Belkin</h1>
              <h2 className="text-4xl text-black">Iniciar sesión</h2>
              <p>Ingresa tus credenciales para continuar.</p>
            </div>
            <div>
              <Button type="dashed" danger variant="filled" size="large" icon={<ShopTwoTone />} block>
                Pulperia Belkin
              </Button>
            </div>
          </div>
          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="mt-4! space-y-6!"
          >
            <Form.Item<FieldType>
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                placeholder="kike"
                className="block! w-full! px-6! py-3! text-black! bg-white border! border-gray-200! rounded-full! appearance-none! placeholder:text-gray-400! focus:border-blue-500! focus:outline-none! focus:ring-blue-500! sm:text-sm!"
              />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                placeholder="Contraseña"
                className="block! w-full! px-6! py-3! text-black! bg-white border! border-gray-200! rounded-full! appearance-none! placeholder:text-gray-400! focus:border-blue-500! focus:outline-none! focus:ring-blue-500! sm:text-sm!"
              />
            </Form.Item>

            <Form.Item label={null}>
              <Button 
                type="primary" 
                htmlType="submit"
                className="items-center! justify-center! w-full! px-6! py-2.5! text-center! text-white! duration-200! bg-black! border-2! border-black! rounded-full! nline-flex! hover:bg-transparent! hover:border-black! hover:text-black! focus:outline-none! focus-visible:outline-black! text-sm! focus-visible:ring-black!"
              >
                Iniciar sesión
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
};
