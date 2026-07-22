"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useBootstrap() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const onboardingCompleted =
        localStorage.getItem("onboarding-completed") === "true";

      const accessToken = localStorage.getItem("accessToken");

      // First App Launch
      if (!onboardingCompleted) {
        router.replace("/onboarding");
        return;
      }

      // User Not Logged In
      if (!accessToken) {
        router.replace("/login");
        return;
      }

      // Logged In
      router.replace("/dashboard");
    }, 1800);

    return () => clearTimeout(timer);
  }, [router]);
}
