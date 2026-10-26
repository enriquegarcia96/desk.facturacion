import { lazy, useState } from "react";

import { Button } from "antd";
import { IoPersonAddSharp  } from "react-icons/io5";

import { TableUsers } from "../components/TableUsers";
const FormEditOrAddUser = lazy(() => import('../components/FormEditOrAddUser'));

export const UsersPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [position, _] = useState<'start' | 'end'>('end');

  const onClosed = () => {
    setOpenModal(false);
  }

  return (
    <>
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
    </>
  )
}
