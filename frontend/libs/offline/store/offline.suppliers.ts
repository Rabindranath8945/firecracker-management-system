import { getDatabase } from "../api/database";

import type { Supplier } from "@/features/suppliers/types/supplier.type";

/* -------------------------------------------------------------------------- */
/* OFFLINE SUPPLIER INPUT                                                     */
/* -------------------------------------------------------------------------- */

export interface OfflineSupplierInput {
  id?: string;

  supplierCode: string;

  name: string;

  mobile: string;

  email?: string;

  address?: string;

  city?: string;

  state?: string;

  pinCode?: string;

  gstNo?: string;

  openingBalance: number;

  totalPurchases: number;

  totalPaid: number;

  totalDue: number;

  currentDue: number;

  isActive: boolean;
}

/* -------------------------------------------------------------------------- */
/* ID                                                                         */
/* -------------------------------------------------------------------------- */

function generateSupplierId(): string {
  return `offline-supplier-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

/* -------------------------------------------------------------------------- */
/* NORMALIZE                                                                  */
/* -------------------------------------------------------------------------- */

function normalizeSupplier(row: Record<string, unknown>): Supplier {
  return {
    _id: String(row.id),

    supplierCode: String(row.supplier_code ?? ""),

    name: String(row.name ?? ""),

    mobile: String(row.mobile ?? ""),

    ...(row.email
      ? {
          email: String(row.email),
        }
      : {}),

    ...(row.address
      ? {
          address: String(row.address),
        }
      : {}),

    ...(row.city
      ? {
          city: String(row.city),
        }
      : {}),

    ...(row.state
      ? {
          state: String(row.state),
        }
      : {}),

    ...(row.pin_code
      ? {
          pinCode: String(row.pin_code),
        }
      : {}),

    ...(row.gst_no
      ? {
          gstNo: String(row.gst_no),
        }
      : {}),

    openingBalance: Number(row.opening_balance ?? 0),

    totalPurchases: Number(row.total_purchases ?? 0),

    totalPaid: Number(row.total_paid ?? 0),

    totalDue: Number(row.total_due ?? 0),

    currentDue: Number(row.current_due ?? 0),

    isActive: Number(row.is_active ?? 1) === 1,

    createdAt: String(row.created_at ?? ""),

    updatedAt: String(row.updated_at ?? ""),
  } as Supplier;
}

/* -------------------------------------------------------------------------- */
/* SAVE SUPPLIERS                                                             */
/* -------------------------------------------------------------------------- */

export async function saveSuppliers(suppliers: Supplier[]): Promise<void> {
  const db = await getDatabase();

  for (const supplier of suppliers) {
    await db.run(
      `
        INSERT OR REPLACE INTO suppliers (
          id,
          supplier_code,
          name,
          mobile,
          email,
          address,
          city,
          state,
          pin_code,
          gst_no,
          opening_balance,
          total_purchases,
          total_paid,
          total_due,
          current_due,
          is_active,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        supplier._id,

        supplier.supplierCode,

        supplier.name,

        supplier.mobile,

        supplier.email ?? null,

        supplier.address ?? null,

        supplier.city ?? null,

        supplier.state ?? null,

        supplier.pinCode ?? null,

        supplier.gstNo ?? null,

        supplier.openingBalance,

        supplier.totalPurchases,

        supplier.totalPaid,

        supplier.totalDue,

        supplier.currentDue,

        supplier.isActive ? 1 : 0,

        supplier.createdAt,

        supplier.updatedAt,
      ],
    );
  }
}

/* -------------------------------------------------------------------------- */
/* SAVE ONE SUPPLIER                                                           */
/* -------------------------------------------------------------------------- */

export async function saveSupplier(supplier: Supplier): Promise<void> {
  await saveSuppliers([supplier]);
}

/* -------------------------------------------------------------------------- */
/* GET SUPPLIERS                                                              */
/* -------------------------------------------------------------------------- */

export async function getOfflineSuppliers(): Promise<Supplier[]> {
  const db = await getDatabase();

  const result = await db.query(`
    SELECT *
    FROM suppliers
    ORDER BY name COLLATE NOCASE ASC
  `);

  return (result.values ?? []).map(normalizeSupplier);
}

/* -------------------------------------------------------------------------- */
/* GET SUPPLIER BY ID                                                         */
/* -------------------------------------------------------------------------- */

export async function getOfflineSupplier(id: string): Promise<Supplier | null> {
  if (!id) {
    return null;
  }

  const db = await getDatabase();

  const result = await db.query(
    `
      SELECT *
      FROM suppliers
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  const row = result.values?.[0];

  if (!row) {
    return null;
  }

  return normalizeSupplier(row);
}

/* -------------------------------------------------------------------------- */
/* DELETE SUPPLIER                                                            */
/* -------------------------------------------------------------------------- */

export async function deleteSupplier(id: string): Promise<void> {
  if (!id) {
    return;
  }

  const db = await getDatabase();

  await db.run(
    `
      DELETE FROM suppliers
      WHERE id = ?
    `,
    [id],
  );
}

/* -------------------------------------------------------------------------- */
/* UPDATE SUPPLIER BALANCE                                                    */
/* -------------------------------------------------------------------------- */

export async function updateSupplierBalance(
  supplierId: string,
  values: {
    totalPurchases?: number;
    totalPaid?: number;
    totalDue?: number;
    currentDue?: number;
  },
): Promise<void> {
  const db = await getDatabase();

  const supplier = await getOfflineSupplier(supplierId);

  if (!supplier) {
    throw new Error(`Supplier not found offline: ${supplierId}`);
  }

  const now = new Date().toISOString();

  await db.run(
    `
      UPDATE suppliers
      SET
        total_purchases = ?,
        total_paid = ?,
        total_due = ?,
        current_due = ?,
        updated_at = ?
      WHERE id = ?
    `,
    [
      values.totalPurchases ?? supplier.totalPurchases,

      values.totalPaid ?? supplier.totalPaid,

      values.totalDue ?? supplier.totalDue,

      values.currentDue ?? supplier.currentDue,

      now,

      supplierId,
    ],
  );
}

/* -------------------------------------------------------------------------- */
/* GENERATE TEMPORARY SUPPLIER ID                                             */
/* -------------------------------------------------------------------------- */

export function createOfflineSupplierId(): string {
  return generateSupplierId();
}
