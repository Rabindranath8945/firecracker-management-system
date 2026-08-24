"use client";

import { useCallback, useEffect, useState } from "react";

import BusinessService from "../services/business.service";

import type { Business } from "../types/business.types";

export interface UseCurrentBusinessResult {
  business: Business | null;

  loading: boolean;

  error: string | null;

  refresh: () => Promise<void>;
}

export function useCurrentBusiness(): UseCurrentBusinessResult {
  const [business, setBusiness] = useState<Business | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await BusinessService.getCurrent();

      setBusiness(result);
    } catch (error) {
      console.error("Failed to load current business:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load current business.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    business,
    loading,
    error,
    refresh,
  };
}

export default useCurrentBusiness;
