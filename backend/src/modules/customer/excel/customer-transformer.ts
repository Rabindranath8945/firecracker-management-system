import { CustomerExcelRow } from "../../../common/excel/types/customer-excel-row.types.js";

export function transformCustomerRows(
  rows: Record<string, unknown>[],
): CustomerExcelRow[] {
  return rows.map((row) => ({
    customerCode: String(row.customerCode ?? "").trim(),

    name: String(row.name ?? "").trim(),

    mobile: String(row.mobile ?? "").trim(),

    alternateMobile: row.alternateMobile
      ? String(row.alternateMobile).trim()
      : undefined,

    email: row.email ? String(row.email).trim() : undefined,

    gstNo: row.gstNo ? String(row.gstNo).trim() : undefined,

    address: row.address ? String(row.address).trim() : undefined,

    city: row.city ? String(row.city).trim() : undefined,

    state: row.state ? String(row.state).trim() : undefined,

    pinCode: row.pinCode ? String(row.pinCode).trim() : undefined,

    openingBalance: Number(row.openingBalance ?? 0),

    notes: row.notes ? String(row.notes).trim() : undefined,

    isActive:
      String(row.status ?? row.isActive ?? "Active").toLowerCase() === "active",
  }));
}
