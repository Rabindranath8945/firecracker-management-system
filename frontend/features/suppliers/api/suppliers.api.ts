import api from "@/lib/api";

import type {
  Supplier,
  SupplierFormData,
  SupplierListResponse,
  SupplierBalance,
} from "../types/supplier.type";

/* -------------------------------------------------------------------------- */
/* QUERY                                                                      */
/* -------------------------------------------------------------------------- */

export interface SupplierQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  isActive?: boolean;
}

/* -------------------------------------------------------------------------- */
/* BALANCE                                                                     */
/* -------------------------------------------------------------------------- */

interface SupplierBalanceResponse {
  success: boolean;
  message: string;
  data: SupplierBalance;
}

/* -------------------------------------------------------------------------- */
/* RESPONSES                                                                  */
/* -------------------------------------------------------------------------- */

interface SupplierResponse {
  success: boolean;
  message: string;
  data: Supplier;
}

interface SupplierListApiResponse {
  success: boolean;
  message: string;
  data: SupplierListResponse;
}

interface SupplierBalanceApiResponse {
  success: boolean;
  message: string;
  data: SupplierBalanceResponse;
}

interface SupplierDeleteResponse {
  success: boolean;
  message: string;
}

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

export const supplierApi = {
  /* ---------------------------------------------------------------------- */
  /* GET ALL                                                                */
  /* ---------------------------------------------------------------------- */

  async getAll(params: SupplierQueryParams = {}) {
    return api.get<SupplierListApiResponse>("/suppliers", {
      params,
    });
  },

  /* ---------------------------------------------------------------------- */
  /* GET BY ID                                                              */
  /* ---------------------------------------------------------------------- */

  async getById(id: string) {
    return api.get<SupplierResponse>(`/suppliers/${id}`);
  },

  /* ---------------------------------------------------------------------- */
  /* GET BALANCE                                                            */
  /* ---------------------------------------------------------------------- */

  async getBalance(id: string) {
    return api.get<SupplierBalanceResponse>(`/suppliers/${id}/balance`);
  },

  /* ---------------------------------------------------------------------- */
  /* CREATE                                                                 */
  /* ---------------------------------------------------------------------- */

  async create(data: SupplierFormData) {
    return api.post<SupplierResponse>("/suppliers", data);
  },

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                 */
  /* ---------------------------------------------------------------------- */

  async update(id: string, data: Partial<SupplierFormData>) {
    return api.put<SupplierResponse>(`/suppliers/${id}`, data);
  },

  /* ---------------------------------------------------------------------- */
  /* DELETE                                                                 */
  /* ---------------------------------------------------------------------- */

  async remove(id: string) {
    return api.delete<SupplierDeleteResponse>(`/suppliers/${id}`);
  },
};
