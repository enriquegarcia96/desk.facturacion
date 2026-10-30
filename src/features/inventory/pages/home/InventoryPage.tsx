import { lazy } from "react";

import { useInventoryStore } from "../../store/inventory.store";
import { InventoryTable } from "../../components/InventoryTable";
import { InventoryCategory } from "../../components/InventoryCategory";

const Message = lazy(() => import('../../../../components/shared/Message/Message'));

export const InventoryPage = () => {
  const newCategoryLoad = useInventoryStore((state) => state.newCategoryLoad);
  const  messageNewCategory  = useInventoryStore((state) => state.messageNewCategory);
  const clearMessageNewCategory = useInventoryStore((state) => state.clearMessageNewCategory);

  return (
    <div>
      <h1>Categorias</h1>
      <Message 
        messageToUser={messageNewCategory}
        typeMessage={newCategoryLoad ? 'success' : 'error'}
        onClose={clearMessageNewCategory}
      />
      <InventoryCategory />
      <InventoryTable />
    </div>
  );
};