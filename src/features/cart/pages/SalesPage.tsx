import { OrderCard } from "../components/OrderCard";
import { ProductsCard } from "../components/ProductsCard";
import { ProductSearchTable } from "../components/ProductSearchTable";

export const SalesPage = () => {
  return (
    <div className="flex flex-row h-full gap-4 px-2 ">
      <div className="flex flex-col">
          <ProductsCard />
        <div className='h-full w-full'>
          <ProductSearchTable />
        </div>
      </div>
      <div>
        <OrderCard />
      </div>
    </div>
  )
}
