import { authApi } from "../api/auth.api";
import { deviceService } from "@/libs/device";

import type { AuthResponse, User } from "../types/auth.types";

class AuthService {
  async googleLogin(credential: string): Promise<AuthResponse> {
    const deviceId = deviceService.getDeviceId();

    const response = await authApi.googleLogin({
      credential,
      deviceId,
    });

    return response.data.data;
  }

  async refresh() {
    const response = await authApi.refresh();

    return response.data.data;
  }

  async me() {
    const response = await authApi.me();

    return response.data.data;
  }

  async logout() {
    await authApi.logout();

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export default new AuthService();
