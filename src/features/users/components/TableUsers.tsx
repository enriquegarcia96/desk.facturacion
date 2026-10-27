import { useEffect, useState } from 'react';

import type { TableProps } from 'antd';
import { IoCreateSharp } from "react-icons/io5";
import { Space, Switch, Table, Tag, Tooltip } from 'antd';

import { useUserStore } from '../store/user.store';
import { IEmployee } from '@interface/ApiResponse';
import {TableDataEmployee} from '@interface/TableType';
import { EnumState } from '@interface/EnumActions';


const columns: TableProps<TableDataEmployee>['columns'] = [
  {
    title: 'Nombre completo',
    dataIndex: 'fullName',
    key: 'fullName',
    render: (text) => <p className='font-semibold'>{text}</p>,
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
        <Switch
          className='font-semibold'
          checkedChildren={EnumState.ACTIVO}
          unCheckedChildren={EnumState.INACTIVO}
          //checked={record.state === EnumState.ACTIVO}
          defaultChecked={record.state === EnumState.ACTIVO}
          onChange={onChange}
        />
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
    render: (_, record: TableDataEmployee) => (
      <Space size='small'>
        <Tooltip title={'Editar'} >
          <IoCreateSharp 
            size={20} 
            onClick={ss} 
            className='cursor-pointer'
            color='red'
          />
        </Tooltip>
        
      </Space>
    ),
  },
];

const onChange = (checked: boolean) => {
  console.log(`switch to ${checked}`);
};

const ss = () => {

}

export const TableUsers = () => {
  const {getEmployeesAction} = useUserStore();
  const [employees, setEmployees] = useState<IEmployee[]>();

  useEffect(() => {
    const load = async () => {
      try {
        setEmployees(await getEmployeesAction());
      } finally{

      }
    }

    load();
  }, [getEmployeesAction]);

  return (
    <Table<TableDataEmployee> columns={columns} dataSource={employees} />
  )
}