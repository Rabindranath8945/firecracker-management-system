import { apiClient } from "@/services/http";

import type { ApiResponse } from "@/types/api.types";

import type {
  JoinRequest,
  CreateJoinRequest,
} from "../types/join-request.types";

export const joinRequestApi = {
  create(payload: CreateJoinRequest) {
    return apiClient.post<ApiResponse<JoinRequest>>("/join-request", payload);
  },

  pending() {
    return apiClient.get<ApiResponse<JoinRequest[]>>("/join-request/pending");
  },

  approve(id: string) {
    return apiClient.patch<ApiResponse<JoinRequest>>(
      `/join-request/${id}/approve`,
    );
  },

  reject(id: string) {
    return apiClient.patch<ApiResponse<JoinRequest>>(
      `/join-request/${id}/reject`,
    );
  },
};
