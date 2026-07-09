"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { deviceService } from "@/libs/device";
import { useAuthStore } from "../store/auth.store";

export function useBootstrap() {
  const router = useRouter();

  const { setLoading } = useAuthStore();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        // 1. Generate installation ID
        deviceService.getDeviceId();

        // 2. Future:
        // Initialize Dexie
        // Restore session
        // Load settings
        // Check App Lock

        await new Promise((resolve) => setTimeout(resolve, 1500));

        router.replace("/login");
      } finally {
        setLoading(false);
        setIsReady(true);
      }
    }

    initialize();
  }, [router, setLoading]);

  return {
    isReady,
  };
}
