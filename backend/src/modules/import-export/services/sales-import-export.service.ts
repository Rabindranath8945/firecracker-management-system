import * as XLSX from "xlsx";
import { Types } from "mongoose";

import SalesRepository from "../../sales/repositories/sales.repository.js";

import type {
  ISale,
  ISaleItem,
  ISalePayment,
  SalesPaymentMethod,
  SalesPaymentStatus,
} from "../../sales/interfaces/sales.interface.js";

import type { ImportResult } from "../types/import-export.types.js";

/* -------------------------------------------------------------------------- */
/* XLSX                                                                        */
/* -------------------------------------------------------------------------- */

const xlsxUtils = XLSX.utils;

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                     */
/* -------------------------------------------------------------------------- */

class SalesImportExportService {
  /* ------------------------------------------------------------------------ */
  /* EXPORT                                                                    */
  /* ------------------------------------------------------------------------ */

  async exportSales(businessId: string): Promise<Buffer> {
    if (!businessId) {
      throw new Error("Business ID is required.");
    }

    if (!Types.ObjectId.isValid(businessId)) {
      throw new Error("Invalid business ID.");
    }

    console.log("=================================");
    console.log("SALES EXPORT DEBUG");
    console.log("Business ID:", businessId);

    const allSales = await SalesRepository.find();

    console.log("Total sales:", allSales.length);

    console.log(
      "Sales business IDs:",
      allSales.map((sale) => ({
        saleNo: sale.saleNo,
        businessId: String(sale.businessId ?? "MISSING"),
        isActive: sale.isActive,
      })),
    );

    console.log("=================================");

    const sales = await SalesRepository.findAllForBusinessExport(businessId);

    const headers = [
      "businessId",
      "saleNo",
      "invoiceNo",
      "saleDate",

      "customerId",
      "customerCode",
      "customerName",
      "customerMobile",

      "subtotal",
      "discount",
      "taxAmount",
      "grandTotal",

      "paidAmount",
      "dueAmount",

      "paymentMethod",

      "cash",
      "upi",
      "card",
      "bank",
      "credit",

      "paymentStatus",

      "notes",

      "items",
    ];

    const data: unknown[][] = [headers];

    for (const sale of sales) {
      const customer =
        sale.customer && typeof sale.customer === "object"
          ? sale.customer
          : null;

      const payment = sale.payment;

      data.push([
        String(sale.businessId ?? businessId),

        String(sale.saleNo ?? ""),

        String(sale.invoiceNo ?? ""),

        formatDate(sale.saleDate),

        customer && "_id" in customer ? String(customer._id) : "",

        customer && "customerCode" in customer
          ? String(customer.customerCode ?? "")
          : "",

        customer && "name" in customer ? String(customer.name ?? "") : "",

        customer && "mobile" in customer ? String(customer.mobile ?? "") : "",

        Number(sale.subtotal ?? 0),

        Number(sale.discount ?? 0),

        Number(sale.taxAmount ?? 0),

        Number(sale.grandTotal ?? 0),

        Number(sale.paidAmount ?? 0),

        Number(sale.dueAmount ?? 0),

        String(payment?.method ?? ""),

        Number(payment?.cash ?? 0),

        Number(payment?.upi ?? 0),

        Number(payment?.card ?? 0),

        Number(payment?.bank ?? 0),

        Number(payment?.credit ?? 0),

        String(sale.paymentStatus ?? ""),

        String(sale.notes ?? ""),

        JSON.stringify(sale.items ?? []),
      ]);
    }

    return createWorkbook(data, "Sales");
  }

  /* ------------------------------------------------------------------------ */
  /* IMPORT                                                                    */
  /* ------------------------------------------------------------------------ */

  async importSales(
    businessId: string,
    file: Express.Multer.File,
  ): Promise<ImportResult> {
    if (!businessId) {
      throw new Error("Business ID is required.");
    }

    if (!Types.ObjectId.isValid(businessId)) {
      throw new Error("Invalid business ID.");
    }

    const rows = readRows(file);

    const result: ImportResult = {
      entity: "SALE",
      total: rows.length,
      imported: 0,
      skipped: 0,
      failed: 0,
      errors: [],
    };

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const excelRow = index + 2;

      try {
        const saleNo = String(row.saleNo ?? "").trim();

        const invoiceNo = String(row.invoiceNo ?? "").trim();

        if (!saleNo) {
          fail(result, excelRow, "saleNo is required.");
          continue;
        }

        if (!invoiceNo) {
          fail(result, excelRow, "invoiceNo is required.");
          continue;
        }

        const existingSale = await SalesRepository.findBySaleNoForBusiness(
          saleNo,
          businessId,
        );

        if (existingSale) {
          result.skipped += 1;
          continue;
        }

        const existingInvoice =
          await SalesRepository.findByInvoiceNoForBusiness(
            invoiceNo,
            businessId,
          );

        if (existingInvoice) {
          result.skipped += 1;
          continue;
        }

        const items = parseItems(row.items);

        if (!items.length) {
          fail(result, excelRow, "Sale must contain at least one item.");
          continue;
        }

        const paymentMethod = parsePaymentMethod(row.paymentMethod);

        const payment: ISalePayment = {
          method: paymentMethod,
          cash: toNumber(row.cash),
          upi: toNumber(row.upi),
          card: toNumber(row.card),
          bank: toNumber(row.bank),
          credit: toNumber(row.credit),
        };

        const paymentStatus = parsePaymentStatus(row.paymentStatus);

        const saleData: Partial<ISale> = {
          businessId: new Types.ObjectId(businessId),

          saleNo,

          invoiceNo,

          saleDate: parseDate(row.saleDate),

          customer: parseObjectId(row.customerId),

          items,

          subtotal: toNumber(row.subtotal),

          discount: toNumber(row.discount),

          taxAmount: toNumber(row.taxAmount),

          grandTotal: toNumber(row.grandTotal),

          paidAmount: toNumber(row.paidAmount),

          dueAmount: toNumber(row.dueAmount),

          payment,

          paymentStatus,

          notes: String(row.notes ?? "").trim(),

          isActive: true,
        };

        await SalesRepository.create(saleData);

        result.imported += 1;
      } catch (error) {
        fail(
          result,
          excelRow,
          error instanceof Error ? error.message : "Unknown sale import error.",
        );
      }
    }

    return result;
  }
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                     */
/* -------------------------------------------------------------------------- */

function readRows(file: Express.Multer.File): Record<string, unknown>[] {
  const workbook = XLSX.read(file.buffer, {
    type: "buffer",
  });

  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("Excel file does not contain a worksheet.");
  }

  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error("Unable to read worksheet.");
  }

  return xlsxUtils.sheet_to_json(worksheet) as Record<string, unknown>[];
}

function createWorkbook(data: unknown[][], sheetName: string): Buffer {
  const worksheet = xlsxUtils.aoa_to_sheet(data);

  const workbook = xlsxUtils.book_new();

  xlsxUtils.book_append_sheet(workbook, worksheet, sheetName);

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  }) as Buffer;
}

function fail(result: ImportResult, row: number, message: string): void {
  result.failed += 1;

  result.errors.push({
    row,
    message,
  });
}

function toNumber(value: unknown): number {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`Invalid number: ${String(value)}`);
  }

  return number;
}

function parseDate(value: unknown): Date {
  const date = value instanceof Date ? value : new Date(String(value ?? ""));

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid sale date.");
  }

  return date;
}

function formatDate(value: unknown): string {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(String(value));

  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

function parseObjectId(value: unknown): Types.ObjectId | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const id = String(value).trim();

  if (!Types.ObjectId.isValid(id)) {
    return undefined;
  }

  return new Types.ObjectId(id);
}

function parsePaymentMethod(value: unknown): SalesPaymentMethod {
  const method = String(value ?? "")
    .trim()
    .toUpperCase();

  const allowed: SalesPaymentMethod[] = [
    "CASH",
    "UPI",
    "CARD",
    "BANK",
    "CREDIT",
    "MIXED",
  ];

  if (!allowed.includes(method as SalesPaymentMethod)) {
    throw new Error(`Invalid payment method: ${method}`);
  }

  return method as SalesPaymentMethod;
}

function parsePaymentStatus(value: unknown): SalesPaymentStatus {
  const status = String(value ?? "")
    .trim()
    .toUpperCase();

  const allowed: SalesPaymentStatus[] = ["PAID", "PARTIAL", "DUE"];

  if (!allowed.includes(status as SalesPaymentStatus)) {
    throw new Error(`Invalid payment status: ${status}`);
  }

  return status as SalesPaymentStatus;
}

function parseItems(value: unknown): ISaleItem[] {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    throw new Error("Invalid items JSON.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Items must be an array.");
  }

  return parsed as ISaleItem[];
}

export default new SalesImportExportService();
