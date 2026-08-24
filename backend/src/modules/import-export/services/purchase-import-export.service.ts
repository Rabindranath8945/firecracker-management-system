import * as XLSX from "xlsx";
import { Types } from "mongoose";

import PurchaseRepository from "../../purchase/repositories/purchase.repository.js";

import type {
  IPurchase,
  IPurchaseItem,
  PurchasePaymentMethod,
  PurchaseStatus,
} from "../../purchase/interfaces/purchase.interface.js";

import type { ImportResult } from "../types/import-export.types.js";

/* -------------------------------------------------------------------------- */
/* XLSX                                                                        */
/* -------------------------------------------------------------------------- */

const xlsxUtils = XLSX.utils;

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                     */
/* -------------------------------------------------------------------------- */

class PurchaseImportExportService {
  /* ------------------------------------------------------------------------ */
  /* EXPORT PURCHASES                                                         */
  /* ------------------------------------------------------------------------ */

  async exportPurchases(businessId: string): Promise<Buffer> {
    this.validateBusinessId(businessId);

    const purchases =
      await PurchaseRepository.findAllForBusinessExport(businessId);

    const headers = [
      "businessId",
      "purchaseNo",
      "invoiceNo",
      "purchaseDate",
      "dueDate",

      "supplierId",
      "supplierCode",
      "supplierName",
      "supplierMobile",

      "subtotal",
      "taxAmount",
      "discount",
      "transportCharge",
      "grandTotal",

      "paidAmount",
      "dueAmount",

      "paymentMethod",
      "paymentStatus",

      "notes",

      "items",
    ];

    const rows: unknown[][] = purchases.map((purchase) => {
      const supplier =
        purchase.supplier && typeof purchase.supplier === "object"
          ? purchase.supplier
          : null;

      return [
        String(purchase.businessId ?? businessId),

        String(purchase.purchaseNo ?? ""),

        String(purchase.invoiceNo ?? ""),

        formatDate(purchase.purchaseDate),

        formatDate(purchase.dueDate),

        supplier && "_id" in supplier ? String(supplier._id) : "",

        supplier && "supplierCode" in supplier
          ? String(supplier.supplierCode ?? "")
          : "",

        supplier && "name" in supplier ? String(supplier.name ?? "") : "",

        supplier && "mobile" in supplier ? String(supplier.mobile ?? "") : "",

        Number(purchase.subtotal ?? 0),

        Number(purchase.taxAmount ?? 0),

        Number(purchase.discount ?? 0),

        Number(purchase.transportCharge ?? 0),

        Number(purchase.grandTotal ?? 0),

        Number(purchase.paidAmount ?? 0),

        Number(purchase.dueAmount ?? 0),

        String(purchase.paymentMethod ?? ""),

        String(purchase.paymentStatus ?? ""),

        String(purchase.notes ?? ""),

        JSON.stringify(purchase.items ?? []),
      ];
    });

    const worksheet = xlsxUtils.aoa_to_sheet([headers, ...rows]);

    const workbook = xlsxUtils.book_new();

    xlsxUtils.book_append_sheet(workbook, worksheet, "Purchases");

    return XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    }) as Buffer;
  }

  /* ------------------------------------------------------------------------ */
  /* IMPORT PURCHASES                                                         */
  /* ------------------------------------------------------------------------ */

  async importPurchases(
    businessId: string,
    file: Express.Multer.File,
  ): Promise<ImportResult> {
    this.validateBusinessId(businessId);

    const rows = this.readExcelRows(file);

    const result: ImportResult = {
      entity: "PURCHASE",
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
        const purchaseNo = this.getString(row.purchaseNo);

        const invoiceNo = this.getString(row.invoiceNo);

        /* -------------------------------------------------------------- */
        /* REQUIRED                                                        */
        /* -------------------------------------------------------------- */

        if (!purchaseNo) {
          this.addError(result, excelRow, "purchaseNo is required.");

          continue;
        }

        if (!invoiceNo) {
          this.addError(result, excelRow, "invoiceNo is required.");

          continue;
        }

        /* -------------------------------------------------------------- */
        /* DUPLICATE PURCHASE                                              */
        /* -------------------------------------------------------------- */

        const existingPurchase =
          await PurchaseRepository.findByPurchaseNoForBusiness(
            purchaseNo,
            businessId,
          );

        if (existingPurchase) {
          result.skipped += 1;
          continue;
        }

        /* -------------------------------------------------------------- */
        /* DUPLICATE INVOICE                                               */
        /* -------------------------------------------------------------- */

        const existingInvoice =
          await PurchaseRepository.findByInvoiceNoForBusiness(
            invoiceNo,
            businessId,
          );

        if (existingInvoice) {
          result.skipped += 1;
          continue;
        }

        /* -------------------------------------------------------------- */
        /* SUPPLIER                                                         */
        /* -------------------------------------------------------------- */

        const supplierId = parseObjectId(row.supplierId);

        if (!supplierId) {
          this.addError(result, excelRow, "Valid supplierId is required.");

          continue;
        }

        /* -------------------------------------------------------------- */
        /* ITEMS                                                            */
        /* -------------------------------------------------------------- */

        const items = parseItems(row.items);

        if (!items.length) {
          this.addError(
            result,
            excelRow,
            "Purchase must contain at least one item.",
          );

          continue;
        }

        /* -------------------------------------------------------------- */
        /* PAYMENT                                                          */
        /* -------------------------------------------------------------- */

        const paymentMethod = parsePaymentMethod(row.paymentMethod);

        const paymentStatus = parsePaymentStatus(row.paymentStatus);

        /* -------------------------------------------------------------- */
        /* PURCHASE                                                         */
        /* -------------------------------------------------------------- */

        const purchaseData: Partial<IPurchase> = {
          businessId: new Types.ObjectId(businessId),

          purchaseNo,

          invoiceNo,

          purchaseDate: parseDate(row.purchaseDate),

          dueDate: parseOptionalDate(row.dueDate),

          supplier: supplierId,

          items,

          subtotal: toNumber(row.subtotal),

          taxAmount: toNumber(row.taxAmount),

          discount: toNumber(row.discount),

          transportCharge: toNumber(row.transportCharge),

          grandTotal: toNumber(row.grandTotal),

          paidAmount: toNumber(row.paidAmount),

          dueAmount: toNumber(row.dueAmount),

          paymentMethod,

          paymentStatus,

          notes: this.getString(row.notes),

          isActive: true,
        };

        await PurchaseRepository.create(purchaseData);

        result.imported += 1;
      } catch (error) {
        this.addError(
          result,
          excelRow,
          error instanceof Error
            ? error.message
            : "Unknown purchase import error.",
        );
      }
    }

    return result;
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATION                                                               */
  /* ------------------------------------------------------------------------ */

  private validateBusinessId(businessId: string): void {
    if (!businessId) {
      throw new Error("Business ID is required.");
    }

    if (!Types.ObjectId.isValid(businessId)) {
      throw new Error("Invalid business ID.");
    }
  }

  /* ------------------------------------------------------------------------ */
  /* EXCEL READER                                                             */
  /* ------------------------------------------------------------------------ */

  private readExcelRows(file: Express.Multer.File): Record<string, unknown>[] {
    if (!file?.buffer) {
      throw new Error("Excel file is required.");
    }

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

  /* ------------------------------------------------------------------------ */
  /* STRING                                                                    */
  /* ------------------------------------------------------------------------ */

  private getString(value: unknown): string {
    return String(value ?? "").trim();
  }

  /* ------------------------------------------------------------------------ */
  /* ERROR                                                                     */
  /* ------------------------------------------------------------------------ */

  private addError(result: ImportResult, row: number, message: string): void {
    result.failed += 1;

    result.errors.push({
      row,
      message,
    });
  }
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* DATE                                                                       */
/* -------------------------------------------------------------------------- */

function parseDate(value: unknown): Date {
  if (value instanceof Date) {
    if (!Number.isNaN(value.getTime())) {
      return value;
    }
  }

  const date = new Date(String(value ?? ""));

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid purchase date.");
  }

  return date;
}

function parseOptionalDate(value: unknown): Date | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return parseDate(value);
}

function formatDate(value: unknown): string {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const date = value instanceof Date ? value : new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toISOString();
}

/* -------------------------------------------------------------------------- */
/* OBJECT ID                                                                  */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* PAYMENT METHOD                                                             */
/* -------------------------------------------------------------------------- */

function parsePaymentMethod(value: unknown): PurchasePaymentMethod {
  const method = String(value ?? "")
    .trim()
    .toUpperCase();

  const allowed: PurchasePaymentMethod[] = [
    "CASH",
    "BANK",
    "UPI",
    "CARD",
    "CHEQUE",
    "CREDIT",
  ];

  if (!allowed.includes(method as PurchasePaymentMethod)) {
    throw new Error(`Invalid payment method: ${method}`);
  }

  return method as PurchasePaymentMethod;
}

/* -------------------------------------------------------------------------- */
/* PAYMENT STATUS                                                             */
/* -------------------------------------------------------------------------- */

function parsePaymentStatus(value: unknown): PurchaseStatus {
  const status = String(value ?? "")
    .trim()
    .toUpperCase();

  const allowed: PurchaseStatus[] = ["PAID", "PARTIAL", "DUE"];

  if (!allowed.includes(status as PurchaseStatus)) {
    throw new Error(`Invalid payment status: ${status}`);
  }

  return status as PurchaseStatus;
}

/* -------------------------------------------------------------------------- */
/* ITEMS                                                                      */
/* -------------------------------------------------------------------------- */

function parseItems(value: unknown): IPurchaseItem[] {
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

  return parsed as IPurchaseItem[];
}

export default new PurchaseImportExportService();
