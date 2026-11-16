import {
  list_thermal_printers,
  ENCODE,
  PrinterInfo,
  PrintJobRequest,
  print_thermal_printer,
  test_thermal_printer,
  TestPrintRequest
} from "tauri-plugin-thermal-printer";

import { PARAMETERS } from "./../config";

interface Pros {}

export const printInvoice = async (): Promise<void> => {
  let printers: PrinterInfo[];

  try {
    printers = await list_thermal_printers();
  } catch (error) {
    console.log("Lista de impresoras fallida: " + error);
    return;
  }

  const printerSelected: PrinterInfo = printers.find(
    (printer) => printer.name === PARAMETERS.THERMAL_PRINTER_NAME,
  )!;

  if (!printerSelected) {
    alert("No hay una impresora seleccionada.");
    return;
  }

  const ticket: PrintJobRequest = {
    printer: printerSelected.name,
    paper_size: "Mm80",
    options: {
      code_page: 0,
      encode: ENCODE.ACCENT_REMOVER,
      use_gbk: false,
    },
    sections: [
      { Title: { text: PARAMETERS.COMMERCE_NAME } },
      { Feed: { feed_type: "lines", value: 1 } },
      {
        Text: {
          text: "Bienvenido",
          styles: { align: "center", size: "height", bold: false },
        },
      },
      {
        Text: {
          text: "Su turno es:",
          styles: { align: "center", size: "height", bold: false },
        },
      },
      { Feed: { feed_type: "lines", value: 1 } },
      {
        Text: {
          text: "newTicket.ticket",
          styles: {
            bold: true,
            align: "center",
            size: "double",
            double_strike: true,
          },
        },
      },
      { Feed: { feed_type: "lines", value: 1 } },
      { Subtitle: { text: "newTicket.bankName", styles: { align: "center" } } },
      {
        Subtitle: {
          text: "newTicket.creationDate",
          styles: { align: "center" },
        },
      },
      { Feed: { feed_type: "lines", value: 2 } },
      {
        Text: {
          text: "Desarrollado Por Aurora Core",
          styles: { align: "left" },
        },
      },
      { Line: { character: "=" } },
      { Cut: { mode: "partial", feed: 0 } },
    ],
  };

  try {
    await print_thermal_printer(ticket);
  } catch (error) {
    console.error("Error al imprimir:", error);
  }
};
