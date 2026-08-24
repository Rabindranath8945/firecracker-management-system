import api from "@/lib/api";

import type { ApiResponse } from "@/types/api.types";

import type {
  Business,
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from "../types/business.types";

export const businessApi = {
  create(payload: CreateBusinessRequest) {
    return api.post<ApiResponse<Business>>("/business", payload);
  },

  getCurrent() {
    return api.get<ApiResponse<Business | null>>("/business/current");
  },

  getMine() {
    return api.get<ApiResponse<Business[]>>("/business/me");
  },

  switchBusiness(id: string) {
    return api.patch<ApiResponse<Business>>(`/business/${id}/switch`);
  },

  search(query: string) {
    return api.get<ApiResponse<Business[]>>("/business/search", {
      params: {
        query,
      },
    });
  },

  update(id: string, payload: UpdateBusinessRequest) {
    return api.put<ApiResponse<Business>>(`/business/${id}`, payload);
  },
};
