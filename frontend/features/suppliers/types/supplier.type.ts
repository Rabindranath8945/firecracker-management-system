import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

/* -------------------------------------------------------------------------- */
/* SUPPLIER                                                                    */
/* -------------------------------------------------------------------------- */

export interface Supplier extends PartyFormValues {
  _id: string;

  supplierCode: string;

  openingBalance: number;

  totalPurchases: number;

  totalPaid: number;

  totalDue: number;

  currentDue: number;

  lastPurchaseDate?: string | null;

  createdAt: string;

  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* SUPPLIER BALANCE                                                            */
/* -------------------------------------------------------------------------- */

export interface SupplierBalance {
  supplierId: string;

  supplierCode: string;

  supplierName: string;

  openingBalance: number;

  totalPurchases: number;

  totalPaid: number;

  totalDue: number;

  totalSupplierPayments: number;

  currentDue: number;

  lastPurchaseDate: string | null;
}

/* -------------------------------------------------------------------------- */
/* PAGINATION                                                                  */
/* -------------------------------------------------------------------------- */

export interface Pagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
}

/* -------------------------------------------------------------------------- */
/* LIST RESPONSE                                                               */
/* -------------------------------------------------------------------------- */

export interface SupplierListResponse {
  items: Supplier[];

  pagination: Pagination;
}

/* -------------------------------------------------------------------------- */
/* FORM                                                                        */
/* -------------------------------------------------------------------------- */

export type SupplierFormData = PartyFormValues;
