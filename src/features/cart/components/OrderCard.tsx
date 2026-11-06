import { useState } from 'react';
import { Card, Button } from 'antd';
import { IoQrCodeSharp, IoSearch } from "react-icons/io5";

import {
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined,
  PauseOutlined,
  DollarOutlined,
  MobileOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';

const items = [
  { id: 1, name: 'Nombre producto', unit: 1000, qty: 2 },
  { id: 2, name: 'Nombre producto', unit: 1000, qty: 1, discount: 15 },
  { id: 3, name: 'Nombre producto', unit: 1000, qty: 1 },
  { id: 4, name: 'Nombre producto', unit: 1000, qty: 1 },
  { id: 5, name: 'Nombre producto', unit: 1000, qty: 1 },  
];

const payments = [
  { key: 'cash', label: 'Efectivo', icon: <DollarOutlined /> },
  { key: 'transfer', label: 'Transferencia', icon: <MobileOutlined /> },
  { key: 'debit', label: 'Débito', icon: <CreditCardOutlined /> },
  { key: 'credit', label: 'Crédito', icon: <CreditCardOutlined /> },
];

const money = (n: number) => `$ ${n.toLocaleString('es-AR')}`;

export const OrderCard = () => {
  const [payment, setPayment] = useState('transfer');

  const subtotal = items.reduce((s, i) => s + i.unit * i.qty, 0);
  const discount = items.reduce(
    (s, i) => s + (i.discount ? (i.unit * i.qty * i.discount) / 100 : 0),
    0
  );
  const total = subtotal - discount;

  return (
    <div className="w-full h-150">
      <Card
        className="h-full w-full flex flex-col border-0! rounded-lg! bg-white!"
        title={<span className="text-xl font-bold">Orden de compra</span>}
        extra={<span className="text-xs text-gray-500">23 de mayo de 2024, 18:39hs</span>}
        styles={{
          //header: { borderBottom: 0, paddingTop: 13 },
          body: {
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 0,
          },
        }}
      >
        {/* Lista con scroll */}
        <div className="flex-1  overflow-y-auto">
          {items.length > 0  ? items.map((item) => (
            <div key={item.id} className="flex justify-between py-1 border-b border-gray-200">
              <div>
                <div className="text-sm">{item.name}</div>
                <div className="text-xs text-gray-500">
                  {item.discount && (
                    <span className="text-red-600 mr-2">Descuento {item.discount}%</span>
                  )}
                  {money(item.unit)} /u
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm">{money(item.unit * item.qty)}</span>
                <div className="flex items-center gap-3">
                  <MinusOutlined className="cursor-pointer" />
                  <span className="text-sm font-semibold">{item.qty}</span>
                  <PlusOutlined className="cursor-pointer" />
                </div>
              </div>
            </div>
          )) : (<OrderCardEmpty />)}
        </div>

        {/* Resumen */}
        <div className="border-t-2 border-dotted border-black mt-3 pt-3 text-sm">
          <div className="flex justify-between text-gray-500 font-semibold">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="flex justify-between text-red-600 font-semibold">
            <span>Descuento</span>
            <span>-{money(discount)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>

        {/* Método de pago */}
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-2">Elegir método de pago</div>
          <div className="grid grid-cols-4 gap-2">
            {payments.map((p) => (
              <Button
                key={p.key}
                onClick={() => setPayment(p.key)}
                className="h-14! flex! flex-col! items-center! justify-center! gap-0!"
                style={{
                  borderColor: payment === p.key ? '#000' : '#d9d9d9',
                  borderWidth: payment === p.key ? 2 : 1,
                  color: payment === p.key ? '#000' : '#8c8c8c',
                }}
              >
                {p.icon}
                <span className="text-xs">{p.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-[1fr_1.4fr] gap-3 mt-4">
          <Button size="large" icon={<PauseOutlined />} className="font-semibold! border-black! border-2!">
            Pausar venta
          </Button>
          <Button size="large" type="primary" className="bg-black! font-semibold!">
            Efectuar venta
          </Button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <Button type="text" danger icon={<DeleteOutlined />} className="font-semibold! px-0!">
            Eliminar venta
          </Button>
          {/* <Checkbox defaultChecked>Imprimir ticket</Checkbox> */}
        </div>
      </Card>
    </div>
  );
}

export const OrderCardEmpty = () => {
  return (
  <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
    <IoQrCodeSharp size={30} />
    <div>
      <p className="text-base font-bold">Escanear el código de barras</p>
      <p className="font-normal">para añadir productos a la orden de compra.</p>
    </div>
    <span className="my-2 font-normal text-gray-500">o</span>
    <IoSearch size={30} />
    <div>
      <p className="text-base font-bold">Buscarlos manualmente a la izquierda</p>
      <p className="font-normal">para añadir productos a la orden de compra.</p>
    </div>
  </div>
  )
}
