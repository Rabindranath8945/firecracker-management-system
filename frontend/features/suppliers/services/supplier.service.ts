import api from "@/lib/api";

import {
  getOfflineSupplier,
  getOfflineSuppliers,
  saveSupplier,
  saveSuppliers,
} from "@/libs/offline/store/offline.suppliers";

import type {
  Supplier,
  SupplierFormData,
  SupplierListResponse,
  SupplierBalance,
} from "../types/supplier.type";

/* -------------------------------------------------------------------------- */
/* Get Suppliers                                                              */
/* -------------------------------------------------------------------------- */

export async function getSuppliers(): Promise<SupplierListResponse> {
  /*
   * OFFLINE
   */
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    const suppliers = await getOfflineSuppliers();

    return {
      items: suppliers,
      pagination: {
        page: 1,
        limit: suppliers.length || 20,
        total: suppliers.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  /*
   * ONLINE
   */
  const { data } = await api.get("/suppliers");

  const result = data.data as SupplierListResponse;

  /*
   * Cache suppliers locally.
   *
   * If SQLite is unavailable in the browser,
   * don't break the online API response.
   */
  try {
    await saveSuppliers(result.items);
  } catch (error) {
    console.warn("Unable to cache suppliers offline:", error);
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* Get Supplier                                                               */
/* -------------------------------------------------------------------------- */

export async function getSupplier(id: string): Promise<Supplier> {
  if (!id) {
    throw new Error("Supplier ID is required.");
  }

  /*
   * OFFLINE
   */
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    const supplier = await getOfflineSupplier(id);

    if (!supplier) {
      throw new Error("Supplier not found offline.");
    }

    return supplier;
  }

  /*
   * ONLINE
   */
  const { data } = await api.get(`/suppliers/${id}`);

  const supplier = data.data as Supplier;

  try {
    await saveSupplier(supplier);
  } catch (error) {
    console.warn("Unable to cache supplier offline:", error);
  }

  return supplier;
}

/* -------------------------------------------------------------------------- */
/* Get Supplier Balance                                                       */
/* -------------------------------------------------------------------------- */

export async function getSupplierBalance(id: string): Promise<SupplierBalance> {
  if (!id) {
    throw new Error("Supplier ID is required.");
  }

  /*
   * Supplier balance will be handled
   * locally when the Purchase offline
   * accounting layer is connected.
   */
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    const supplier = await getOfflineSupplier(id);

    if (!supplier) {
      throw new Error("Supplier not found offline.");
    }

    return {
      supplierId: supplier._id,
      supplierCode: supplier.supplierCode,
      supplierName: supplier.name,
      openingBalance: supplier.openingBalance,
      totalPurchases: supplier.totalPurchases,
      totalPaid: supplier.totalPaid,
      totalDue: supplier.totalDue,
      totalSupplierPayments: supplier.totalPaid,
      currentDue: supplier.currentDue,
      lastPurchaseDate: null,
    };
  }

  const { data } = await api.get(`/suppliers/${id}/balance`);

  return data.data;
}

/* -------------------------------------------------------------------------- */
/* Create Supplier                                                            */
/* -------------------------------------------------------------------------- */

export async function createSupplier(
  payload: SupplierFormData,
): Promise<Supplier> {
  const { data } = await api.post("/suppliers", payload);

  const supplier = data.data as Supplier;

  try {
    await saveSupplier(supplier);
  } catch (error) {
    console.warn("Unable to cache supplier offline:", error);
  }

  return supplier;
}

/* -------------------------------------------------------------------------- */
/* Update Supplier                                                            */
/* -------------------------------------------------------------------------- */

export async function updateSupplier(
  id: string,
  payload: SupplierFormData,
): Promise<Supplier> {
  const { data } = await api.put(`/suppliers/${id}`, payload);

  const supplier = data.data as Supplier;

  try {
    await saveSupplier(supplier);
  } catch (error) {
    console.warn("Unable to cache supplier offline:", error);
  }

  return supplier;
}

/* -------------------------------------------------------------------------- */
/* Delete Supplier                                                            */
/* -------------------------------------------------------------------------- */

export async function deleteSupplier(id: string): Promise<void> {
  if (!id) {
    throw new Error("Supplier ID is required.");
  }

  await api.delete(`/suppliers/${id}`);

  try {
    const { deleteSupplier: deleteOffline } =
      await import("@/libs/offline/store/offline.suppliers");

    await deleteOffline(id);
  } catch (error) {
    console.warn("Unable to remove supplier from offline cache:", error);
  }
}
