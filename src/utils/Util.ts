import type { InputNumberProps } from 'antd';

export const formatter: InputNumberProps<number>['formatter'] = (value) => {
  const [start, end] = `${value}`.split('.') || [];
  const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `L ${end ? `${v}.${end}` : `${v}`}`;
};

export const formatterToStock: InputNumberProps<number>['formatter'] = (value) => {
    const [start, end] = `${value}`.split('.') || [];
    const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${end ? `${v}.${end}` : `${v}`}`;
};

export const checkPrice = (_: any, value: number): Promise<void> => {
  if (value > 0) {
    return Promise.resolve();
  }
  return Promise.reject(new Error(`El precio debe ser mayor que cero`));
};

export const checkStock = (_: any, value: number): Promise<void> => {
  if (value > 0) {
    return Promise.resolve();
  }
  return Promise.reject(new Error(`El stock debe ser mayor que cero`));
};

export const formattedMoney = (price: string): string => {
  const money = parseFloat(price) || 0;
  return `L${money.toLocaleString('es-HN',
    { minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
}

export const fechaActual = (): string => {
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('sv-SE');
  const hora = ahora.toLocaleTimeString('en-GB');
  return `${fecha} ${hora}`;
}

export const fmtHN = (): string => new Intl.DateTimeFormat('sv-SE',{
  year: 'numeric', month: '2-digit', day: '2-digit'
  , hour: '2-digit', minute: '2-digit', second: '2-digit'
  , hour12: false
  , timeZone: 'America/Tegucigalpa'
}).format(new Date)