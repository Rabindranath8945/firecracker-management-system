"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import authService from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import BootstrapService from "@/features/auth/services/bootstrap.service";

export function useBootstrap() {
  const router = useRouter();
  const store = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        /* ------------------------------------------------------------------ */
        /* Splash delay                                                       */
        /* ------------------------------------------------------------------ */

        await new Promise((resolve) => setTimeout(resolve, 1800));

        if (!mounted) {
          return;
        }

        /* ------------------------------------------------------------------ */
        /* Authentication                                                     */
        /* ------------------------------------------------------------------ */

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          router.replace("/login");
          return;
        }

        /* ------------------------------------------------------------------ */
        /* Load current user                                                  */
        /* ------------------------------------------------------------------ */

        const user = await authService.me();

        if (!mounted) {
          return;
        }

        store.setUser(user);

        /* ------------------------------------------------------------------ */
        /* Determine application destination                                  */
        /* ------------------------------------------------------------------ */

        const result = await BootstrapService.initialize();

        if (!mounted) {
          return;
        }

        switch (result.type) {
          case "ONBOARDING":
            router.replace("/onboarding");
            return;

          case "SELECT_BUSINESS":
            router.replace("/business/select");
            return;

          case "DASHBOARD":
            router.replace("/dashboard");
            return;

          default:
            router.replace("/login");
            return;
        }
      } catch (error) {
        console.error("Bootstrap failed:", error);

        if (!mounted) {
          return;
        }

        store.logout();

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        router.replace("/login");
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, [router, store]);
}
