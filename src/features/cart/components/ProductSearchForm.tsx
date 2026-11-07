import { ProductToSearchRequest } from "@interface/Request";
import { Form, Input, Select } from "antd";
import { useEffect, useRef } from "react";
import { useCartStore } from "../store/cart.store";
import {  IoSearchSharp } from "react-icons/io5";

export const ProductSearchForm = () => {
  const [form] = Form.useForm();
  const {loadCategoryAction, categories} = useCartStore();
  const loadProducts = useCartStore((state) => state.loadProductsToTableAction);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      try {
        await loadCategoryAction();
      } catch (error) {
        console.error(error);
      }
    }
    load();
    clearTimeout(timerRef.current)
  }, [loadCategoryAction]);

  const onFinish = async (values: ProductToSearchRequest): Promise<void> => {
    try {
      if (values.categoryId === undefined && (values.codeBarOrProductName === undefined || values.codeBarOrProductName.trim().length === 0)) {
        return;
      }
      const request: ProductToSearchRequest = {
        categoryId: values.categoryId,
        codeBarOrProductName: values.codeBarOrProductName
      }
      await loadProducts(request);
    } catch (error) {
      console.error('Error al cargar los productos ', error);
    }
  };

  const debouncedSubmit = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => form.submit(), 800);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="control-hooks"
      onFinish={onFinish}
      //style={{ maxWidth: 600 }}
      //onReset={onReset}
    >
      <div className="px-2">
        <Form.Item<ProductToSearchRequest>
          name="codeBarOrProductName"
          label="Buscar Productos"
          className="font-extrabold"
          //rules={[{ required: true, message: "Requerido" }]}
        >
        <Input
          size="small"
          prefix={<IoSearchSharp  />}
          placeholder="Código de barra o nombre"
          onChange={debouncedSubmit}
          className="border-2! border-gray-600! text-black"
        />
        </Form.Item>
      </div>

      <div className="px-2">
        <Form.Item<ProductToSearchRequest>
          name="categoryId"
          className="font-extrabold"
          //label="Gender" 
          //rules={[{ required: true }]}
        >
          <Select
            size="small"
            //onBlur={}
            allowClear
            placeholder="Filtrar por categoria"
            className="border-2! border-gray-600!"
            //onChange={(value) => onGenderChange(value)}
            onChange={() => form.submit()}
            options={categories}
          />
        </Form.Item>
      </div>
    </Form>
  );
};
