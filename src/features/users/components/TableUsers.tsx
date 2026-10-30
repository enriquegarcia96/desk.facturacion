import { useEffect, useState } from 'react';

import { Table } from 'antd';
import { ShopTwoTone} from '@ant-design/icons';

import { useUserStore } from '../store/user.store';
import {TableDataEmployee} from '@interface/TableType';
import { getColumnsEmployees } from './ColumnsEmployees';
import { UpdateStateUserRequest } from '@interface/Request';

export const TableUsers = () => {
  const [_openPop, setOpenPop] = useState(false);
  const {getEmployeesAction
    , isLoadData
    , employees
    , updateStateUserAction} = useUserStore();

  useEffect(() => {
    const load = async () => {
      try {
        await getEmployeesAction();
      } catch(error){
        console.error(error);
      }
    }
    load();
  }, [getEmployeesAction]);

  const confirm = async (record: TableDataEmployee) => {
    console.log(record);
    const request: UpdateStateUserRequest = {
      state: !record.state,
      userName: record.userName
    };
    await updateStateUserAction(request);
  };

  const cancel = () => {
    setOpenPop(false);
  };

  const handleSwitchChange = () => {
    setOpenPop(true);
  }

  const columns = getColumnsEmployees({
    onChangeState: confirm,
    onCancel: cancel,
    onHandleSwitchChange: handleSwitchChange
  })

  const datasource = employees.map<TableDataEmployee>(({fullName, role, state, userName}) => ({
    key: userName,
    fullName,
    role, 
    state, 
    userName
  }));

  return (
    <>
      <Table<TableDataEmployee>
        columns={columns}
        dataSource={datasource}
        loading={{
          spinning: isLoadData
          , indicator: <ShopTwoTone style={{ fontSize: 80 }} spin />
          , description: 'Cargando...'
        }}
      />
    </>
  )
}