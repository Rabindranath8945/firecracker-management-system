import { Capacitor } from "@capacitor/core";
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";

const sqlite = new SQLiteConnection(CapacitorSQLite);

const DATABASE_NAME = "onehub_erp";
const DATABASE_VERSION = 1;

let database: SQLiteDBConnection | null = null;

export async function getDatabase(): Promise<SQLiteDBConnection> {
  if (!Capacitor.isNativePlatform()) {
    throw new Error(
      "SQLite database is available only on the native Capacitor app.",
    );
  }

  if (database) {
    return database;
  }

  database = await sqlite.createConnection(
    DATABASE_NAME,
    false,
    "no-encryption",
    DATABASE_VERSION,
    false,
  );

  await database.open();

  return database;
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDatabase();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      category_code TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      product_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sub_categories (
      id TEXT PRIMARY KEY NOT NULL,
      sub_category_code TEXT NOT NULL,
      name TEXT NOT NULL,
      category_id TEXT,
      description TEXT,
      product_count INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY NOT NULL,
      product_code TEXT NOT NULL,
      name TEXT NOT NULL,
      barcode TEXT,
      category_id TEXT,
      sub_category_id TEXT,
      purchase_price REAL NOT NULL DEFAULT 0,
      selling_price REAL NOT NULL DEFAULT 0,
      stock REAL NOT NULL DEFAULT 0,
      minimum_stock REAL NOT NULL DEFAULT 0,
      unit TEXT NOT NULL,
      brand TEXT NOT NULL,
      hsn_code TEXT NOT NULL,
      tax REAL NOT NULL DEFAULT 0,
      description TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY NOT NULL,
  customer_code TEXT NOT NULL,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  address TEXT,
  gst_no TEXT,
  type TEXT NOT NULL,
  opening_balance REAL NOT NULL DEFAULT 0,
  credit_limit REAL NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY NOT NULL,
  sale_no TEXT NOT NULL,
  customer_id TEXT,
  sale_date TEXT NOT NULL,

  subtotal REAL NOT NULL DEFAULT 0,
  discount REAL NOT NULL DEFAULT 0,
  tax_amount REAL NOT NULL DEFAULT 0,
  grand_total REAL NOT NULL DEFAULT 0,

  paid_amount REAL NOT NULL DEFAULT 0,
  due_amount REAL NOT NULL DEFAULT 0,

  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,

  notes TEXT,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sale_items (
  id TEXT PRIMARY KEY NOT NULL,
  sale_id TEXT NOT NULL,

  product_id TEXT NOT NULL,

  quantity REAL NOT NULL DEFAULT 0,
  selling_price REAL NOT NULL DEFAULT 0,

  discount REAL NOT NULL DEFAULT 0,
  gst_rate REAL NOT NULL DEFAULT 0,
  tax_amount REAL NOT NULL DEFAULT 0,

  subtotal REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,

  created_at TEXT NOT NULL,

  FOREIGN KEY (sale_id)
    REFERENCES sales(id)
    ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS sale_payments (
  id TEXT PRIMARY KEY NOT NULL,
  sale_id TEXT NOT NULL,

  payment_method TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0,

  created_at TEXT NOT NULL,

  FOREIGN KEY (sale_id)
    REFERENCES sales(id)
    ON DELETE CASCADE
);

/* -------------------------------------------------------------------------- */
/* PURCHASES                                                                  */
/* -------------------------------------------------------------------------- */

CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY NOT NULL,
  purchase_no TEXT NOT NULL,
  invoice_no TEXT,
  supplier_id TEXT NOT NULL,
  purchase_date TEXT NOT NULL,
  due_date TEXT,
  payment_status TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  subtotal REAL NOT NULL DEFAULT 0,
  discount REAL NOT NULL DEFAULT 0,
  gst_total REAL NOT NULL DEFAULT 0,
  transport_charge REAL NOT NULL DEFAULT 0,
  grand_total REAL NOT NULL DEFAULT 0,
  paid_amount REAL NOT NULL DEFAULT 0,
  due_amount REAL NOT NULL DEFAULT 0,
  notes TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS purchase_items (
  id TEXT PRIMARY KEY NOT NULL,
  purchase_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  purchase_price REAL NOT NULL DEFAULT 0,
  selling_price REAL NOT NULL DEFAULT 0,
  discount REAL NOT NULL DEFAULT 0,
  gst_rate REAL NOT NULL DEFAULT 0,
  subtotal REAL NOT NULL DEFAULT 0,
  gst_amount REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS purchase_payments (
  id TEXT PRIMARY KEY NOT NULL,
  purchase_id TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY NOT NULL,
  supplier_code TEXT NOT NULL,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pin_code TEXT,
  gst_no TEXT,
  opening_balance REAL NOT NULL DEFAULT 0,
  total_purchases REAL NOT NULL DEFAULT 0,
  total_paid REAL NOT NULL DEFAULT 0,
  total_due REAL NOT NULL DEFAULT 0,
  current_due REAL NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_suppliers_name
  ON suppliers(name);

CREATE INDEX IF NOT EXISTS idx_suppliers_mobile
  ON suppliers(mobile);

CREATE INDEX IF NOT EXISTS idx_suppliers_code
  ON suppliers(supplier_code);

CREATE INDEX IF NOT EXISTS idx_purchases_supplier
  ON purchases(supplier_id);

CREATE INDEX IF NOT EXISTS idx_purchases_date
  ON purchases(purchase_date);

CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase
  ON purchase_items(purchase_id);

CREATE INDEX IF NOT EXISTS idx_purchase_items_product
  ON purchase_items(product_id);

CREATE INDEX IF NOT EXISTS idx_purchase_payments_purchase
  ON purchase_payments(purchase_id);

CREATE INDEX IF NOT EXISTS idx_sale_payments_sale
  ON sale_payments(sale_id);

CREATE INDEX IF NOT EXISTS idx_sales_customer
  ON sales(customer_id);

  CREATE INDEX IF NOT EXISTS idx_sale_items_sale
  ON sale_items(sale_id);

CREATE INDEX IF NOT EXISTS idx_sale_items_product
  ON sale_items(product_id);

CREATE INDEX IF NOT EXISTS idx_sales_date
  ON sales(sale_date);

CREATE INDEX IF NOT EXISTS idx_sales_sale_no
  ON sales(sale_no);

CREATE INDEX IF NOT EXISTS idx_customers_name
  ON customers(name);

CREATE INDEX IF NOT EXISTS idx_customers_mobile
  ON customers(mobile);

CREATE INDEX IF NOT EXISTS idx_customers_code
  ON customers(customer_code);

    CREATE INDEX IF NOT EXISTS idx_categories_name
      ON categories(name);

    CREATE INDEX IF NOT EXISTS idx_sub_categories_category
      ON sub_categories(category_id);

    CREATE INDEX IF NOT EXISTS idx_products_name
      ON products(name);

    CREATE INDEX IF NOT EXISTS idx_products_category
      ON products(category_id);

    CREATE INDEX IF NOT EXISTS idx_products_barcode
      ON products(barcode);

    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity TEXT NOT NULL,
      entity_id TEXT,
      action TEXT NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sync_queue_status
      ON sync_queue(status);

    CREATE INDEX IF NOT EXISTS idx_sync_queue_entity
      ON sync_queue(entity);
  `);
}

export async function closeDatabase(): Promise<void> {
  if (!database) {
    return;
  }

  await sqlite.closeConnection(DATABASE_NAME, false);

  database = null;
}
