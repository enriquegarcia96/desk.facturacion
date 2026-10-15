import { InventoryCategory } from "../../components/InventoryCategory";
import { InventoryTable } from "../../components/InventoryTable";

export const InventoryPage = () => {
  return (
    <div>
      <h1>Categorias</h1>
      <InventoryCategory />

      <InventoryTable />
    </div>
  );
};
