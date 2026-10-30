import { lazy, useState } from "react";

import { Button } from "antd";
import { IoPersonAddSharp  } from "react-icons/io5";

import { useUserStore } from "../store/user.store";
import { TableUsers } from "../components/TableUsers";

const FormEditOrAddUser = lazy(() => import('../components/FormEditOrAddUser'));
const Message = lazy(() => import('../../../components/shared/Message/Message'));

export const UsersPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [position, _] = useState<'start' | 'end'>('end');
  const {messageNewUser, newEmployeeCreate, clearMessage} = useUserStore();

  const onClosed = () => {
    setOpenModal(false);
  }

  return (
    <div>
      {
        messageNewUser != '' && (
          <Message
          messageToUser={messageNewUser}
          typeMessage={newEmployeeCreate ? 'success' : 'error'}
          onClose={clearMessage}
        />)
      }
      
      <div className='flex flex-row justify-between'>
        <h1>Usuarios Editar / Crear</h1>
        <Button 
          onClick={() => setOpenModal(true)}
          type="primary"
          icon={<IoPersonAddSharp />}
          iconPlacement={position}
        >
          Crear Usuario
        </Button>
      </div>

      {openModal && (
        <FormEditOrAddUser
          openModal={openModal}
          onClosed={() => onClosed()}
        />
      )}

      <TableUsers />
    </div>
  )
}
