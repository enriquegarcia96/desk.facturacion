import { Form } from "antd";

import { OrderCard } from "../components/OrderCard";
import { ProductSearchForm } from "../components/ProductSearchForm";
import { ProductSearchTable } from "../components/ProductSearchTable";

export const SalesPage = () => {
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  return (
    // aqui esta bine que muestre el mensaje al usuario
    <div className="flex flex-row h-full">
      <div className="flex flex-col w-1/2 px-0.5">
          <ProductSearchForm form={form} />
        <div className="flex-1 min-h-0 overflow-y-auto w-full">
          <ProductSearchTable onReset={onReset} />
        </div>
      </div>
      <div className="w-1/2">
        <OrderCard />
      </div>
    </div>
  )
}
