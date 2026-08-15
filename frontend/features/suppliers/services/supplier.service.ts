import api from "@/lib/api";

import type {
  Supplier,
  SupplierFormData,
  SupplierListResponse,
} from "../types/supplier.type";

/* -------------------------------------------------------------------------- */
/* Supplier Balance                                                           */
/* -------------------------------------------------------------------------- */

export interface SupplierBalance {
  supplierId: string;
  openingBalance: number;
  totalPurchases: number;
  totalPaid: number;
  dueAmount: number;
}

/* -------------------------------------------------------------------------- */
/* Get Suppliers                                                              */
/* -------------------------------------------------------------------------- */

export async function getSuppliers(): Promise<SupplierListResponse> {
  const { data } = await api.get("/suppliers");

  return data.data;
}

/* -------------------------------------------------------------------------- */
/* Get Supplier                                                               */
/* -------------------------------------------------------------------------- */

export async function getSupplier(id: string): Promise<Supplier> {
  const { data } = await api.get(`/suppliers/${id}`);

  return data.data;
}

/* -------------------------------------------------------------------------- */
/* Get Supplier Balance                                                       */
/* -------------------------------------------------------------------------- */

export async function getSupplierBalance(id: string): Promise<SupplierBalance> {
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

  return data.data;
}

/* -------------------------------------------------------------------------- */
/* Update Supplier                                                            */
/* -------------------------------------------------------------------------- */

export async function updateSupplier(
  id: string,
  payload: SupplierFormData,
): Promise<Supplier> {
  const { data } = await api.put(`/suppliers/${id}`, payload);

  return data.data;
}

/* -------------------------------------------------------------------------- */
/* Delete Supplier                                                            */
/* -------------------------------------------------------------------------- */

export async function deleteSupplier(id: string): Promise<void> {
  await api.delete(`/suppliers/${id}`);
}
