"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import dashboardService from "../services/dashboard.service";

import type { DashboardSummary } from "../types/dashboard.type";

const DASHBOARD_CACHE_KEY = "erp_dashboard_cache";

interface DashboardContextValue {
  dashboard: DashboardSummary | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(
  undefined,
);

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
    localStorage.setItem(
      DASHBOARD_CACHE_KEY,
      JSON.stringify(dashboard),
    );
  } catch (error) {
    console.error("Failed to save dashboard cache:", error);
  }
}

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dashboard, setDashboard] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setError(null);

      const data = await dashboardService.getDashboard();

      setDashboard(data);

      saveDashboardCache(data);
    } catch (error) {
      console.error("Dashboard request failed:", error);

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
    const cachedDashboard = getCachedDashboard();

    if (cachedDashboard) {
      setDashboard(cachedDashboard);
      setLoading(false);
    }

    void loadDashboard();
  }, [loadDashboard]);

  const value: DashboardContextValue = {
    dashboard,
    loading,
    error,
    refresh: loadDashboard,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard must be used inside DashboardProvider.",
    );
  }

  return context;
}