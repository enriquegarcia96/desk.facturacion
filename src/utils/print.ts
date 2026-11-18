import {
  list_thermal_printers,
  print_thermal_printer,
  ENCODE,
  PrinterInfo,
  PrintJobRequest,
  title,
  text,
  line,
  feed,
  cut,
  table,
  TEXT_ALIGN,
} from "tauri-plugin-thermal-printer";

import { PARAMETERS } from "./../config";
import {formattedMoney} from '../utils';
import { IInvoice, IInvoiceDetail } from "@interface/ApiResponse";

export const printInvoice = async ({dateInvoice, invoiceDetail, totalAmountInvoice}: IInvoice): Promise<boolean> => {
  let printers: PrinterInfo[];

  try {
    printers = await list_thermal_printers();
  } catch (error) {
    console.log("Lista de impresoras fallida: " + error);
    return false;
  }

  const printerSelected: PrinterInfo = printers.find(
    (printer) => printer.name === PARAMETERS.THERMAL_PRINTER_NAME,
  )!;

  if (!printerSelected) {
    alert("No hay una impresora seleccionada.");
    return false;
  }

  const ticket: PrintJobRequest = buildPrintRequest(dateInvoice, invoiceDetail, totalAmountInvoice, printerSelected);

  try {
    await print_thermal_printer(ticket);
    return true;
  } catch (error) {
    console.error("Error al imprimir:", error);
    return false;
  }
};


const buildPrintRequest = (dateInvoice: string, invoiceDetail: IInvoiceDetail[], totalAmountInvoice: string, printerSelected: PrinterInfo): PrintJobRequest => {
  const ticket: PrintJobRequest = {
    printer: printerSelected.name,
    paper_size: "Mm80",
    options: {
      code_page: 0,
      encode: ENCODE.ACCENT_REMOVER,
      use_gbk: false,
    },
    sections: [
      title(PARAMETERS.COMMERCE_NAME),
      text(dateInvoice.replace('T', ''), {
        align: TEXT_ALIGN.CENTER,
      }),
      feed(1),
      table(
        6,
        [[
            text("CANT", { bold: true, align: TEXT_ALIGN.RIGHT, size: "double" }),
            text("PRODUCTO", { bold: true }),
            text(" "),
            text("PRECIO", { bold: true, align: TEXT_ALIGN.RIGHT, size: 'width' }),
            text(" "),
            text("MONTO", { bold: true, align: TEXT_ALIGN.RIGHT, size: 'height' }),
        ]],
        { column_widths: [6, 20, 1, 10, 1, 10], truncate: false },
      ),
      line("="),
      text("* * * * *", { align: TEXT_ALIGN.CENTER}),
      line("="),
      table(
        6,
        invoiceDetail.map((item) => [
          text(String(item.quantityProduct), { align: TEXT_ALIGN.RIGHT }),
          text(item.productName),
          text(" "),
          text(formattedMoney(item.salePrice), { align: TEXT_ALIGN.RIGHT }),
          text(" "),
          text(formattedMoney(item.amount), {align: TEXT_ALIGN.RIGHT})
        ]),
        { column_widths: [6, 20, 1, 10, 1, 10], truncate: false, word_wrap: true },
      ),
      line("-"),
      // Totales
      table(
        2,
        [
          [text("SUBTOTAL:"), text(formattedMoney(totalAmountInvoice), { align: TEXT_ALIGN.RIGHT })],
          [
            text("TOTAL:", { bold: true }),
            text(formattedMoney(totalAmountInvoice), { bold: true, align: TEXT_ALIGN.RIGHT }),
          ],
        ],
        { column_widths: [32, 16], truncate: false },
      ),
      line("="),

      feed(1),
      text("Gracias por su compra", { align: TEXT_ALIGN.CENTER }),
      feed(2),
      cut(),
    ],
  };
  return ticket;
}