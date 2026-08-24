import api from "@/lib/api";

import type { ApiResponse } from "@/types/api.types";
import type { AuthResponse, GoogleLoginRequest } from "../types/auth.types";

export const authApi = {
  googleLogin(payload: GoogleLoginRequest) {
    return api.post<ApiResponse<AuthResponse>>("/auth/google", payload);
  },

  refresh() {
    const refreshToken = localStorage.getItem("refreshToken") ?? "";

    return api.post<ApiResponse<{ accessToken: string }>>("/auth/refresh", {
      refreshToken,
    });
  },

  logout() {
    const refreshToken = localStorage.getItem("refreshToken") ?? "";

    return api.post<ApiResponse<null>>("/auth/logout", {
      refreshToken,
    });
  },

  me() {
    return api.get<ApiResponse<AuthResponse["user"]>>("/auth/me");
  },
};
