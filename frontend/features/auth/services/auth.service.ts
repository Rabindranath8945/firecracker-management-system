import { authApi } from "../api/auth.api";
import { deviceService } from "@/libs/device";

import type { AuthResponse } from "../types/auth.types";

class AuthService {
  async googleLogin(credential: string): Promise<AuthResponse> {
    const deviceId = deviceService.getDeviceId();

    const response = await authApi.googleLogin({
      credential,
      deviceId,
    });

    return response.data.data;
  }

  async logout() {
    await authApi.logout("");
  }
}

export const authService = new AuthService();
