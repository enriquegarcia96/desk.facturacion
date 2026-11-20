import { Form } from "antd";

import { OrderCard } from "../components/OrderCard";
import { ProductSearchForm } from "../components/ProductSearchForm";
import { ProductSearchTable } from "../components/ProductSearchTable";
import Message from '../../../components/shared/Message/Message';
import { useCartStore } from "../store/cart.store";

export const SalesPage = () => {
  const [form] = Form.useForm();
  const isAdded = useCartStore((state) => state.isAdded);
  const messageToUser = useCartStore((state) => state.message);
  const clearMessage = useCartStore((state) => state.clearMessage);

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div className="flex flex-row h-full">
      <Message
        messageToUser={messageToUser!}
        typeMessage={isAdded ? 'success' : 'error'}
        onClose={clearMessage}
      />
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
