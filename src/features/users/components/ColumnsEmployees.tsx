import type { TableProps } from 'antd';
import { IoCreateSharp  } from "react-icons/io5";
import { QuestionCircleFilled} from '@ant-design/icons';
import { Space, Switch, Tag, Tooltip, Popconfirm } from 'antd';

import { EnumState } from '@interface/EnumActions';
import {TableDataEmployee} from '@interface/TableType';

interface GetColumnsParams {
  onChangeState: (record: TableDataEmployee) => void;
  onCancel: () => void;
  onHandleSwitchChange: () => void;
}

const editEmployee = () => {}

export const getColumnsEmployees = ({onChangeState, onCancel, onHandleSwitchChange}: GetColumnsParams)
  : TableProps<TableDataEmployee>['columns'] => [

  {
    title: 'Nombre completo',
    dataIndex: 'fullName',
    key: 'fullName',
    render: (text: string) => <p className='font-semibold'>{text}</p>,
  },
  {
    title: 'Roles',
    dataIndex: 'role',
    key: 'role',
    render: (_: any, record: TableDataEmployee, index: number) => (
      <>
        <Tag
          className='font-semibold'
          variant='outlined'
          color={record.role === 'administrador' ? 'cyan' : 'purple'}
          key={index}
        >
          {record.role}
        </Tag>
      </>
    ),
  },
  {
    title: 'Estado',
    dataIndex: 'state',
    key: 'state',
    render: (_: any, record: TableDataEmployee, index: number) => (
    <>
      <Popconfirm
        title="Cambiar estado"
        description={`¿Esta seguro de ${record.state ? `Inactivar`: `Activar`  } al empleado ${record.fullName}?`}
        onConfirm={() => onChangeState(record)}
        onCancel={onCancel}
        okText="Si, confirmar"
        icon={<QuestionCircleFilled />}
        cancelText="No"
      >
        <Switch
          className='font-semibold'
          checkedChildren={EnumState.ACTIVO}
          unCheckedChildren={EnumState.INACTIVO}
          checked={record.state}
          onClick={onHandleSwitchChange}
          key={index}
        />
      </Popconfirm>
    </>
    ),
  },
  {
    title: 'Usuario',
    key: 'userName',
    dataIndex: 'userName',
    render: (_: any, record: TableDataEmployee, index: number) => (
      <p className='font-semibold' key={index}>
        {record.userName}
      </p>
    ),
  },
  {
    title: 'Acciones',
    key: 'action',
    render: (_: any, _record: TableDataEmployee) => (
      <Space size='small'>
        <Tooltip title={'Editar'} >
          <IoCreateSharp 
            size={20} 
            onClick={editEmployee} 
            className='cursor-pointer'
            color='red'
          />
        </Tooltip>
      </Space>
    ),
  },
];