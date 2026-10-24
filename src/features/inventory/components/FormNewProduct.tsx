import {  Form, Modal } from 'antd';

import { InputsToSale } from './InputsToSale';
import { InputsToProduct } from './InputsToProduct';
import { NewProductRequest } from '@interface/Request';
import { InputsToInventory } from './InputsToInventory';
import { useAuthStore } from '../../auth/store/auth.store';
import { useInventoryStore } from '../store/inventory.store';
import { Message } from '../../../components/shared/Message/Message';

type Props = {
  openModal: boolean;
  typeAction: string;
  categoryId: number;
  onClosed: () => void;
}

export const FormNewProduct = ({ openModal, onClosed, typeAction, categoryId }: Props) => {
  const createNewProductAction = useInventoryStore((state) => state.createNewProductAction);
  const modifyBy = useAuthStore((state) => state.user?.userName || 'sys');
  const [form] = Form.useForm();

  const onCreate = async (values: NewProductRequest) => {
    const request: NewProductRequest = {...values, typeAction, modifyBy, categoryId};
    console.log('tipo deaccion ? ', request);
    const isCreateCorrect: boolean = await createNewProductAction(request);

    if (!isCreateCorrect) {
      return;
    }

    setTimeout(() => {
      onClosed();
    }, 1000);
    
  };

  return (
      <Modal
        open={openModal}
        title="Creación de nuevo producto"
        okText="Crear"
        cancelText="Cancelar"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={onClosed}
        destroyOnHidden
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
            clearOnDestroy
            onFinish={(values) => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        
      <ShowMessage />
      <InputsToProduct />
      <InputsToSale />   
      <InputsToInventory />
    </Modal>
  );
}

export const ShowMessage = () => {
  const message = useInventoryStore((state) => state.messageNewProduct);
  const newProductLoad = useInventoryStore((state) => state.newProductLoad);
  const clearMessageNewProduct = useInventoryStore((state) => state.clearMessageNewProduct);

  if (message === '') return null;
  
  return (
    <Message
      messageToUser={message}
      typeMessage={newProductLoad ? 'success' : 'error'}
      onClose={clearMessageNewProduct}
    />
  )
}

