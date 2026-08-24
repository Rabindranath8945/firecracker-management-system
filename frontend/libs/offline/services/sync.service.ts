import api from "@/lib/api";

import {
  getPendingSyncItems,
  markSyncFailed,
  markSyncing,
  removeFromSyncQueue,
} from "../sync/sync.queue";

import {
  deleteCategory,
  deleteCustomer,
  deleteProduct,
  deleteSubCategory,
  saveCategories,
  saveCustomers,
  saveProducts,
  saveSubCategories,
} from "../store/offline.storage";

import { reconcileOfflineSale } from "../store/offline.sales";

import { reconcileOfflinePurchase } from "../store/offline.purchases";

import type { Category } from "@/features/categories/category/types/category";
import type { Product } from "@/features/products/types/product.types";
import type { SubCategory } from "@/features/categories/sub-category/types/sub-category";
import type { Customer } from "@/features/customers/types/customer";

import type { SyncQueueItem } from "../types/database.types";

/* -------------------------------------------------------------------------- */
/* BACKEND RESPONSES                                                          */
/* -------------------------------------------------------------------------- */

interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category & {
    _id?: string;
  };
}

interface SubCategoryResponse {
  success: boolean;
  message: string;
  data: SubCategory;
}

interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface CustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

interface SaleResponse {
  success: boolean;
  message: string;
  data: {
    sale?: {
      _id: string;
      saleNo: string;
      invoiceNo?: string;
      saleDate?: string;
    };

    _id?: string;
    saleNo?: string;
    invoiceNo?: string;
    saleDate?: string;
  };
}

interface PurchaseResponse {
  success: boolean;
  message: string;
  data: {
    purchase?: {
      _id: string;
      purchaseNo: string;
      invoiceNo?: string;
      purchaseDate?: string;
    };

    _id?: string;
    purchaseNo?: string;
    invoiceNo?: string;
    purchaseDate?: string;
  };
}

/* -------------------------------------------------------------------------- */
/* NORMALIZE CATEGORY                                                         */
/* -------------------------------------------------------------------------- */

function normalizeCategory(category: Category & { _id?: string }): Category {
  return {
    ...category,
    id: category.id ?? category._id ?? "",
    productCount: Number(category.productCount ?? 0),
  };
}

/* -------------------------------------------------------------------------- */
/* SYNC ONE ITEM                                                              */
/* -------------------------------------------------------------------------- */

async function syncItem(item: SyncQueueItem): Promise<void> {
  if (!item.id) {
    return;
  }

  await markSyncing(item.id);

  try {
    const payload: unknown = JSON.parse(item.payload);

    switch (item.entity) {
      case "CATEGORY":
        await syncCategory(item, payload);
        break;

      case "SUB_CATEGORY":
        await syncSubCategory(item, payload);
        break;

      case "PRODUCT":
        await syncProduct(item, payload);
        break;

      case "CUSTOMER":
        await syncCustomer(item, payload);
        break;

      case "SALE":
        await syncSale(item, payload);
        break;

      case "PURCHASE":
        await syncPurchase(item, payload);
        break;

      default:
        await syncGenericItem(item, payload);
        break;
    }

    await removeFromSyncQueue(item.id);
  } catch (error) {
    console.error(`Failed to sync ${item.entity} ${item.action}:`, error);

    await markSyncFailed(item.id);
  }
}

/* -------------------------------------------------------------------------- */
/* CATEGORY SYNC                                                              */
/* -------------------------------------------------------------------------- */

async function syncCategory(
  item: SyncQueueItem,
  payload: unknown,
): Promise<void> {
  switch (item.action) {
    case "CREATE": {
      const response = await api.post<CategoryResponse>("/categories", payload);

      const category = normalizeCategory(response.data.data);

      await saveCategories([category]);

      if (item.entityId && item.entityId !== category.id) {
        await deleteCategory(item.entityId);
      }

      break;
    }

    case "UPDATE": {
      if (!item.entityId) {
        throw new Error("Missing category ID for update.");
      }

      const response = await api.put<CategoryResponse>(
        `/categories/${item.entityId}`,
        payload,
      );

      const category = normalizeCategory(response.data.data);

      await saveCategories([category]);

      break;
    }

    case "DELETE": {
      if (!item.entityId) {
        throw new Error("Missing category ID for delete.");
      }

      await api.delete(`/categories/${item.entityId}`);

      await deleteCategory(item.entityId);

      break;
    }

    default:
      throw new Error(`Unsupported category action: ${item.action}`);
  }
}

/* -------------------------------------------------------------------------- */
/* SUB CATEGORY SYNC                                                          */
/* -------------------------------------------------------------------------- */

async function syncSubCategory(
  item: SyncQueueItem,
  payload: unknown,
): Promise<void> {
  switch (item.action) {
    case "CREATE": {
      const response = await api.post<SubCategoryResponse>(
        "/sub-categories",
        payload,
      );

      const subCategory = response.data.data;

      await saveSubCategories([subCategory]);

      if (item.entityId && item.entityId !== subCategory._id) {
        await deleteSubCategory(item.entityId);
      }

      break;
    }

    case "UPDATE": {
      if (!item.entityId) {
        throw new Error("Missing sub category ID for update.");
      }

      const response = await api.put<SubCategoryResponse>(
        `/sub-categories/${item.entityId}`,
        payload,
      );

      const subCategory = response.data.data;

      await saveSubCategories([subCategory]);

      break;
    }

    case "DELETE": {
      if (!item.entityId) {
        throw new Error("Missing sub category ID for delete.");
      }

      await api.delete(`/sub-categories/${item.entityId}`);

      await deleteSubCategory(item.entityId);

      break;
    }

    default:
      throw new Error(`Unsupported sub category action: ${item.action}`);
  }
}

/* -------------------------------------------------------------------------- */
/* PRODUCT SYNC                                                               */
/* -------------------------------------------------------------------------- */

async function syncProduct(
  item: SyncQueueItem,
  payload: unknown,
): Promise<void> {
  switch (item.action) {
    /* ---------------------------------------------------------------------- */
    /* CREATE                                                                 */
    /* ---------------------------------------------------------------------- */

    case "CREATE": {
      const response = await api.post<ProductResponse>("/products", payload);

      const product = response.data.data;

      /*
       * Save the real server product.
       */
      await saveProducts([product]);

      /*
       * Remove the temporary offline product.
       */
      if (item.entityId && item.entityId !== product._id) {
        await deleteProduct(item.entityId);
      }

      break;
    }

    /* ---------------------------------------------------------------------- */
    /* UPDATE                                                                 */
    /* ---------------------------------------------------------------------- */

    case "UPDATE": {
      if (!item.entityId) {
        throw new Error("Missing product ID for update.");
      }

      const response = await api.put<ProductResponse>(
        `/products/${item.entityId}`,
        payload,
      );

      const product = response.data.data;

      await saveProducts([product]);

      break;
    }

    /* ---------------------------------------------------------------------- */
    /* DELETE                                                                 */
    /* ---------------------------------------------------------------------- */

    case "DELETE": {
      if (!item.entityId) {
        throw new Error("Missing product ID for delete.");
      }

      await api.delete(`/products/${item.entityId}`);

      await deleteProduct(item.entityId);

      break;
    }

    default:
      throw new Error(`Unsupported product action: ${item.action}`);
  }
}

/* -------------------------------------------------------------------------- */
/* CUSTOMER SYNC                                                              */
/* -------------------------------------------------------------------------- */

async function syncCustomer(
  item: SyncQueueItem,
  payload: unknown,
): Promise<void> {
  switch (item.action) {
    /* ---------------------------------------------------------------------- */
    /* CREATE                                                                 */
    /* ---------------------------------------------------------------------- */

    case "CREATE": {
      const response = await api.post<CustomerResponse>("/customers", payload);

      const customer = response.data.data;

      /*
       * Save the real server customer.
       */
      await saveCustomers([customer]);

      /*
       * Remove temporary offline customer.
       */
      if (item.entityId && item.entityId !== customer._id) {
        await deleteCustomer(item.entityId);
      }

      break;
    }

    /* ---------------------------------------------------------------------- */
    /* UPDATE                                                                 */
    /* ---------------------------------------------------------------------- */

    case "UPDATE": {
      if (!item.entityId) {
        throw new Error("Missing customer ID for update.");
      }

      const response = await api.put<CustomerResponse>(
        `/customers/${item.entityId}`,
        payload,
      );

      const customer = response.data.data;

      await saveCustomers([customer]);

      break;
    }

    /* ---------------------------------------------------------------------- */
    /* DELETE                                                                 */
    /* ---------------------------------------------------------------------- */

    case "DELETE": {
      if (!item.entityId) {
        throw new Error("Missing customer ID for delete.");
      }

      await api.delete(`/customers/${item.entityId}`);

      await deleteCustomer(item.entityId);

      break;
    }

    default:
      throw new Error(`Unsupported customer action: ${item.action}`);
  }
}

/* -------------------------------------------------------------------------- */
/* SALE SYNC                                                                  */
/* -------------------------------------------------------------------------- */

async function syncSale(item: SyncQueueItem, payload: unknown): Promise<void> {
  switch (item.action) {
    case "CREATE": {
      if (!item.entityId) {
        throw new Error("Missing temporary sale ID for create.");
      }

      const response = await api.post<SaleResponse>("/sales", payload);

      const data = response.data.data;

      const serverSale = data.sale ?? data;

      if (!serverSale._id) {
        throw new Error("Backend did not return the created sale ID.");
      }

      await reconcileOfflineSale(item.entityId, {
        _id: serverSale._id,
        saleNo: serverSale.saleNo ?? "",
        ...(serverSale.invoiceNo
          ? {
              invoiceNo: serverSale.invoiceNo,
            }
          : {}),
        ...(serverSale.saleDate
          ? {
              saleDate: serverSale.saleDate,
            }
          : {}),
      });

      break;
    }

    case "UPDATE": {
      if (!item.entityId) {
        throw new Error("Missing sale ID for update.");
      }

      await api.put(`/sales/${item.entityId}`, payload);

      break;
    }

    case "DELETE": {
      if (!item.entityId) {
        throw new Error("Missing sale ID for delete.");
      }

      await api.delete(`/sales/${item.entityId}`);

      /*
       * The local sale was already deleted
       * when the offline DELETE was created.
       *
       * Do NOT call deleteOfflineSale() again.
       */

      break;
    }

    default:
      throw new Error(`Unsupported sale action: ${item.action}`);
  }
}

/* -------------------------------------------------------------------------- */
/* PURCHASE SYNC                                                              */
/* -------------------------------------------------------------------------- */

async function syncPurchase(
  item: SyncQueueItem,
  payload: unknown,
): Promise<void> {
  switch (item.action) {
    /* ---------------------------------------------------------------------- */
    /* CREATE                                                                 */
    /* ---------------------------------------------------------------------- */

    case "CREATE": {
      if (!item.entityId) {
        throw new Error("Missing temporary purchase ID for create.");
      }

      const response = await api.post<PurchaseResponse>("/purchases", payload);

      const data = response.data.data;

      const serverPurchase = data.purchase ?? data;

      if (!serverPurchase._id) {
        throw new Error("Backend did not return the created purchase ID.");
      }

      await reconcileOfflinePurchase(item.entityId, {
        _id: serverPurchase._id,

        purchaseNo: serverPurchase.purchaseNo ?? "",

        ...(serverPurchase.invoiceNo
          ? {
              invoiceNo: serverPurchase.invoiceNo,
            }
          : {}),

        ...(serverPurchase.purchaseDate
          ? {
              purchaseDate: serverPurchase.purchaseDate,
            }
          : {}),
      });

      break;
    }

    /* ---------------------------------------------------------------------- */
    /* UPDATE                                                                 */
    /* ---------------------------------------------------------------------- */

    case "UPDATE": {
      if (!item.entityId) {
        throw new Error("Missing purchase ID for update.");
      }

      await api.put(`/purchases/${item.entityId}`, payload);

      break;
    }

    /* ---------------------------------------------------------------------- */
    /* DELETE                                                                 */
    /* ---------------------------------------------------------------------- */

    case "DELETE": {
      if (!item.entityId) {
        throw new Error("Missing purchase ID for delete.");
      }

      await api.delete(`/purchases/${item.entityId}`);

      /*
       * The local purchase has already
       * been removed when the offline
       * DELETE was created.
       *
       * Do not delete it again here.
       */

      break;
    }

    default:
      throw new Error(`Unsupported purchase action: ${item.action}`);
  }
}

/* -------------------------------------------------------------------------- */
/* GENERIC SYNC                                                               */
/* -------------------------------------------------------------------------- */

async function syncGenericItem(
  item: SyncQueueItem,
  payload: unknown,
): Promise<void> {
  const endpoint = getEndpoint(item);

  switch (item.action) {
    case "CREATE":
      await api.post(endpoint, payload);
      break;

    case "UPDATE":
      if (!item.entityId) {
        throw new Error(`Missing entity ID for ${item.entity} update.`);
      }

      await api.put(`${endpoint}/${item.entityId}`, payload);
      break;

    case "DELETE":
      if (!item.entityId) {
        throw new Error(`Missing entity ID for ${item.entity} delete.`);
      }

      await api.delete(`${endpoint}/${item.entityId}`);
      break;

    default:
      throw new Error(`Unsupported sync action: ${item.action}`);
  }
}

/* -------------------------------------------------------------------------- */
/* ENDPOINT                                                                   */
/* -------------------------------------------------------------------------- */

function getEndpoint(item: SyncQueueItem): string {
  switch (item.entity) {
    case "PRODUCT":
      return "/products";

    case "CATEGORY":
      return "/categories";

    case "SUB_CATEGORY":
      return "/sub-categories";

    case "CUSTOMER":
      return "/customers";

    case "SUPPLIER":
      return "/suppliers";

    case "SALE":
      return "/sales";

    case "PURCHASE":
      return "/purchases";

    case "EXPENSE":
      return "/expenses";

    case "PAYMENT":
      return "/payments";

    case "SETTING":
      return "/settings";

    default:
      throw new Error(`Unsupported sync entity: ${item.entity}`);
  }
}

/* -------------------------------------------------------------------------- */
/* SYNC ALL                                                                   */
/* -------------------------------------------------------------------------- */

export async function syncPendingItems(): Promise<void> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return;
  }

  const items = await getPendingSyncItems();

  for (const item of items) {
    await syncItem(item);
  }
}
