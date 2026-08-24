import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

export interface Customer extends PartyFormValues {
  _id: string;

  customerCode: string;

  openingBalance: number;

  creditLimit: number;

  notes: string;

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

export interface CustomerListResponse {
  items: Customer[];
  pagination: Pagination;
}

export type CustomerFormData = PartyFormValues;
