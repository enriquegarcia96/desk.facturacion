import { useEffect, useRef, useState } from 'react';

import { Button, Input, InputRef, Space, Table, TableColumnType, Tooltip } from 'antd';
import { GetRef, TableColumnsType, TableProps, Flex, Tag } from 'antd';
import { DeleteFilled, EditFilled, PlusOutlined, SearchOutlined, ShopTwoTone} from '@ant-design/icons';

import { FormNewProduct } from './FormNewProduct';
import { CategoryRequest } from '@interface/Request';
import {EnumActionsCrud} from '@interface/EnumActions';
import { useInventoryStore } from '../store/inventory.store';
import { TableDataCategory, TableDataProduct } from '@interface/TableType';
import { FilterDropdownProps } from 'antd/es/table/interface';


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


// ===================== Columnas sub-tabla =====================// Source - https://stackoverflow.com/a/75491179
// Posted by Brice Zele, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-21, License - CC BY-SA 4.0

//onFilter: (value, record) => record.idea?.includes(value) === 0

// { title: 'Name', dataIndex: 'name', key: 'name', filters: [{text: 'Cola', value: 'coca'}, {text: 'pollo', value: 'polo2'}], onFilter: (value, record) => record.name.indexOf(value as string) === 0 },


const variants = ['solid'] as const;
const presets = [
  { status: 'success', icon: <PlusOutlined />, title: 'Agregar Producto', action: 'ADD' },
  { status: 'processing', icon: <EditFilled />, title: 'Editar', action: 'EDIT'},
  { status: 'error', icon: <DeleteFilled />, title: 'Eliminar', action: 'DELETE' },
];



export const InventoryTable = () => {
  const {loadCategoriesAction
    , categories
    , isLoadingCategories
    , loadProductsByCategoryAction
    , products
    , isLoadingProducts} = useInventoryStore();
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  type DataIndex = keyof TableDataProduct;
  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<TableDataProduct> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        text ? text.toString() : ''
        ) : (
          text
        ),
  });

  const expandColumns2: TableColumnsType<TableDataProduct> = [
  {title: 'Producto', dataIndex: 'productName', key: 'productName', ...getColumnSearchProps('productName') },
  { title: 'Stock', dataIndex: 'stock', key: 'stock', render: (_: any, record: TableDataProduct) => <Tag  key={'filled'} color={record.stock < 4 ? 'volcano' : "green"}>{record.stock}</Tag>},
  {title: 'Precio', dataIndex:'salePrice', key: 'salePrice', render: (value) => `L. ${value ?? 0} p/u`},  
  {
    title: 'Edición',
    key: 'operation',
    render: () => (
      <Space size='small'>
        <Tooltip title='Editar'>
          <EditFilled style={{color: 'blue', fontSize: 17}} onClick={ss} />
        </Tooltip>
        <Tooltip title='Eliminar'>
          <DeleteFilled style={{color: 'red', fontSize: 17}} onClick={ss} />
        </Tooltip>
      </Space>
    ),
  },
];

const ss = () => {

}

const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  
  useEffect(() => {
    loadCategoriesAction();
  }, [loadCategoriesAction]);

  const columns2: TableColumnsType<TableDataCategory> = [
    {title: 'Nombre', dataIndex: 'nameCategory', key: 'nameCategory'},
    {title: 'Acciones', key: 'operation', render: (_: any, record: TableDataCategory) => (
      <>
      <Space size={'small'}>
        {variants.map((variant) => (
      <div key={variant}>
        <Flex gap="small" align="center" wrap>
          {presets.map(({ status, icon, title, action }) => (
            <Tag 
              className='cursor-pointer'
              onClick={() => actionsCrud(action, record.idCategory)}
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

  const dataSource2 = categories.map<TableDataCategory>(({idCategory, nameCategory}) => ({
    key: idCategory
    ,idCategory
    ,nameCategory
  }));

  const handleExpand = async (expanded: boolean, record: TableDataCategory) => {
    setExpandedRowKeys(expanded ? [record.idCategory] : []);
    const request: CategoryRequest = {
      idCategory: record.idCategory,
      categoryName: record.nameCategory
    }
    await loadProductsByCategoryAction(request);
  }

  const expandDataSource2 = products.map<TableDataProduct>(({idProduct, productName, salePrice, stock}) => ({
    key: idProduct,
    idProduct, 
    productName,
    salePrice,
    stock
  }))

  const expandedRowRender2 = () => (
    <Table<TableDataProduct>
      className='capitalize'
      columns={expandColumns2}
      dataSource={expandDataSource2}
      pagination={false}
      scroll={{ y: 200, x: 'max-content' }}// 👈 scroll fijo del hijo
      size="small"
      loading={{
        spinning: isLoadingProducts
      }}
      showSorterTooltip={{target: 'sorter-icon'}}
    />
  );

  const actionsCrud = async (action: string, categoryId: number) => {
    const request: CategoryRequest = {idCategory: categoryId, categoryName: ""};
    switch (action) {
      case EnumActionsCrud.ADD:
        setCategoryId(categoryId);
        setExpandedRowKeys([categoryId]);
        await loadProductsByCategoryAction(request);
        setOpen(true);
      break;

      case EnumActionsCrud.EDIT:
      break;

      case EnumActionsCrud.DELETE:
      break;  
      default:
        break;
    }
  }

  const onClosed = () => {
    setOpen(false);
  }

  return (
    <>
      <FormNewProduct 
        openModal={open}
        typeAction={EnumActionsCrud.ADD}
        onClosed={() => onClosed()}
        categoryId={categoryId}
      />
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
          expandable={{ 
            onExpand: handleExpand
            ,expandedRowRender: expandedRowRender2
            ,expandedRowKeys
          }}
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



