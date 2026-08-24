"use client";

import { useCallback, useEffect, useState } from "react";

import api from "@/lib/api";

export type BackendStatus = "checking" | "connected" | "disconnected";

interface BackendStatusState {
  status: BackendStatus;
  lastCheckedAt: Date | null;
}

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>("checking");

  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null);

  const checkBackend = useCallback(async () => {
    try {
      setStatus("checking");

      await api.get("/health", {
        timeout: 5000,
      });

      setStatus("connected");
      setLastCheckedAt(new Date());
    } catch (error) {
      console.error("Backend health check failed:", error);

      setStatus("disconnected");
      setLastCheckedAt(new Date());
    }
  }, []);

  useEffect(() => {
    void checkBackend();

    const interval = window.setInterval(() => {
      void checkBackend();
    }, 30_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [checkBackend]);

  return {
    status,
    lastCheckedAt,
    isConnected: status === "connected",
    isDisconnected: status === "disconnected",
    isChecking: status === "checking",
    checkBackend,
  };
}
