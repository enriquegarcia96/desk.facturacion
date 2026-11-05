import { OrderCard } from "../components/OrderCard";
import { ProductSearchForm } from "../components/ProductSearchForm";
import { ProductSearchTable } from "../components/ProductSearchTable";

export const SalesPage = () => {
  return (
    // aqui esta bine que muestre el mensaje al usuario
    <div className="flex flex-row h-full gap-4 justify-between">
      <div className="flex flex-col">
          <ProductSearchForm />
        <div className='h-full w-full'>
          <ProductSearchTable />
        </div>
      </div>
      <div className="px-0.5">
        <OrderCard />
      </div>
    </div>
  )
}
