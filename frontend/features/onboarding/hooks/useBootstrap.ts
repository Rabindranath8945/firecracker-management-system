"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import authService from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useBootstrap() {
  const router = useRouter();

  const store = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        /* ------------------------------------------------------------------ */
        /*                            Splash Delay                            */
        /* ------------------------------------------------------------------ */

        await new Promise((resolve) => setTimeout(resolve, 1800));

        if (!mounted) return;

        /* ------------------------------------------------------------------ */
        /*                         Onboarding Check                           */
        /* ------------------------------------------------------------------ */

        const onboardingCompleted =
          localStorage.getItem("onboarding-completed") === "true";

        if (!onboardingCompleted) {
          router.replace("/onboarding");
          return;
        }

        /* ------------------------------------------------------------------ */
        /*                      Authentication Check                          */
        /* ------------------------------------------------------------------ */

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          router.replace("/login");
          return;
        }

        /* ------------------------------------------------------------------ */
        /*                        Load Current User                           */
        /* ------------------------------------------------------------------ */

        const user = await authService.me();

        if (!mounted) return;

        store.setUser(user);

        /* ------------------------------------------------------------------ */
        /*                     Security Check (Version 1.1)                   */
        /* ------------------------------------------------------------------ */

        // const security = await securityService.get();
        //
        // if (security.appLockEnabled) {
        //   router.replace("/lock");
        //   return;
        // }

        /* ------------------------------------------------------------------ */
        /*                            Dashboard                              */
        /* ------------------------------------------------------------------ */

        router.replace("/dashboard");
      } catch (error) {
        console.error("Bootstrap failed:", error);

        store.logout();

        router.replace("/login");
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [router, store]);
}
