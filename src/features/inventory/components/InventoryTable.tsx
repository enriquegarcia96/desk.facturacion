import React, { useEffect, useRef, useState } from 'react';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DeleteFilled, DeleteOutlined, DownOutlined, EditFilled, EditOutlined, ExclamationCircleOutlined, PlusOutlined, ShopTwoTone, SyncOutlined } from '@ant-design/icons';
import { GetRef, TableColumnsType, TableProps, Flex, Tag, Divider } from 'antd';
import { Badge, Dropdown, Space, Table } from 'antd';

import { useInventoryStore } from '../store/inventory.store';
import { TableDataCategory, TableDataProduct } from '@interface/TableType';
import { SlGameController } from 'react-icons/sl';
import classNames from 'classnames';
import { CategoryRequest } from '@interface/Request';
import Actions from 'antd/es/transfer/Actions';
import { FormNewProduct } from './FormNewProduct';

// ===================== HOC AutoHeightTable =====================
const measureClassNames = {
  header: 'measure-header',
  pagination: 'measure-pagination',
};

const tableClassNames = {
  header: {
    wrapper: measureClassNames.header,
  },
  pagination: {
    root: measureClassNames.pagination,
  },
};

type AutoHeightTableProps<RecordType extends object> = Omit<
  TableProps<RecordType>,
  'styles' | 'classNames'
>;

const AutoHeightTable = <RecordType extends object>(
  props: AutoHeightTableProps<RecordType>,
) => {
  const { scroll, style, ...restProps } = props;
  const rootRef = useRef<GetRef<typeof Table>>(null);
  const [scrollY, setScrollY] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);

  const getHeight = (className: string | HTMLElement) => {
    const ele =
      typeof className === 'string'
        ? rootRef.current?.nativeElement?.querySelector<HTMLElement>(
            `.${className}`,
          )
        : className;

    if (ele) {
      const styles = getComputedStyle(ele);
      const marginTop = Number.parseFloat(styles.marginTop) || 0;
      const marginBottom = Number.parseFloat(styles.marginBottom) || 0;

      return ele.getBoundingClientRect().height + marginTop + marginBottom;
    }

    return 0;
  };

  useEffect(() => {
    const element = rootRef.current?.nativeElement;

    if (!element) {
      return;
    }

    const measure = () => {
      const totalHeight = getHeight(element);
      const headerHeight = getHeight(measureClassNames.header);
      const paginationHeight = getHeight(measureClassNames.pagination);

      setScrollY(
        Math.max(0, Math.floor(totalHeight - headerHeight - paginationHeight)),
      );
      setSectionHeight(totalHeight - paginationHeight);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Table<RecordType>
      {...restProps}
      ref={rootRef}
      scroll={{ ...scroll, y: scrollY }}
      style={{ ...style, height: '100%' }}
      styles={{
        section: {
          height: sectionHeight,
        },
      }}
      classNames={tableClassNames}
    />
  );
};

// ===================== Tipos =====================
interface ExpandedDataType {
  key: React.Key;
  date: string;
  name: string;
  upgradeNum: string;
}

interface DataType {
  key: React.Key;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  creator: string;
  createdAt: string;
}

// ===================== Datos =====================
const items = [
  { key: '1', label: 'Action 1' },
  { key: '2', label: 'Action 2' },
];

const expandDataSource = Array.from({ length: 13 }).map<ExpandedDataType>(
  (_, i) => ({
    key: i.toString(),
    date: '2014-12-24 23:12:00',
    name: 'This is production name',
    upgradeNum: 'Upgraded: 56',
  }),
);

const dataSource = Array.from({ length: 2 }).map<DataType>((_, i) => ({
  key: i.toString(),
  name: 'Screen',
  platform: 'iOS',
  version: '10.3.4.5654',
  upgradeNum: 500,
  creator: 'Jack',
  createdAt: '2014-12-24 23:12:00',
}));

// ===================== Columnas sub-tabla =====================
const expandColumns: TableColumnsType<ExpandedDataType> = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Name', dataIndex: 'name', key: 'name', filters: [{text: 'Cola', value: 'coca'}, {text: 'pollo', value: 'polo2'}], onFilter: (value, record) => record.name.indexOf(value as string) === 0 },
  {
    title: 'Status',
    key: 'state',
    render: () => <Badge status="success" text="Finished" />,
  },
  { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  {
    title: 'Action',
    key: 'operation',
    render: () => (
      <Space size="medium">
        <a>Pause</a>
        <a>Stop</a>
        <Dropdown menu={{ items }}>
          <a>
            More <DownOutlined />
          </a>
        </Dropdown>
      </Space>
    ),
  },
];

const expandColumns2: TableColumnsType<TableDataProduct> = [
  {title: 'Producto', dataIndex: 'productName', key: 'productName'},
  { title: 'Date', dataIndex: 'date', key: 'date' },
  //{ title: 'Name', dataIndex: 'name', key: 'name', filters: [{text: 'Cola', value: 'coca'}, {text: 'pollo', value: 'polo2'}], onFilter: (value, record) => record.name.indexOf(value as string) === 0 },
  {
    title: 'Status',
    key: 'state',
    render: () => <Badge status="success" text="Finished" />,
  },
  { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  {
    title: 'Action',
    key: 'operation',
    render: () => (
      <Space size="medium">
        <a>Pause</a>
        <a>Stop</a>
        <Dropdown menu={{ items }}>
          <a>
            More <DownOutlined />
          </a>
        </Dropdown>
      </Space>
    ),
  },
];

// ===================== Columnas tabla padre =====================
const columns: TableColumnsType<DataType> = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Platform', dataIndex: 'platform', key: 'platform' },
  { title: 'Version', dataIndex: 'version', key: 'version' },
  { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: 'Creator', dataIndex: 'creator', key: 'creator' },
  { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Action', key: 'operation', render: () => <a>Publish</a> },
];

// ===================== Sub-tabla (el "dub menu") con scroll fijo =====================
const expandedRowRender = () => (
  <Table<ExpandedDataType>
    columns={expandColumns}
    dataSource={expandDataSource}
    pagination={false}
    scroll={{ y: 200, x: 'max-content' }}   // 👈 scroll fijo del hijo
    size="small"
    showSorterTooltip={{target: 'sorter-icon'}}
  />
);

const variants = ['solid'] as const;
const presets = [
  { status: 'success', icon: <PlusOutlined />, title: 'Agregar Producto', action: 'ADD' },
  { status: 'processing', icon: <EditFilled />, title: 'Editar', action: 'EDIT'},
  { status: 'error', icon: <DeleteFilled />, title: 'Eliminar', action: 'DELETE' },
];

enum ActionsCrud{
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE'
}



// ===================== Componente principal =====================
export const InventoryTable = () => {
  const {loadCategoriesAction, categories, isLoadingCategories, loadProductsByCategoryAction, products} = useInventoryStore();
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    loadCategoriesAction();
  }, [loadCategoriesAction]);

  const columns2: TableColumnsType<TableDataCategory> = [
    {title: 'Nombre', dataIndex: 'nameCategory', key: 'nameCategory'},
    {title: 'Acciones', key: 'operation', render: () => (
      <>
      <Space size={'small'}>
        {variants.map((variant) => (
      <div key={variant}>
        <Flex gap="small" align="center" wrap>
          {presets.map(({ status, icon, title, action }) => (
            <Tag 
              className='cursor-pointer'
              onClick={() => addNewProduct(action)}
              key={status}
              color={status}
              icon={icon}
              variant={variant}
            >
              {title}
            </Tag>
          ))}
        </Flex>
      </div>
    ))}
      </Space>
      </>
    )}
  ];

  const dataSource = Array.from({ length: 2 }).map<DataType>((_, i) => ({
    key: i.toString(),
    name: 'Screen',
    platform: 'iOS',
    version: '10.3.4.5654',
    upgradeNum: 500,
    creator: 'Jack',
    createdAt: '2014-12-24 23:12:00',
  }));

  const dataSource2 = categories.map<TableDataCategory>(({idCategory, nameCategory}) => ({
    key: idCategory,
    idCategory,
    nameCategory
  }));

  const handleExpand = async (expanded: boolean, record: TableDataCategory) => {
    console.log('aquiiiii expnadibee ', expanded)
    console.log('recors ', record);
    const request: CategoryRequest = {
      idCategory: record.idCategory,
      categoryName: record.nameCategory
    }
    await loadProductsByCategoryAction(request);
  }

  const expandDataSource2 = products.map<TableDataProduct>(({idProduct, productName}) => ({
    key: idProduct,
    idProduct, 
    productName
  }))

  const expandedRowRender2 = () => (
  <Table<TableDataProduct>
    columns={expandColumns2}
    dataSource={expandDataSource2}
    pagination={false}
    scroll={{ y: 200, x: 'max-content' }}   // 👈 scroll fijo del hijo
    size="small"
    showSorterTooltip={{target: 'sorter-icon'}}
  />
  );

  const addNewProduct = (action: string) => {
    console.log('aquiiii')
  switch (action) {
    case ActionsCrud.ADD:
      setOpen(true);
      console.log(open)
    break;

    case ActionsCrud.EDIT:

    break;

    case ActionsCrud.DELETE:

    break;  
    default:
      break;
  }
}

const onClosed = () => {
  setOpen(false);
}

//si hago click a un nodo vacio, entonces, y luego a uno que si hay data, me copia que no hay data y vioce versa
  return (
    <>
    <FormNewProduct openModal={open} onClosed={() => onClosed()} />
    <div
      style={{
        height: '100vh', // hace mas alto la tablanpx
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 24,
        boxSizing: 'border-box',
        background: '#f5f5f5',
        overflow: 'auto',
      }}
    > 
      
      <div style={{ height: 450, minHeight: 0 }}>
        <AutoHeightTable<TableDataCategory>
          columns={columns2}
          expandable={{ onExpand: handleExpand, expandedRowRender: expandedRowRender2 }}
          dataSource={dataSource2}
          size='small'
          loading={{
            spinning: isLoadingCategories,
            indicator: <ShopTwoTone style={{ fontSize: 80 }} spin />,
            description: 'Cargando...'
          }}
        />
      </div>

    </div>
    </>
  );
};



