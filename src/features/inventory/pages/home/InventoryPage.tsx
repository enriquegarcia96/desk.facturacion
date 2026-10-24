import { useInventoryStore } from "../../store/inventory.store";
import { InventoryTable } from "../../components/InventoryTable";
import { InventoryCategory } from "../../components/InventoryCategory";
import { Message } from "../../../../components/shared/Message/Message";

export const InventoryPage = () => {
  return (
    <div>
      <h1>Categorias</h1>
      <ShowMessage />
      <InventoryCategory />
      <InventoryTable />
    </div>
  );
};

export const ShowMessage = () => {
  const newCategoryLoad = useInventoryStore((state) => state.newCategoryLoad);
  const  messageNewCategory  = useInventoryStore((state) => state.messageNewCategory);
  const clearMessageNewCategory = useInventoryStore((state) => state.clearMessageNewCategory);

  if (messageNewCategory === '') return null;

  return (    
    <Message 
      messageToUser={messageNewCategory}
      typeMessage={newCategoryLoad ? 'success' : 'error'}
      onClose={clearMessageNewCategory}
    />
  )
}
