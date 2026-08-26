import { getDatabase } from "../api/database";

import type { Customer } from "@/features/customers/types/customer";
import { notifyOfflineDataChanged } from "../events/offline.events";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type OfflinePaymentMethod =
  | "CASH"
  | "UPI"
  | "CARD"
  | "BANK"
  | "CREDIT"
  | "MIXED";

export type OfflinePaymentStatus = "PAID" | "PARTIAL" | "DUE";

export interface OfflineSaleItem {
  id: string;
  saleId: string;

  productId: string;

  quantity: number;
  sellingPrice: number;

  discount: number;
  gstRate: number;
  taxAmount: number;

  subtotal: number;
  total: number;

  createdAt: string;
}

export interface OfflineSalePayment {
  id: string;
  saleId: string;

  paymentMethod: OfflinePaymentMethod;
  amount: number;

  createdAt: string;
}

export interface OfflineSale {
  id: string;
  saleNo: string;

  customerId?: string;

  saleDate: string;

  subtotal: number;
  discount: number;
  taxAmount: number;
  grandTotal: number;

  paidAmount: number;
  dueAmount: number;

  paymentMethod: OfflinePaymentMethod;
  paymentStatus: OfflinePaymentStatus;

  notes?: string;

  createdAt: string;
  updatedAt: string;

  items?: OfflineSaleItem[];
  payments?: OfflineSalePayment[];
}

/* -------------------------------------------------------------------------- */
/* CREATE INPUT                                                               */
/* -------------------------------------------------------------------------- */

export interface CreateOfflineSaleInput {
  id?: string;

  saleNo: string;

  customerId?: string;

  saleDate: string;

  items: Array<{
    productId: string;
    quantity: number;
    sellingPrice: number;

    discount: number;
    gstRate: number;

    taxAmount: number;
    subtotal: number;
    total: number;
  }>;

  subtotal: number;
  discount: number;
  taxAmount: number;
  grandTotal: number;

  paidAmount: number;
  dueAmount: number;

  paymentMethod: OfflinePaymentMethod;
  paymentStatus: OfflinePaymentStatus;

  payments?: Array<{
    paymentMethod: OfflinePaymentMethod;
    amount: number;
  }>;

  notes?: string;
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function toSqlBoolean(value: unknown): boolean {
  return Number(value ?? 0) === 1;
}

/* -------------------------------------------------------------------------- */
/* CREATE OFFLINE SALE                                                        */
/* -------------------------------------------------------------------------- */

export async function createOfflineSale(
  input: CreateOfflineSaleInput,
): Promise<OfflineSale> {
  const db = await getDatabase();

  const saleId = input.id ?? generateId("offline-sale");

  const now = new Date().toISOString();

  /*
   * Validate basic values before opening
   * the transaction.
   */

  if (input.items.length === 0) {
    throw new Error("A sale must contain at least one item.");
  }

  if (input.grandTotal < 0) {
    throw new Error("Sale total cannot be negative.");
  }

  if (input.paidAmount < 0) {
    throw new Error("Paid amount cannot be negative.");
  }

  if (input.paidAmount > input.grandTotal) {
    throw new Error("Paid amount cannot be greater than grand total.");
  }

  /*
   * Start transaction.
   */

  await db.execute("BEGIN TRANSACTION");

  try {
    /* -------------------------------------------------------------------- */
    /* VERIFY STOCK                                                         */
    /* -------------------------------------------------------------------- */

    for (const item of input.items) {
      const productResult = await db.query(
        `
          SELECT
            id,
            stock,
            name
          FROM products
          WHERE id = ?
          LIMIT 1
        `,
        [item.productId],
      );

      const product = productResult.values?.[0];

      if (!product) {
        throw new Error(`Product not found offline: ${item.productId}`);
      }

      const currentStock = Number(product.stock ?? 0);

      if (item.quantity <= 0) {
        throw new Error(`Invalid quantity for product ${item.productId}.`);
      }

      if (item.quantity > currentStock) {
        throw new Error(
          `Insufficient stock for ${String(
            product.name ?? item.productId,
          )}. Available: ${currentStock}.`,
        );
      }
    }

    /* -------------------------------------------------------------------- */
    /* INSERT SALE                                                          */
    /* -------------------------------------------------------------------- */

    await db.run(
      `
        INSERT INTO sales (
          id,
          sale_no,
          customer_id,
          sale_date,
          subtotal,
          discount,
          tax_amount,
          grand_total,
          paid_amount,
          due_amount,
          payment_method,
          payment_status,
          notes,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        saleId,
        input.saleNo,
        input.customerId ?? null,
        input.saleDate,
        input.subtotal,
        input.discount,
        input.taxAmount,
        input.grandTotal,
        input.paidAmount,
        input.dueAmount,
        input.paymentMethod,
        input.paymentStatus,
        input.notes ?? null,
        now,
        now,
      ],
    );

    /* -------------------------------------------------------------------- */
    /* INSERT ITEMS + REDUCE STOCK                                          */
    /* -------------------------------------------------------------------- */

    for (const item of input.items) {
      const itemId = generateId("offline-sale-item");

      await db.run(
        `
          INSERT INTO sale_items (
            id,
            sale_id,
            product_id,
            quantity,
            selling_price,
            discount,
            gst_rate,
            tax_amount,
            subtotal,
            total,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          itemId,
          saleId,
          item.productId,
          item.quantity,
          item.sellingPrice,
          item.discount,
          item.gstRate,
          item.taxAmount,
          item.subtotal,
          item.total,
          now,
        ],
      );

      /*
       * Reduce local stock immediately.
       */

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

    /* -------------------------------------------------------------------- */
    /* PAYMENTS                                                             */
    /* -------------------------------------------------------------------- */

    const payments = input.payments?.length
      ? input.payments
      : input.paidAmount > 0
        ? [
            {
              paymentMethod: input.paymentMethod,
              amount: input.paidAmount,
            },
          ]
        : [];

    for (const payment of payments) {
      if (payment.amount <= 0) {
        continue;
      }

      await db.run(
        `
          INSERT INTO sale_payments (
            id,
            sale_id,
            payment_method,
            amount,
            created_at
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          generateId("offline-payment"),
          saleId,
          payment.paymentMethod,
          payment.amount,
          now,
        ],
      );
    }

    /* -------------------------------------------------------------------- */
    /* CUSTOMER DUE                                                         */
    /* -------------------------------------------------------------------- */

    if (input.customerId && input.dueAmount > 0) {
      await updateCustomerDue(db, input.customerId, input.dueAmount, now);
    }

    /* -------------------------------------------------------------------- */
    /* COMMIT                                                               */
    /* -------------------------------------------------------------------- */

    await db.execute("COMMIT");
    notifyOfflineDataChanged();

    return {
      id: saleId,
      saleNo: input.saleNo,

      ...(input.customerId
        ? {
            customerId: input.customerId,
          }
        : {}),

      saleDate: input.saleDate,

      subtotal: input.subtotal,
      discount: input.discount,
      taxAmount: input.taxAmount,
      grandTotal: input.grandTotal,

      paidAmount: input.paidAmount,
      dueAmount: input.dueAmount,

      paymentMethod: input.paymentMethod,

      paymentStatus: input.paymentStatus,

      ...(input.notes
        ? {
            notes: input.notes,
          }
        : {}),

      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    /*
     * Everything is rolled back:
     *
     * sale
     * items
     * payments
     * stock
     * customer due
     */

    try {
      await db.execute("ROLLBACK");
    } catch (rollbackError) {
      console.error("Failed to rollback offline sale:", rollbackError);
    }

    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* CUSTOMER DUE                                                               */
/* -------------------------------------------------------------------------- */

async function updateCustomerDue(
  db: Awaited<ReturnType<typeof getDatabase>>,
  customerId: string,
  amount: number,
  now: string,
): Promise<void> {
  const result = await db.query(
    `
      SELECT
        opening_balance,
        notes
      FROM customers
      WHERE id = ?
      LIMIT 1
    `,
    [customerId],
  );

  const customer = result.values?.[0];

  if (!customer) {
    throw new Error(`Customer not found offline: ${customerId}`);
  }

  const currentBalance = Number(customer.opening_balance ?? 0);

  const newBalance = currentBalance + amount;

  await db.run(
    `
      UPDATE customers
      SET
        opening_balance = ?,
        updated_at = ?
      WHERE id = ?
    `,
    [newBalance, now, customerId],
  );
}

/* -------------------------------------------------------------------------- */
/* GET SALES                                                                  */
/* -------------------------------------------------------------------------- */

export async function getOfflineSales(): Promise<OfflineSale[]> {
  const db = await getDatabase();

  const result = await db.query(`
    SELECT
      id,
      sale_no,
      customer_id,
      sale_date,
      subtotal,
      discount,
      tax_amount,
      grand_total,
      paid_amount,
      due_amount,
      payment_method,
      payment_status,
      notes,
      created_at,
      updated_at
    FROM sales
    ORDER BY sale_date DESC, id DESC
  `);

  const sales: OfflineSale[] = [];

  for (const row of result.values ?? []) {
    const saleId = String(row.id);

    const items = await getOfflineSaleItems(saleId);

    const payments = await getOfflineSalePayments(saleId);

    sales.push({
      id: saleId,

      saleNo: String(row.sale_no),

      ...(row.customer_id
        ? {
            customerId: String(row.customer_id),
          }
        : {}),

      saleDate: String(row.sale_date),

      subtotal: Number(row.subtotal ?? 0),

      discount: Number(row.discount ?? 0),

      taxAmount: Number(row.tax_amount ?? 0),

      grandTotal: Number(row.grand_total ?? 0),

      paidAmount: Number(row.paid_amount ?? 0),

      dueAmount: Number(row.due_amount ?? 0),

      paymentMethod: row.payment_method as OfflinePaymentMethod,

      paymentStatus: row.payment_status as OfflinePaymentStatus,

      ...(row.notes
        ? {
            notes: String(row.notes),
          }
        : {}),

      createdAt: String(row.created_at),

      updatedAt: String(row.updated_at),

      items,

      payments,
    });
  }

  return sales;
}

/* -------------------------------------------------------------------------- */
/* GET SALE BY ID                                                             */
/* -------------------------------------------------------------------------- */

export async function getOfflineSale(id: string): Promise<OfflineSale | null> {
  const db = await getDatabase();

  const result = await db.query(
    `
      SELECT
        id,
        sale_no,
        customer_id,
        sale_date,
        subtotal,
        discount,
        tax_amount,
        grand_total,
        paid_amount,
        due_amount,
        payment_method,
        payment_status,
        notes,
        created_at,
        updated_at
      FROM sales
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  const row = result.values?.[0];

  if (!row) {
    return null;
  }

  const sale: OfflineSale = {
    id: String(row.id),

    saleNo: String(row.sale_no),

    saleDate: String(row.sale_date),

    subtotal: Number(row.subtotal ?? 0),

    discount: Number(row.discount ?? 0),

    taxAmount: Number(row.tax_amount ?? 0),

    grandTotal: Number(row.grand_total ?? 0),

    paidAmount: Number(row.paid_amount ?? 0),

    dueAmount: Number(row.due_amount ?? 0),

    paymentMethod: row.payment_method as OfflinePaymentMethod,

    paymentStatus: row.payment_status as OfflinePaymentStatus,

    createdAt: String(row.created_at),

    updatedAt: String(row.updated_at),
  };

  if (row.customer_id) {
    sale.customerId = String(row.customer_id);
  }

  if (row.notes) {
    sale.notes = String(row.notes);
  }

  sale.items = await getOfflineSaleItems(sale.id);

  sale.payments = await getOfflineSalePayments(sale.id);

  return sale;
}

/* -------------------------------------------------------------------------- */
/* RECONCILE SYNCED SALE                                                      */
/* -------------------------------------------------------------------------- */

export async function reconcileOfflineSale(
  temporaryId: string,
  serverSale: {
    _id: string;
    saleNo: string;
    invoiceNo?: string;
    saleDate?: string;
  },
): Promise<void> {
  const db = await getDatabase();

  if (!temporaryId) {
    throw new Error("Temporary offline sale ID is required.");
  }

  if (!serverSale._id) {
    throw new Error("Server sale ID is required.");
  }

  /*
   * Nothing to do if the IDs are already identical.
   */
  if (temporaryId === serverSale._id) {
    return;
  }

  const now = new Date().toISOString();

  await db.execute("BEGIN TRANSACTION");

  try {
    /*
     * Verify that the temporary sale exists.
     */
    const existing = await db.query(
      `
          SELECT id
          FROM sales
          WHERE id = ?
          LIMIT 1
        `,
      [temporaryId],
    );

    if (!existing.values?.length) {
      throw new Error(`Offline sale not found: ${temporaryId}`);
    }

    /*
     * Make sure the server ID isn't already
     * being used by another local sale.
     */
    const duplicate = await db.query(
      `
          SELECT id
          FROM sales
          WHERE id = ?
          LIMIT 1
        `,
      [serverSale._id],
    );

    if (duplicate.values?.length) {
      /*
       * The server sale is already present locally.
       *
       * Remove the temporary sale and its
       * children instead of creating duplicates.
       */

      await db.run(
        `
          DELETE FROM sale_payments
          WHERE sale_id = ?
        `,
        [temporaryId],
      );

      await db.run(
        `
          DELETE FROM sale_items
          WHERE sale_id = ?
        `,
        [temporaryId],
      );

      await db.run(
        `
          DELETE FROM sales
          WHERE id = ?
        `,
        [temporaryId],
      );

      await db.execute("COMMIT");

      return;
    }

    /*
     * Update child references first.
     */
    await db.run(
      `
        UPDATE sale_items
        SET sale_id = ?
        WHERE sale_id = ?
      `,
      [serverSale._id, temporaryId],
    );

    await db.run(
      `
        UPDATE sale_payments
        SET sale_id = ?
        WHERE sale_id = ?
      `,
      [serverSale._id, temporaryId],
    );

    /*
     * Replace the primary sale ID.
     */
    await db.run(
      `
        UPDATE sales
        SET
          id = ?,
          sale_no = ?,
          sale_date = COALESCE(?, sale_date),
          updated_at = ?
        WHERE id = ?
      `,
      [
        serverSale._id,
        serverSale.saleNo,
        serverSale.saleDate ?? null,
        now,
        temporaryId,
      ],
    );

    await db.execute("COMMIT");
  } catch (error) {
    try {
      await db.execute("ROLLBACK");
    } catch (rollbackError) {
      console.error("Failed to rollback sale reconciliation:", rollbackError);
    }

    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* GET SALE ITEMS                                                             */
/* -------------------------------------------------------------------------- */

export async function getOfflineSaleItems(
  saleId: string,
): Promise<OfflineSaleItem[]> {
  const db = await getDatabase();

  const result = await db.query(
    `
      SELECT
        id,
        sale_id,
        product_id,
        quantity,
        selling_price,
        discount,
        gst_rate,
        tax_amount,
        subtotal,
        total,
        created_at
      FROM sale_items
      WHERE sale_id = ?
      ORDER BY id ASC
    `,
    [saleId],
  );

  return (result.values ?? []).map((row) => ({
    id: String(row.id),

    saleId: String(row.sale_id),

    productId: String(row.product_id),

    quantity: Number(row.quantity ?? 0),

    sellingPrice: Number(row.selling_price ?? 0),

    discount: Number(row.discount ?? 0),

    gstRate: Number(row.gst_rate ?? 0),

    taxAmount: Number(row.tax_amount ?? 0),

    subtotal: Number(row.subtotal ?? 0),

    total: Number(row.total ?? 0),

    createdAt: String(row.created_at),
  }));
}

/* -------------------------------------------------------------------------- */
/* GET PAYMENTS                                                               */
/* -------------------------------------------------------------------------- */

export async function getOfflineSalePayments(
  saleId: string,
): Promise<OfflineSalePayment[]> {
  const db = await getDatabase();

  const result = await db.query(
    `
      SELECT
        id,
        sale_id,
        payment_method,
        amount,
        created_at
      FROM sale_payments
      WHERE sale_id = ?
      ORDER BY id ASC
    `,
    [saleId],
  );

  return (result.values ?? []).map((row) => ({
    id: String(row.id),

    saleId: String(row.sale_id),

    paymentMethod: row.payment_method as OfflinePaymentMethod,

    amount: Number(row.amount ?? 0),

    createdAt: String(row.created_at),
  }));
}

/* -------------------------------------------------------------------------- */
/* UPDATE SALE                                                                */
/* -------------------------------------------------------------------------- */

export async function updateOfflineSale(
  id: string,
  input: CreateOfflineSaleInput,
): Promise<OfflineSale> {
  const db = await getDatabase();

  const existingSale = await getOfflineSale(id);

  if (!existingSale) {
    throw new Error(`Offline sale not found: ${id}`);
  }

  if (input.items.length === 0) {
    throw new Error("A sale must contain at least one item.");
  }

  if (input.grandTotal < 0) {
    throw new Error("Sale total cannot be negative.");
  }

  if (input.paidAmount < 0) {
    throw new Error("Paid amount cannot be negative.");
  }

  if (input.paidAmount > input.grandTotal) {
    throw new Error("Paid amount cannot be greater than grand total.");
  }

  const now = new Date().toISOString();

  await db.execute("BEGIN TRANSACTION");

  try {
    /* ---------------------------------------------------------------------- */
    /* RESTORE OLD STOCK                                                      */
    /* ---------------------------------------------------------------------- */

    for (const item of existingSale.items ?? []) {
      await db.run(
        `
          UPDATE products
          SET
            stock = stock + ?,
            updated_at = ?
          WHERE id = ?
        `,
        [item.quantity, now, item.productId],
      );
    }

    /* ---------------------------------------------------------------------- */
    /* REVERSE OLD CUSTOMER DUE                                               */
    /* ---------------------------------------------------------------------- */

    if (existingSale.customerId && existingSale.dueAmount > 0) {
      await db.run(
        `
          UPDATE customers
          SET
            opening_balance =
              MAX(0, opening_balance - ?),
            updated_at = ?
          WHERE id = ?
        `,
        [existingSale.dueAmount, now, existingSale.customerId],
      );
    }

    /* ---------------------------------------------------------------------- */
    /* VALIDATE NEW STOCK                                                     */
    /* ---------------------------------------------------------------------- */

    for (const item of input.items) {
      const result = await db.query(
        `
            SELECT
              id,
              stock,
              name
            FROM products
            WHERE id = ?
            LIMIT 1
          `,
        [item.productId],
      );

      const product = result.values?.[0];

      if (!product) {
        throw new Error(`Product not found offline: ${item.productId}`);
      }

      const stock = Number(product.stock ?? 0);

      if (item.quantity <= 0) {
        throw new Error(`Invalid quantity for product ${item.productId}.`);
      }

      if (item.quantity > stock) {
        throw new Error(
          `Insufficient stock for ${String(
            product.name ?? item.productId,
          )}. Available: ${stock}.`,
        );
      }
    }

    /* ---------------------------------------------------------------------- */
    /* UPDATE SALE                                                            */
    /* ---------------------------------------------------------------------- */

    await db.run(
      `
        UPDATE sales
        SET
          sale_no = ?,
          customer_id = ?,
          sale_date = ?,
          subtotal = ?,
          discount = ?,
          tax_amount = ?,
          grand_total = ?,
          paid_amount = ?,
          due_amount = ?,
          payment_method = ?,
          payment_status = ?,
          notes = ?,
          updated_at = ?
        WHERE id = ?
      `,
      [
        input.saleNo,
        input.customerId ?? null,
        input.saleDate,
        input.subtotal,
        input.discount,
        input.taxAmount,
        input.grandTotal,
        input.paidAmount,
        input.dueAmount,
        input.paymentMethod,
        input.paymentStatus,
        input.notes ?? null,
        now,
        id,
      ],
    );

    /* ---------------------------------------------------------------------- */
    /* DELETE OLD ITEMS                                                       */
    /* ---------------------------------------------------------------------- */

    await db.run(
      `
        DELETE FROM sale_items
        WHERE sale_id = ?
      `,
      [id],
    );

    /* ---------------------------------------------------------------------- */
    /* INSERT NEW ITEMS + REDUCE STOCK                                        */
    /* ---------------------------------------------------------------------- */

    for (const item of input.items) {
      const itemId = generateId("offline-sale-item");

      await db.run(
        `
          INSERT INTO sale_items (
            id,
            sale_id,
            product_id,
            quantity,
            selling_price,
            discount,
            gst_rate,
            tax_amount,
            subtotal,
            total,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          itemId,
          id,
          item.productId,
          item.quantity,
          item.sellingPrice,
          item.discount,
          item.gstRate,
          item.taxAmount,
          item.subtotal,
          item.total,
          now,
        ],
      );

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
    /* REPLACE PAYMENTS                                                       */
    /* ---------------------------------------------------------------------- */

    await db.run(
      `
        DELETE FROM sale_payments
        WHERE sale_id = ?
      `,
      [id],
    );

    const payments = input.payments?.length
      ? input.payments
      : input.paidAmount > 0
        ? [
            {
              paymentMethod: input.paymentMethod,
              amount: input.paidAmount,
            },
          ]
        : [];

    for (const payment of payments) {
      if (payment.amount <= 0) {
        continue;
      }

      await db.run(
        `
          INSERT INTO sale_payments (
            id,
            sale_id,
            payment_method,
            amount,
            created_at
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          generateId("offline-payment"),
          id,
          payment.paymentMethod,
          payment.amount,
          now,
        ],
      );
    }

    /* ---------------------------------------------------------------------- */
    /* APPLY NEW CUSTOMER DUE                                                 */
    /* ---------------------------------------------------------------------- */

    if (input.customerId && input.dueAmount > 0) {
      await updateCustomerDue(db, input.customerId, input.dueAmount, now);
    }

    /* ---------------------------------------------------------------------- */
    /* COMMIT                                                                 */
    /* ---------------------------------------------------------------------- */

    await db.execute("COMMIT");
    notifyOfflineDataChanged();

    return {
      id,

      saleNo: input.saleNo,

      ...(input.customerId
        ? {
            customerId: input.customerId,
          }
        : {}),

      saleDate: input.saleDate,

      subtotal: input.subtotal,

      discount: input.discount,

      taxAmount: input.taxAmount,

      grandTotal: input.grandTotal,

      paidAmount: input.paidAmount,

      dueAmount: input.dueAmount,

      paymentMethod: input.paymentMethod,

      paymentStatus: input.paymentStatus,

      ...(input.notes
        ? {
            notes: input.notes,
          }
        : {}),

      createdAt: existingSale.createdAt,

      updatedAt: now,

      items: await getOfflineSaleItems(id),

      payments: await getOfflineSalePayments(id),
    };
  } catch (error) {
    try {
      await db.execute("ROLLBACK");
    } catch (rollbackError) {
      console.error("Failed to rollback offline sale update:", rollbackError);
    }

    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* DELETE SALE                                                                */
/* -------------------------------------------------------------------------- */

export async function deleteOfflineSale(id: string): Promise<void> {
  const db = await getDatabase();

  await db.execute("BEGIN TRANSACTION");

  try {
    /*
     * Restore stock before deleting
     * the sale.
     */

    const items = await getOfflineSaleItems(id);

    const now = new Date().toISOString();

    for (const item of items) {
      await db.run(
        `
          UPDATE products
          SET
            stock = stock + ?,
            updated_at = ?
          WHERE id = ?
        `,
        [item.quantity, now, item.productId],
      );
    }

    /*
     * Reverse customer due.
     */

    const sale = await getOfflineSale(id);

    if (sale?.customerId && sale.dueAmount > 0) {
      await db.run(
        `
          UPDATE customers
          SET
            opening_balance =
              MAX(0, opening_balance - ?),
            updated_at = ?
          WHERE id = ?
        `,
        [sale.dueAmount, now, sale.customerId],
      );
    }

    /*
     * Delete payments,
     * items and sale.
     */

    await db.run(
      `
        DELETE FROM sale_payments
        WHERE sale_id = ?
      `,
      [id],
    );

    await db.run(
      `
        DELETE FROM sale_items
        WHERE sale_id = ?
      `,
      [id],
    );

    await db.run(
      `
        DELETE FROM sales
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
      console.error("Failed to rollback sale deletion:", rollbackError);
    }

    throw error;
  }
}
