import api from "@/lib/api";

import type { ApiResponse } from "@/types/api.types";

import type {
  JoinRequest,
  CreateJoinRequest,
} from "../types/join-request.types";

export const joinRequestApi = {
  create(payload: CreateJoinRequest) {
    return api.post<ApiResponse<JoinRequest>>("/join-request", payload);
  },

  pending() {
    return api.get<ApiResponse<JoinRequest[]>>("/join-request/pending");
  },

  approve(id: string) {
    return api.patch<ApiResponse<JoinRequest>>(`/join-request/${id}/approve`);
  },

  reject(id: string) {
    return api.patch<ApiResponse<JoinRequest>>(`/join-request/${id}/reject`);
  },
};
