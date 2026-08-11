import api from "@/lib/api";

import type {
  Supplier,
  SupplierFormData,
  SupplierListResponse,
} from "../types/supplier";

export async function getSuppliers(): Promise<SupplierListResponse> {
  const { data } = await api.get("/suppliers");

  return data.data;
}

export async function getSupplier(id: string): Promise<Supplier> {
  const { data } = await api.get(`/suppliers/${id}`);

  return data.data;
}

export async function createSupplier(
  payload: SupplierFormData,
): Promise<Supplier> {
  const { data } = await api.post("/suppliers", payload);

  return data.data;
}

export async function updateSupplier(
  id: string,
  payload: SupplierFormData,
): Promise<Supplier> {
  const { data } = await api.put(`/suppliers/${id}`, payload);

  return data.data;
}

export async function deleteSupplier(id: string): Promise<void> {
  await api.delete(`/suppliers/${id}`);
}
