"use client";

import { useRouter } from "next/navigation";

import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const router = useRouter();

  const store = useAuthStore();

  const loginWithGoogle = async (credential: string) => {
    const result = await authService.googleLogin(credential);

    store.setUser(result.user);
    store.setAccessToken(result.accessToken);
    store.setRefreshToken(result.refreshToken);

    router.replace("/dashboard");
  };

  const logout = async () => {
    await authService.logout();

    store.logout();

    router.replace("/login");
  };

  return {
    loginWithGoogle,
    logout,
  };
}
