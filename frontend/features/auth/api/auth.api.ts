import { apiClient } from "@/services/http";
import type { ApiResponse } from "@/types/api.types";
import type { AuthResponse, GoogleLoginRequest } from "../types/auth.types";

export const authApi = {
  googleLogin(payload: GoogleLoginRequest) {
    return apiClient.post<ApiResponse<AuthResponse>>("/auth/google", payload);
  },

  refresh(refreshToken: string) {
    return apiClient.post<ApiResponse<{ accessToken: string }>>(
      "/auth/refresh",
      {
        refreshToken,
      },
    );
  },

  logout(refreshToken: string) {
    return apiClient.post<ApiResponse<null>>("/auth/logout", {
      refreshToken,
    });
  },

  me(accessToken: string) {
    return apiClient.get<ApiResponse<AuthResponse["user"]>>("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};
