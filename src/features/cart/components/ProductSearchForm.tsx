import { ProductToSearchRequest } from "@interface/Request";
import { Button, Form, Input, Select, Space } from "antd";
import { useEffect } from "react";
import { useCartStore } from "../store/cart.store";

export const ProductSearchForm = () => {
  const [form] = Form.useForm();
  const {loadCategoryAction, categories} = useCartStore();
  const loadProducts = useCartStore((state) => state.loadProductsToTableAction);

  useEffect(() => {
    const load = async () => {
      try {
        await loadCategoryAction();
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, [loadCategoryAction]);

  const onFinish = async (values: ProductToSearchRequest): Promise<void> => {
    //ir a buscar la data para llenar los productos
    console.log(values)
    try {
      await loadProducts(values);
    } catch (error) {
      console.error('Error al cargar los productos ', error);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      //onReset={onReset}
    >
      <div>
        <Form.Item<ProductToSearchRequest>
          name="codeBarOrProductName"
          label="Buscar Productos"
          className="font-medium"
          //rules={[{ required: true, message: "Requerido" }]}
        >
          <Input 
            size="small" 
            placeholder="Código de barra o nombre" 
            onChange={() => form.submit()}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item<ProductToSearchRequest>
          name="categoryId" 
          //label="Gender" 
          //rules={[{ required: true }]}
        >
          <Select
            size="small"
            //onBlur={}
            allowClear
            placeholder="Filtrar por categoria"
            //onChange={(value) => onGenderChange(value)}
            onChange={() => form.submit()}
            options={categories}
          />
        </Form.Item>
      </div>
    </Form>
  );
};
