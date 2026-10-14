import { InventoryCategory } from "../../components/InventoryCategory";
import { InventoryTable } from "../../components/InventoryTable";

export const InventoryPage = () => {
  return (
    <div>
      <h5>hola desde home </h5>
      <InventoryCategory />  
      
      <InventoryTable />
    </div>
  )
}
