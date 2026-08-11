"use client";

import { useRouter } from "next/navigation";

import authService from "../services/auth.service";
import bootstrapService from "../services/bootstrap.service";
import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const router = useRouter();

  const store = useAuthStore();

  /* -------------------------------------------------------------------------- */
  /*                             Google Login                                   */
  /* -------------------------------------------------------------------------- */

  const loginWithGoogle = async (credential: string) => {
    try {
      store.setLoading(true);

      const result = await authService.googleLogin(credential);

      /* ---------------------------------------------------------------------- */
      /*                           Save Authentication                          */
      /* ---------------------------------------------------------------------- */

      store.setUser(result.user);

      store.setAccessToken(result.accessToken);

      store.setRefreshToken(result.refreshToken);

      /* ---------------------------------------------------------------------- */
      /*                           Bootstrap App                                */
      /* ---------------------------------------------------------------------- */

      const next = await bootstrapService.initialize();

      switch (next.type) {
        case "ONBOARDING":
          router.replace("/onboarding?step=business");
          return;

        case "SELECT_BUSINESS":
          router.replace("/business/select");
          return;

        case "DASHBOARD":
          router.replace("/dashboard");
          return;

        default:
          router.replace("/dashboard");
          return;
      }
    } catch (error) {
      console.error("Google login failed:", error);

      store.logout();

      throw error;
    } finally {
      store.setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                 Logout                                     */
  /* -------------------------------------------------------------------------- */

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      store.logout();

      router.replace("/login");
    }
  };

  return {
    loginWithGoogle,
    logout,
  };
}
