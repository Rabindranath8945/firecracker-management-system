"use client";

import { useCallback, useEffect, useState } from "react";

import SecurityService from "../services/security.service";

import type { SecurityProfile } from "../types/security.types";

export function useSecurity() {
  const [security, setSecurity] = useState<SecurityProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const [updatingAppLock, setUpdatingAppLock] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await SecurityService.getSecurityProfile();

      setSecurity(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load security settings.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAppLock = useCallback(async (enabled: boolean) => {
    try {
      setUpdatingAppLock(true);
      setError(null);

      const updated = await SecurityService.updateAppLock({
        enabled,
      });

      setSecurity(updated);

      return updated;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update app lock.";

      setError(message);

      throw error;
    } finally {
      setUpdatingAppLock(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    security,
    loading,
    updatingAppLock,
    error,
    refresh,
    updateAppLock,
  };
}
