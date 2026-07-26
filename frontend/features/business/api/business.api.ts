import { apiClient } from "@/services/http";

import type { ApiResponse } from "@/types/api.types";

import type {
  Business,
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from "../types/business.types";

export const businessApi = {
  create(payload: CreateBusinessRequest) {
    return apiClient.post<ApiResponse<Business>>("/business", payload);
  },

  getMine() {
    return apiClient.get<ApiResponse<Business>>("/business/me");
  },

  search(query: string) {
    return apiClient.get(`/business/search`, {
      params: {
        query,
      },
    });
  },

  update(id: string, payload: UpdateBusinessRequest) {
    return apiClient.put<ApiResponse<Business>>(`/business/${id}`, payload);
  },
};
