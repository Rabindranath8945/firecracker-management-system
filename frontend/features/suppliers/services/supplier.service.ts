import { suppliers } from "../data/suppliers";
import type { Supplier } from "../types/supplier";

export { suppliers };

export function getSuppliers(): Supplier[] {
  return suppliers;
}

export function getSupplierById(id: string): Supplier | undefined {
  return suppliers.find((supplier) => supplier.id === id);
}
