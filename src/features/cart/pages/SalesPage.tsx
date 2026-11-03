import { OrderCard } from "../components/OrderCard";
import { ProductsCard } from "../components/ProductsCard";
import { ProductSearchTable } from "../components/ProductSearchTable";

export const SalesPage = () => {
  return (
    // gap-4
    <div className="flex flex-row h-full gap-4 px-2 justify-between">
      <div className="flex flex-col">
          <ProductsCard />
        <div className='h-full w-full border border-amber-500'>
          <ProductSearchTable />
        </div>
      </div>
      <div className="">
        <OrderCard />
      </div>
    </div>
  )
}
