import { getDatabase } from "../api/database";

import { getOfflineSupplier, updateSupplierBalance } from "./offline.suppliers";

import type {
  PaymentMethod,
  PaymentStatus,
} from "@/features/purchases/types/purchase.types";
import { notifyOfflineDataChanged } from "../events/offline.events";

/* -------------------------------------------------------------------------- */
/* OFFLINE TYPES                                                              */
/* -------------------------------------------------------------------------- */

export interface OfflinePurchaseItemInput {
  productId: string;

  quantity: number;

  purchasePrice: number;

  sellingPrice: number;

  discount: number;

  gstRate: number;

  subtotal: number;

  gstAmount: number;

  total: number;
}

export interface CreateOfflinePurchaseInput {
  id?: string;

  purchaseNo: string;

  invoiceNo?: string;

  supplierId: string;

  purchaseDate: string;

  dueDate?: string;

  paymentMethod: PaymentMethod;

  transportCharge: number;

  paidAmount: number;

  dueAmount: number;

  subtotal: number;

  discount: number;

  gstTotal: number;

  grandTotal: number;

  paymentStatus: PaymentStatus;

  notes?: string;

  items: OfflinePurchaseItemInput[];
}

export interface OfflinePurchase {
  id: string;

  purchaseNo: string;

  invoiceNo?: string;

  supplierId: string;

  purchaseDate: string;

  dueDate?: string;

  paymentStatus: PaymentStatus;

  paymentMethod: PaymentMethod;

  subtotal: number;

  discount: number;

  gstTotal: number;

  transportCharge: number;

  grandTotal: number;

  paidAmount: number;

  dueAmount: number;

  notes?: string;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;

  items: OfflinePurchaseItemInput[];
}

export interface ReconcileOfflinePurchaseInput {
  _id: string;

  purchaseNo: string;

  invoiceNo?: string;

  purchaseDate?: string;
}

/* -------------------------------------------------------------------------- */
/* ID                                                                         */
/* -------------------------------------------------------------------------- */

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/* -------------------------------------------------------------------------- */
/* GET ITEMS                                                                  */
/* -------------------------------------------------------------------------- */

async function getPurchaseItems(
  purchaseId: string,
): Promise<OfflinePurchaseItemInput[]> {
  const db = await getDatabase();

  const result = await db.query(
    `
      SELECT
        product_id,
        quantity,
        purchase_price,
        selling_price,
        discount,
        gst_rate,
        subtotal,
        gst_amount,
        total
      FROM purchase_items
      WHERE purchase_id = ?
      ORDER BY rowid ASC
    `,
    [purchaseId],
  );

  return (result.values ?? []).map((row) => ({
    productId: String(row.product_id),

    quantity: Number(row.quantity ?? 0),

    purchasePrice: Number(row.purchase_price ?? 0),

    sellingPrice: Number(row.selling_price ?? 0),

    discount: Number(row.discount ?? 0),

    gstRate: Number(row.gst_rate ?? 0),

    subtotal: Number(row.subtotal ?? 0),

    gstAmount: Number(row.gst_amount ?? 0),

    total: Number(row.total ?? 0),
  }));
}

/* -------------------------------------------------------------------------- */
/* NORMALIZE PURCHASE                                                         */
/* -------------------------------------------------------------------------- */

async function normalizePurchase(
  row: Record<string, unknown>,
): Promise<OfflinePurchase> {
  const purchase: OfflinePurchase = {
    id: String(row.id),

    purchaseNo: String(row.purchase_no ?? ""),

    supplierId: String(row.supplier_id ?? ""),

    purchaseDate: String(row.purchase_date ?? ""),

    paymentStatus: row.payment_status as PaymentStatus,

    paymentMethod: row.payment_method as PaymentMethod,

    subtotal: Number(row.subtotal ?? 0),

    discount: Number(row.discount ?? 0),

    gstTotal: Number(row.gst_total ?? 0),

    transportCharge: Number(row.transport_charge ?? 0),

    grandTotal: Number(row.grand_total ?? 0),

    paidAmount: Number(row.paid_amount ?? 0),

    dueAmount: Number(row.due_amount ?? 0),

    isActive: Number(row.is_active ?? 1) === 1,

    createdAt: String(row.created_at ?? ""),

    updatedAt: String(row.updated_at ?? ""),

    items: [],
  };

  if (row.invoice_no) {
    purchase.invoiceNo = String(row.invoice_no);
  }

  if (row.due_date) {
    purchase.dueDate = String(row.due_date);
  }

  if (row.notes) {
    purchase.notes = String(row.notes);
  }

  purchase.items = await getPurchaseItems(purchase.id);

  return purchase;
}

/* -------------------------------------------------------------------------- */
/* VALIDATE INPUT                                                             */
/* -------------------------------------------------------------------------- */

async function validatePurchaseInput(
  supplierId: string,
  items: OfflinePurchaseItemInput[],
  paidAmount: number,
  grandTotal: number,
): Promise<void> {
  if (!supplierId) {
    throw new Error("Supplier is required.");
  }

  const supplier = await getOfflineSupplier(supplierId);

  if (!supplier) {
    throw new Error(`Supplier not available offline: ${supplierId}`);
  }

  if (items.length === 0) {
    throw new Error("Purchase must contain at least one item.");
  }

  if (grandTotal < 0) {
    throw new Error("Purchase total cannot be negative.");
  }

  if (paidAmount < 0) {
    throw new Error("Paid amount cannot be negative.");
  }

  if (paidAmount > grandTotal) {
    throw new Error("Paid amount cannot be greater than grand total.");
  }

  const db = await getDatabase();

  for (const item of items) {
    if (item.quantity <= 0) {
      throw new Error("Purchase quantity must be greater than zero.");
    }

    const result = await db.query(
      `
          SELECT id
          FROM products
          WHERE id = ?
          LIMIT 1
        `,
      [item.productId],
    );

    if (!result.values?.length) {
      throw new Error(`Product not available offline: ${item.productId}`);
    }
  }
}

/* -------------------------------------------------------------------------- */
/* APPLY SUPPLIER BALANCE                                                     */
/* -------------------------------------------------------------------------- */

async function applySupplierBalance(
  supplierId: string,
  grandTotal: number,
  paidAmount: number,
  dueAmount: number,
): Promise<void> {
  const supplier = await getOfflineSupplier(supplierId);

  if (!supplier) {
    throw new Error(`Supplier not found offline: ${supplierId}`);
  }

  await updateSupplierBalance(supplierId, {
    totalPurchases: supplier.totalPurchases + grandTotal,

    totalPaid: supplier.totalPaid + paidAmount,

    totalDue: supplier.totalDue + dueAmount,

    currentDue: supplier.currentDue + dueAmount,
  });
}

/* -------------------------------------------------------------------------- */
/* REVERSE SUPPLIER BALANCE                                                   */
/* -------------------------------------------------------------------------- */

async function reverseSupplierBalance(
  supplierId: string,
  grandTotal: number,
  paidAmount: number,
  dueAmount: number,
): Promise<void> {
  const supplier = await getOfflineSupplier(supplierId);

  if (!supplier) {
    throw new Error(`Supplier not found offline: ${supplierId}`);
  }

  await updateSupplierBalance(supplierId, {
    totalPurchases: Math.max(0, supplier.totalPurchases - grandTotal),

    totalPaid: Math.max(0, supplier.totalPaid - paidAmount),

    totalDue: Math.max(0, supplier.totalDue - dueAmount),

    currentDue: Math.max(0, supplier.currentDue - dueAmount),
  });
}

/* -------------------------------------------------------------------------- */
/* CREATE                                                                     */
/* -------------------------------------------------------------------------- */

export async function createOfflinePurchase(
  input: CreateOfflinePurchaseInput,
): Promise<OfflinePurchase> {
  const db = await getDatabase();

  await validatePurchaseInput(
    input.supplierId,
    input.items,
    input.paidAmount,
    input.grandTotal,
  );

  const id = input.id ?? generateId("offline-purchase");

  const now = new Date().toISOString();

  await db.execute("BEGIN TRANSACTION");

  try {
    /* ---------------------------------------------------------------------- */
    /* PURCHASE                                                                */
    /* ---------------------------------------------------------------------- */

    await db.run(
      `
        INSERT INTO purchases (
          id,
          purchase_no,
          invoice_no,
          supplier_id,
          purchase_date,
          due_date,
          payment_status,
          payment_method,
          subtotal,
          discount,
          gst_total,
          transport_charge,
          grand_total,
          paid_amount,
          due_amount,
          notes,
          is_active,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `,
      [
        id,
        input.purchaseNo,
        input.invoiceNo ?? null,
        input.supplierId,
        input.purchaseDate,
        input.dueDate ?? null,
        input.paymentStatus,
        input.paymentMethod,
        input.subtotal,
        input.discount,
        input.gstTotal,
        input.transportCharge,
        input.grandTotal,
        input.paidAmount,
        input.dueAmount,
        input.notes ?? null,
        now,
        now,
      ],
    );

    /* ---------------------------------------------------------------------- */
    /* ITEMS + STOCK INCREASE                                                  */
    /* ---------------------------------------------------------------------- */

    for (const item of input.items) {
      await db.run(
        `
          INSERT INTO purchase_items (
            id,
            purchase_id,
            product_id,
            quantity,
            purchase_price,
            selling_price,
            discount,
            gst_rate,
            subtotal,
            gst_amount,
            total,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          generateId("offline-purchase-item"),
          id,
          item.productId,
          item.quantity,
          item.purchasePrice,
          item.sellingPrice,
          item.discount,
          item.gstRate,
          item.subtotal,
          item.gstAmount,
          item.total,
          now,
        ],
      );

      await db.run(
        `
          UPDATE products
          SET
            stock = stock + ?,
            purchase_price = ?,
            selling_price = ?,
            updated_at = ?
          WHERE id = ?
        `,
        [
          item.quantity,
          item.purchasePrice,
          item.sellingPrice,
          now,
          item.productId,
        ],
      );
    }

    /* ---------------------------------------------------------------------- */
    /* PAYMENT                                                                 */
    /* ---------------------------------------------------------------------- */

    if (input.paidAmount > 0) {
      await db.run(
        `
          INSERT INTO purchase_payments (
            id,
            purchase_id,
            payment_method,
            amount,
            created_at
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          generateId("offline-purchase-payment"),
          id,
          input.paymentMethod,
          input.paidAmount,
          now,
        ],
      );
    }

    /* ---------------------------------------------------------------------- */
    /* SUPPLIER BALANCE                                                        */
    /* ---------------------------------------------------------------------- */

    await applySupplierBalance(
      input.supplierId,
      input.grandTotal,
      input.paidAmount,
      input.dueAmount,
    );

    await db.execute("COMMIT");
    notifyOfflineDataChanged();

    return {
      id,

      purchaseNo: input.purchaseNo,

      ...(input.invoiceNo
        ? {
            invoiceNo: input.invoiceNo,
          }
        : {}),

      supplierId: input.supplierId,

      purchaseDate: input.purchaseDate,

      ...(input.dueDate
        ? {
            dueDate: input.dueDate,
          }
        : {}),

      paymentStatus: input.paymentStatus,

      paymentMethod: input.paymentMethod,

      subtotal: input.subtotal,

      discount: input.discount,

      gstTotal: input.gstTotal,

      transportCharge: input.transportCharge,

      grandTotal: input.grandTotal,

      paidAmount: input.paidAmount,

      dueAmount: input.dueAmount,

      ...(input.notes
        ? {
            notes: input.notes,
          }
        : {}),

      isActive: true,

      createdAt: now,

      updatedAt: now,

      items: input.items,
    };
  } catch (error) {
    try {
      await db.execute("ROLLBACK");
    } catch (rollbackError) {
      console.error("Failed to rollback offline purchase:", rollbackError);
    }

    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* GET ALL                                                                    */
/* -------------------------------------------------------------------------- */

export async function getOfflinePurchases(): Promise<OfflinePurchase[]> {
  const db = await getDatabase();

  const result = await db.query(`
      SELECT *
      FROM purchases
      WHERE is_active = 1
      ORDER BY purchase_date DESC, rowid DESC
    `);

  const purchases: OfflinePurchase[] = [];

  for (const row of result.values ?? []) {
    purchases.push(await normalizePurchase(row));
  }

  return purchases;
}

/* -------------------------------------------------------------------------- */
/* GET BY ID                                                                  */
/* -------------------------------------------------------------------------- */

export async function getOfflinePurchase(
  id: string,
): Promise<OfflinePurchase | null> {
  if (!id) {
    return null;
  }

  const db = await getDatabase();

  const result = await db.query(
    `
        SELECT *
        FROM purchases
        WHERE id = ?
        LIMIT 1
      `,
    [id],
  );

  const row = result.values?.[0];

  if (!row) {
    return null;
  }

  return normalizePurchase(row);
}

/* -------------------------------------------------------------------------- */
/* UPDATE                                                                     */
/* -------------------------------------------------------------------------- */

export async function updateOfflinePurchase(
  id: string,
  input: CreateOfflinePurchaseInput,
): Promise<OfflinePurchase> {
  const db = await getDatabase();

  const existing = await getOfflinePurchase(id);

  if (!existing) {
    throw new Error(`Offline purchase not found: ${id}`);
  }

  await validatePurchaseInput(
    input.supplierId,
    input.items,
    input.paidAmount,
    input.grandTotal,
  );

  const now = new Date().toISOString();

  await db.execute("BEGIN TRANSACTION");

  try {
    /* ---------------------------------------------------------------------- */
    /* REVERSE OLD STOCK                                                       */
    /* ---------------------------------------------------------------------- */

    for (const item of existing.items) {
      await db.run(
        `
          UPDATE products
          SET
            stock = stock - ?,
            updated_at = ?
          WHERE id = ?
        `,
        [item.quantity, now, item.productId],
      );
    }

    /* ---------------------------------------------------------------------- */
    /* REVERSE OLD SUPPLIER BALANCE                                            */
    /* ---------------------------------------------------------------------- */

    await reverseSupplierBalance(
      existing.supplierId,
      existing.grandTotal,
      existing.paidAmount,
      existing.dueAmount,
    );

    /* ---------------------------------------------------------------------- */
    /* DELETE OLD ITEMS                                                       */
    /* ---------------------------------------------------------------------- */

    await db.run(
      `
        DELETE FROM purchase_items
        WHERE purchase_id = ?
      `,
      [id],
    );

    await db.run(
      `
        DELETE FROM purchase_payments
        WHERE purchase_id = ?
      `,
      [id],
    );

    /* ---------------------------------------------------------------------- */
    /* UPDATE PURCHASE                                                         */
    /* ---------------------------------------------------------------------- */

    await db.run(
      `
        UPDATE purchases
        SET
          purchase_no = ?,
          invoice_no = ?,
          supplier_id = ?,
          purchase_date = ?,
          due_date = ?,
          payment_status = ?,
          payment_method = ?,
          subtotal = ?,
          discount = ?,
          gst_total = ?,
          transport_charge = ?,
          grand_total = ?,
          paid_amount = ?,
          due_amount = ?,
          notes = ?,
          updated_at = ?
        WHERE id = ?
      `,
      [
        input.purchaseNo,
        input.invoiceNo ?? null,
        input.supplierId,
        input.purchaseDate,
        input.dueDate ?? null,
        input.paymentStatus,
        input.paymentMethod,
        input.subtotal,
        input.discount,
        input.gstTotal,
        input.transportCharge,
        input.grandTotal,
        input.paidAmount,
        input.dueAmount,
        input.notes ?? null,
        now,
        id,
      ],
    );

    /* ---------------------------------------------------------------------- */
    /* INSERT NEW ITEMS + STOCK                                               */
    /* ---------------------------------------------------------------------- */

    for (const item of input.items) {
      await db.run(
        `
          INSERT INTO purchase_items (
            id,
            purchase_id,
            product_id,
            quantity,
            purchase_price,
            selling_price,
            discount,
            gst_rate,
            subtotal,
            gst_amount,
            total,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          generateId("offline-purchase-item"),
          id,
          item.productId,
          item.quantity,
          item.purchasePrice,
          item.sellingPrice,
          item.discount,
          item.gstRate,
          item.subtotal,
          item.gstAmount,
          item.total,
          now,
        ],
      );

      await db.run(
        `
          UPDATE products
          SET
            stock = stock + ?,
            purchase_price = ?,
            selling_price = ?,
            updated_at = ?
          WHERE id = ?
        `,
        [
          item.quantity,
          item.purchasePrice,
          item.sellingPrice,
          now,
          item.productId,
        ],
      );
    }

    /* ---------------------------------------------------------------------- */
    /* INSERT NEW PAYMENT                                                     */
    /* ---------------------------------------------------------------------- */

    if (input.paidAmount > 0) {
      await db.run(
        `
          INSERT INTO purchase_payments (
            id,
            purchase_id,
            payment_method,
            amount,
            created_at
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          generateId("offline-purchase-payment"),
          id,
          input.paymentMethod,
          input.paidAmount,
          now,
        ],
      );
    }

    /* ---------------------------------------------------------------------- */
    /* APPLY NEW SUPPLIER BALANCE                                             */
    /* ---------------------------------------------------------------------- */

    await applySupplierBalance(
      input.supplierId,
      input.grandTotal,
      input.paidAmount,
      input.dueAmount,
    );

    await db.execute("COMMIT");
    notifyOfflineDataChanged();

    return {
      id,

      purchaseNo: input.purchaseNo,

      ...(input.invoiceNo
        ? {
            invoiceNo: input.invoiceNo,
          }
        : {}),

      supplierId: input.supplierId,

      purchaseDate: input.purchaseDate,

      ...(input.dueDate
        ? {
            dueDate: input.dueDate,
          }
        : {}),

      paymentStatus: input.paymentStatus,

      paymentMethod: input.paymentMethod,

      subtotal: input.subtotal,

      discount: input.discount,

      gstTotal: input.gstTotal,

      transportCharge: input.transportCharge,

      grandTotal: input.grandTotal,

      paidAmount: input.paidAmount,

      dueAmount: input.dueAmount,

      ...(input.notes
        ? {
            notes: input.notes,
          }
        : {}),

      isActive: true,

      createdAt: existing.createdAt,

      updatedAt: now,

      items: input.items,
    };
  } catch (error) {
    try {
      await db.execute("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Failed to rollback offline purchase update:",
        rollbackError,
      );
    }

    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* DELETE                                                                     */
/* -------------------------------------------------------------------------- */

export async function deleteOfflinePurchase(id: string): Promise<void> {
  const db = await getDatabase();

  const existing = await getOfflinePurchase(id);

  if (!existing) {
    return;
  }

  const now = new Date().toISOString();

  await db.execute("BEGIN TRANSACTION");

  try {
    /* ---------------------------------------------------------------------- */
    /* RESTORE STOCK                                                          */
    /* ---------------------------------------------------------------------- */

    for (const item of existing.items) {
      await db.run(
        `
          UPDATE products
          SET
            stock = stock - ?,
            updated_at = ?
          WHERE id = ?
        `,
        [item.quantity, now, item.productId],
      );
    }

    /* ---------------------------------------------------------------------- */
    /* REVERSE SUPPLIER BALANCE                                               */
    /* ---------------------------------------------------------------------- */

    await reverseSupplierBalance(
      existing.supplierId,
      existing.grandTotal,
      existing.paidAmount,
      existing.dueAmount,
    );

    /* ---------------------------------------------------------------------- */
    /* DELETE CHILD RECORDS                                                   */
    /* ---------------------------------------------------------------------- */

    await db.run(
      `
        DELETE FROM purchase_items
        WHERE purchase_id = ?
      `,
      [id],
    );

    await db.run(
      `
        DELETE FROM purchase_payments
        WHERE purchase_id = ?
      `,
      [id],
    );

    /* ---------------------------------------------------------------------- */
    /* DELETE PURCHASE                                                        */
    /* ---------------------------------------------------------------------- */

    await db.run(
      `
        DELETE FROM purchases
        WHERE id = ?
      `,
      [id],
    );

    await db.execute("COMMIT");
    notifyOfflineDataChanged();
  } catch (error) {
    try {
      await db.execute("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Failed to rollback offline purchase delete:",
        rollbackError,
      );
    }

    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* RECONCILE SERVER PURCHASE                                                  */
/* -------------------------------------------------------------------------- */

export async function reconcileOfflinePurchase(
  temporaryId: string,
  serverPurchase: ReconcileOfflinePurchaseInput,
): Promise<void> {
  if (!temporaryId) {
    throw new Error("Temporary purchase ID is required for reconciliation.");
  }

  if (!serverPurchase._id) {
    throw new Error("Server purchase ID is required for reconciliation.");
  }

  const db = await getDatabase();

  const existing = await getOfflinePurchase(temporaryId);

  if (!existing) {
    throw new Error(
      `Offline purchase not found for reconciliation: ${temporaryId}`,
    );
  }

  /*
   * If the server returned the same ID,
   * there is nothing to replace.
   */
  if (temporaryId === serverPurchase._id) {
    await db.run(
      `
        UPDATE purchases
        SET
          purchase_no = ?,
          invoice_no = ?,
          purchase_date = ?,
          updated_at = ?
        WHERE id = ?
      `,
      [
        serverPurchase.purchaseNo,

        serverPurchase.invoiceNo ?? existing.invoiceNo ?? null,

        serverPurchase.purchaseDate ?? existing.purchaseDate,

        new Date().toISOString(),

        temporaryId,
      ],
    );

    return;
  }

  const now = new Date().toISOString();

  await db.execute("BEGIN TRANSACTION");

  try {
    /*
     * Create the server-ID purchase
     * while preserving the local
     * calculated/accounting data.
     */
    await db.run(
      `
        INSERT INTO purchases (
          id,
          purchase_no,
          invoice_no,
          supplier_id,
          purchase_date,
          due_date,
          payment_status,
          payment_method,
          subtotal,
          discount,
          gst_total,
          transport_charge,
          grand_total,
          paid_amount,
          due_amount,
          notes,
          is_active,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        serverPurchase._id,

        serverPurchase.purchaseNo,

        serverPurchase.invoiceNo ?? existing.invoiceNo ?? null,

        existing.supplierId,

        serverPurchase.purchaseDate ?? existing.purchaseDate,

        existing.dueDate ?? null,

        existing.paymentStatus,

        existing.paymentMethod,

        existing.subtotal,

        existing.discount,

        existing.gstTotal,

        existing.transportCharge,

        existing.grandTotal,

        existing.paidAmount,

        existing.dueAmount,

        existing.notes ?? null,

        existing.isActive ? 1 : 0,

        existing.createdAt,

        now,
      ],
    );

    /*
     * Move purchase items from
     * temporary purchase → server purchase.
     */
    await db.run(
      `
        UPDATE purchase_items
        SET purchase_id = ?
        WHERE purchase_id = ?
      `,
      [serverPurchase._id, temporaryId],
    );

    /*
     * Move payments as well.
     */
    await db.run(
      `
        UPDATE purchase_payments
        SET purchase_id = ?
        WHERE purchase_id = ?
      `,
      [serverPurchase._id, temporaryId],
    );

    /*
     * Remove the temporary purchase.
     */
    await db.run(
      `
        DELETE FROM purchases
        WHERE id = ?
      `,
      [temporaryId],
    );

    await db.execute("COMMIT");
  } catch (error) {
    try {
      await db.execute("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Failed to rollback purchase reconciliation:",
        rollbackError,
      );
    }

    throw error;
  }
}
