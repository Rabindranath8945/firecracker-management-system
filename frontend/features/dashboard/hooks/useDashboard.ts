"use client";

import { useCallback, useEffect, useState } from "react";

import dashboardService from "../services/dashboard.service";

import type { DashboardSummary } from "../types/dashboard.type";

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await dashboardService.getDashboard();

      setDashboard(data);
    } catch (error) {
      console.error(error);

      setError("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,
    loading,
    error,
    refresh: loadDashboard,
  };
}
