import { getDatabase } from "../api/database";

import type { Category } from "@/features/categories/category/types/category";
import type { SubCategory } from "@/features/categories/sub-category/types/sub-category";
import type { Product } from "@/features/products/types/product.types";
import type { Customer } from "@/features/customers/types/customer";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function booleanToSql(value: boolean): number {
  return value ? 1 : 0;
}

function sqlToBoolean(value: unknown): boolean {
  return Number(value) === 1;
}

/* -------------------------------------------------------------------------- */
/* CATEGORIES                                                                 */
/* -------------------------------------------------------------------------- */

export async function saveCategories(categories: Category[]): Promise<void> {
  const db = await getDatabase();

  for (const category of categories) {
    await db.run(
      `
        INSERT OR REPLACE INTO categories (
          id,
          category_code,
          name,
          description,
          image,
          is_active,
          product_count,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        category.id,
        category.categoryCode,
        category.name,
        category.description ?? null,
        category.image ?? null,
        booleanToSql(category.isActive),
        category.productCount,
        category.createdAt,
        category.updatedAt,
      ],
    );
  }
}

export async function getCategories(): Promise<Category[]> {
  const db = await getDatabase();

  const result = await db.query(`
    SELECT
      id,
      category_code,
      name,
      description,
      image,
      is_active,
      product_count,
      created_at,
      updated_at
    FROM categories
    ORDER BY name ASC
  `);

  return (result.values ?? []).map((row) => {
    const category: Category = {
      id: String(row.id),
      categoryCode: String(row.category_code),
      name: String(row.name),
      isActive: sqlToBoolean(row.is_active),
      productCount: Number(row.product_count),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };

    if (row.description !== null && row.description !== undefined) {
      category.description = String(row.description);
    }

    if (row.image !== null && row.image !== undefined) {
      category.image = String(row.image);
    }

    return category;
  });
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const db = await getDatabase();

  const result = await db.query(
    `
      SELECT
        id,
        category_code,
        name,
        description,
        image,
        is_active,
        product_count,
        created_at,
        updated_at
      FROM categories
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  const row = result.values?.[0];

  if (!row) {
    return null;
  }

  const category: Category = {
    id: String(row.id),
    categoryCode: String(row.category_code),
    name: String(row.name),
    isActive: sqlToBoolean(row.is_active),
    productCount: Number(row.product_count),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };

  if (row.description !== null && row.description !== undefined) {
    category.description = String(row.description);
  }

  if (row.image !== null && row.image !== undefined) {
    category.image = String(row.image);
  }

  return category;
}

export async function deleteCategory(id: string): Promise<void> {
  const db = await getDatabase();

  await db.run(
    `
      DELETE FROM categories
      WHERE id = ?
    `,
    [id],
  );
}

/* -------------------------------------------------------------------------- */
/* SUB CATEGORIES                                                             */
/* -------------------------------------------------------------------------- */

export async function saveSubCategories(
  subCategories: SubCategory[],
): Promise<void> {
  const db = await getDatabase();

  for (const subCategory of subCategories) {
    const categoryId =
      typeof subCategory.category === "string"
        ? subCategory.category
        : (subCategory.category?._id ?? null);

    await db.run(
      `
        INSERT OR REPLACE INTO sub_categories (
          id,
          sub_category_code,
          name,
          category_id,
          description,
          product_count,
          is_active,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        subCategory._id,
        subCategory.subCategoryCode,
        subCategory.name,
        categoryId,
        subCategory.description ?? null,
        subCategory.productCount ?? 0,
        booleanToSql(subCategory.isActive),
        subCategory.createdAt,
        subCategory.updatedAt,
      ],
    );
  }
}

export async function getSubCategories(
  categoryId?: string,
): Promise<SubCategory[]> {
  const db = await getDatabase();

  const result = categoryId
    ? await db.query(
        `
          SELECT
            id,
            sub_category_code,
            name,
            category_id,
            description,
            product_count,
            is_active,
            created_at,
            updated_at
          FROM sub_categories
          WHERE category_id = ?
          ORDER BY name ASC
        `,
        [categoryId],
      )
    : await db.query(`
        SELECT
          id,
          sub_category_code,
          name,
          category_id,
          description,
          product_count,
          is_active,
          created_at,
          updated_at
        FROM sub_categories
        ORDER BY name ASC
      `);

  return (result.values ?? []).map((row) => {
    const subCategory: SubCategory = {
      _id: String(row.id),
      subCategoryCode: String(row.sub_category_code),
      name: String(row.name),
      category:
        row.category_id !== null && row.category_id !== undefined
          ? String(row.category_id)
          : null,
      productCount: Number(row.product_count),
      isActive: sqlToBoolean(row.is_active),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };

    if (row.description !== null && row.description !== undefined) {
      subCategory.description = String(row.description);
    }

    return subCategory;
  });
}
export async function getSubCategoryById(
  id: string,
): Promise<SubCategory | null> {
  const db = await getDatabase();

  const result = await db.query(
    `
      SELECT
        id,
        sub_category_code,
        name,
        category_id,
        description,
        product_count,
        is_active,
        created_at,
        updated_at
      FROM sub_categories
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  const row = result.values?.[0];

  if (!row) {
    return null;
  }

  const subCategory: SubCategory = {
    _id: String(row.id),
    subCategoryCode: String(row.sub_category_code),
    name: String(row.name),
    category:
      row.category_id !== null && row.category_id !== undefined
        ? String(row.category_id)
        : null,
    productCount: Number(row.product_count),
    isActive: sqlToBoolean(row.is_active),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };

  if (row.description !== null && row.description !== undefined) {
    subCategory.description = String(row.description);
  }

  return subCategory;
}

export async function deleteSubCategory(id: string): Promise<void> {
  const db = await getDatabase();

  await db.run(
    `
      DELETE FROM sub_categories
      WHERE id = ?
    `,
    [id],
  );
}

/* -------------------------------------------------------------------------- */
/* PRODUCTS                                                                   */
/* -------------------------------------------------------------------------- */

export async function saveProducts(products: Product[]): Promise<void> {
  const db = await getDatabase();

  for (const product of products) {
    await db.run(
      `
        INSERT OR REPLACE INTO products (
          id,
          product_code,
          name,
          barcode,
          category_id,
          sub_category_id,
          purchase_price,
          selling_price,
          stock,
          minimum_stock,
          unit,
          brand,
          hsn_code,
          tax,
          description,
          image,
          is_active,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        product._id,
        product.productCode,
        product.name,
        product.barcode ?? null,
        product.category?._id ?? null,
        product.subCategory?._id ?? null,
        product.purchasePrice,
        product.sellingPrice,
        product.stock,
        product.minimumStock,
        product.unit,
        product.brand,
        product.hsnCode,
        product.tax,
        product.description,
        product.image,
        booleanToSql(product.isActive),
        product.createdAt,
        product.updatedAt,
      ],
    );
  }
}

export async function getProducts(): Promise<Product[]> {
  const db = await getDatabase();

  const result = await db.query(`
    SELECT
      p.id,
      p.product_code,
      p.name,
      p.barcode,
      p.category_id,
      p.sub_category_id,
      p.purchase_price,
      p.selling_price,
      p.stock,
      p.minimum_stock,
      p.unit,
      p.brand,
      p.hsn_code,
      p.tax,
      p.description,
      p.image,
      p.is_active,
      p.created_at,
      p.updated_at,
      c.name AS category_name,
      sc.name AS sub_category_name
    FROM products p
    LEFT JOIN categories c
      ON p.category_id = c.id
    LEFT JOIN sub_categories sc
      ON p.sub_category_id = sc.id
    ORDER BY p.name ASC
  `);

  return (result.values ?? []).map((row) => {
    const product: Product = {
      _id: String(row.id),
      productCode: String(row.product_code),
      name: String(row.name),
      purchasePrice: Number(row.purchase_price),
      sellingPrice: Number(row.selling_price),
      stock: Number(row.stock),
      minimumStock: Number(row.minimum_stock),
      unit: String(row.unit),
      brand: String(row.brand),
      hsnCode: String(row.hsn_code),
      tax: Number(row.tax),
      description: String(row.description ?? ""),
      image: String(row.image ?? ""),
      isActive: sqlToBoolean(row.is_active),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };

    if (row.barcode !== null && row.barcode !== undefined) {
      product.barcode = String(row.barcode);
    }

    if (row.category_id !== null && row.category_id !== undefined) {
      product.category = {
        _id: String(row.category_id),
        name: String(row.category_name ?? ""),
      };
    }

    if (row.sub_category_id !== null && row.sub_category_id !== undefined) {
      product.subCategory = {
        _id: String(row.sub_category_id),
        name: String(row.sub_category_name ?? ""),
      };
    }

    return product;
  });
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();

  return products.find((product) => product._id === id) ?? null;
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await getDatabase();

  await db.run(
    `
      DELETE FROM products
      WHERE id = ?
    `,
    [id],
  );
}

/* -------------------------------------------------------------------------- */
/* CUSTOMERS                                                                  */
/* -------------------------------------------------------------------------- */

export async function saveCustomers(customers: Customer[]): Promise<void> {
  const db = await getDatabase();

  for (const customer of customers) {
    await db.run(
      `
        INSERT OR REPLACE INTO customers (
          id,
          customer_code,
          name,
          mobile,
          email,
          address,
          gst_no,
          type,
          opening_balance,
          credit_limit,
          notes,
          is_active,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        customer._id,
        customer.customerCode,
        customer.name,
        customer.mobile,
        customer.email ?? null,
        customer.address ?? null,
        customer.gstNo ?? null,
        customer.type,
        customer.openingBalance,
        customer.creditLimit,
        customer.notes,
        booleanToSql(customer.isActive),
        customer.createdAt,
        customer.updatedAt,
      ],
    );
  }
}

export async function getCustomers(): Promise<Customer[]> {
  const db = await getDatabase();

  const result = await db.query(`
    SELECT
      id,
      customer_code,
      name,
      mobile,
      email,
      address,
      gst_no,
      type,
      opening_balance,
      credit_limit,
      notes,
      is_active,
      created_at,
      updated_at
    FROM customers
    ORDER BY name ASC
  `);

  return (result.values ?? []).map((row) => {
    const customer: Customer = {
      _id: String(row.id),
      customerCode: String(row.customer_code),
      name: String(row.name),

      mobile: String(row.mobile ?? ""),

      type: String(row.type) as Customer["type"],

      openingBalance: Number(row.opening_balance ?? 0),

      creditLimit: Number(row.credit_limit ?? 0),

      notes: String(row.notes ?? ""),

      isActive: sqlToBoolean(row.is_active),

      createdAt: String(row.created_at),

      updatedAt: String(row.updated_at),
    };

    if (row.email !== null && row.email !== undefined) {
      customer.email = String(row.email);
    }

    if (row.address !== null && row.address !== undefined) {
      customer.address = String(row.address);
    }

    if (row.gst_no !== null && row.gst_no !== undefined) {
      customer.gstNo = String(row.gst_no);
    }

    return customer;
  });
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const customers = await getCustomers();

  return customers.find((customer) => customer._id === id) ?? null;
}

export async function deleteCustomer(id: string): Promise<void> {
  const db = await getDatabase();

  await db.run(
    `
      DELETE FROM customers
      WHERE id = ?
    `,
    [id],
  );
}
