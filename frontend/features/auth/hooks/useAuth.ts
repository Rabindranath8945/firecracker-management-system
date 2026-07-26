"use client";

import { useRouter } from "next/navigation";

import authService from "../services/auth.service";
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
      /*                           Save Authentication                           */
      /* ---------------------------------------------------------------------- */

      store.setUser(result.user);

      store.setAccessToken(result.accessToken);

      store.setRefreshToken(result.refreshToken);

      /* ---------------------------------------------------------------------- */
      /*                           Selected Flow                                */
      /* ---------------------------------------------------------------------- */

      const flow = sessionStorage.getItem("auth-flow");

      /* ---------------------------------------------------------------------- */
      /*                         Create Business Flow                           */
      /* ---------------------------------------------------------------------- */

      if (flow === "create") {
        sessionStorage.removeItem("auth-flow");

        router.replace("/onboarding?step=business");

        return;
      }

      /* ---------------------------------------------------------------------- */
      /*                          Join Business Flow                            */
      /* ---------------------------------------------------------------------- */

      if (flow === "join") {
        sessionStorage.removeItem("auth-flow");

        if (result.user.business) {
          router.replace("/dashboard");
        } else {
          router.replace("/join-business/search");
        }

        return;
      }

      /* ---------------------------------------------------------------------- */
      /*                           Default Flow                                 */
      /* ---------------------------------------------------------------------- */

      sessionStorage.removeItem("auth-flow");

      router.replace("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);

      store.logout();

      sessionStorage.removeItem("auth-flow");

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

      sessionStorage.removeItem("auth-flow");

      router.replace("/login");
    }
  };

  return {
    loginWithGoogle,
    logout,
  };
}
