import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

export interface Supplier extends PartyFormValues {
  _id: string;

  supplierCode: string;

  openingBalance: number;

  totalPurchases: number;

  totalPaid: number;

  lastPurchaseDate?: string;

  createdAt: string;

  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SupplierListResponse {
  items: Supplier[];
  pagination: Pagination;
}

export type SupplierFormData = PartyFormValues;
