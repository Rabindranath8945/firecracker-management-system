"use client";

import { useCallback, useEffect, useState } from "react";

import dashboardService from "../services/dashboard.service";

import type { DashboardSummary } from "../types/dashboard.type";

const DASHBOARD_CACHE_KEY = "erp_dashboard_cache";

function getCachedDashboard(): DashboardSummary | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const cached = localStorage.getItem(DASHBOARD_CACHE_KEY);

    if (!cached) {
      return null;
    }

    return JSON.parse(cached) as DashboardSummary;
  } catch (error) {
    console.error("Failed to read dashboard cache:", error);

    return null;
  }
}

function saveDashboardCache(dashboard: DashboardSummary) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(dashboard));
  } catch (error) {
    console.error("Failed to save dashboard cache:", error);
  }
}

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

      saveDashboardCache(data);
    } catch (error) {
      console.error("Dashboard request failed:", error);

      /*
       * Keep using the last successfully loaded dashboard.
       */
      const cachedDashboard = getCachedDashboard();

      if (cachedDashboard) {
        setDashboard(cachedDashboard);
      }

      setError("Dashboard is currently unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    /*
     * Load cached dashboard immediately.
     * This allows the ERP shell/header to work offline.
     */
    const cachedDashboard = getCachedDashboard();

    if (cachedDashboard) {
      setDashboard(cachedDashboard);
      setLoading(false);
    }

    /*
     * Then try to refresh from backend.
     */
    void loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,
    loading,
    error,
    refresh: loadDashboard,
  };
}
