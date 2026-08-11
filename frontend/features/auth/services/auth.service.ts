import { deviceService } from "@/libs/device";

import { authApi } from "../api/auth.api";

import type { AuthResponse, User } from "../types/auth.types";

class AuthService {
  async googleLogin(credential: string): Promise<AuthResponse> {
    const deviceId = deviceService.getDeviceId();

    const response = await authApi.googleLogin({
      credential,
      deviceId,
    });

    const auth = response.data.data;

    localStorage.setItem("accessToken", auth.accessToken);

    if (auth.refreshToken) {
      localStorage.setItem("refreshToken", auth.refreshToken);
    }

    return auth;
  }

  async refresh(): Promise<{ accessToken: string }> {
    const response = await authApi.refresh();

    const auth = response.data.data;

    localStorage.setItem("accessToken", auth.accessToken);

    return auth;
  }

  async me(): Promise<User> {
    const response = await authApi.me();

    return response.data.data;
  }

  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }
}

export default new AuthService();
