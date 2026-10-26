import { lazy, useEffect, useState } from "react";
import {
  Form,
  Input,
  Modal,
  Select,
} from "antd";

import { IRole } from "@interface/ApiResponse";
import { useUserStore } from "../store/user.store";
import { NewUserRequest } from "@interface/Request";
import { EnumActionsCrud } from '@interface/EnumActions';

const Message = lazy(() => import('../../../components/shared/Message/Message'));

type Props = {
  openModal: boolean;
  onClosed: () => void;
};

const FormEditOrAddUser = ({ openModal, onClosed }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<IRole[]>();
  const [showMessage, setShowMessage] = useState(false);
  const {loadRolesAction, addNewUserAction, message, newEmployeeCreate, clearMessage} = useUserStore();

  useEffect(() => {
    const load = async() => {
      try {
        const listRoles = await loadRolesAction();
        setRoles(listRoles);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [loadRolesAction]);

  const onCreate = async (request: NewUserRequest) => {
    const request2: NewUserRequest = {
      ...request
      , typeAction: EnumActionsCrud.ADD
    }

    const isCorrect: boolean = await addNewUserAction(request2);
    
    if (!isCorrect) {
      setShowMessage(true);
      return;
    }
    
    setTimeout(() => {
      setShowMessage(true);
      onClosed();
    }, 2000);
  };

  return (
    <>
      {showMessage && (
        <Message
          messageToUser={message}
          typeMessage={newEmployeeCreate ? 'success' : 'error'}
          onClose={clearMessage}
        />
      )}

      <Modal
        open={openModal}
        width={700}
        title="Nuevo Empleado"
        okText="Confirmar"
        cancelText="Cancelar"
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        onCancel={onClosed}
        destroyOnHidden
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: "public" }}
            clearOnDestroy
            onFinish={(values) => onCreate(values)}
            size='small'
            className="font-bold"
          >
            {dom}
          </Form>
        )}
      >
      <div className="flex flex-row justify-items-center flex-wrap gap-1">
        
        <Form.Item label="Nombres" htmlFor="firstName">
          <Form.Item<NewUserRequest>
            name="firstName"
            rules={[{ required: true, message: "Requerido" }]}
          >
          <Input
            id="firstName"
            placeholder="Ej. Derick"
          />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Apellidos" htmlFor="lastName">
          <Form.Item<NewUserRequest>
            name="lastName"
            rules={[{ required: true, message: "Requerido" }]}
          >
            <Input
              id="lastName"
              placeholder="Ej. Gudiel"
            />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Identidad" htmlFor="employeeIdentity">
          <Form.Item<NewUserRequest>
            name="employeeIdentity"
            rules={[{ required: true, message: "Requerido" }]}
          >
            <Input
              id="employeeIdentity"
              placeholder="Ej. 9999999999"
              min={13}
              maxLength={13}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Rol" htmlFor="typeRol">
          <Form.Item<NewUserRequest>
            name='roleId'
            rules={[{ required: true, message: "Requerido" }]}
          >
            <Select
              placeholder='Elegir opción'
              size='small'
              options={roles}
              loading={loading}
            />
          </Form.Item>
      </Form.Item>

      <Form.Item label="Contraseña" htmlFor="password">
          <Form.Item<NewUserRequest>
            name="password"
            rules={[{ required: true, message: "Requerido" }]}
          >
            <Input
              id="password"
              placeholder="Contraseña"
              min={13}
              type={'password'}
              maxLength={13}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item label="User Name" htmlFor="userName">
          <Form.Item<NewUserRequest>
            name="userName"
            rules={[{ required: true, message: "Requerido" }]}
          >
            <Input
              id="userName"
              placeholder="Ej. usuario_caja"
              min={13}
              maxLength={13}
            />
          </Form.Item>
        </Form.Item>
      </div> 
    </Modal>
  </>
  );
};
export default FormEditOrAddUser;