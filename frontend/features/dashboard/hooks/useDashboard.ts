"use client";

import { useCallback, useEffect, useState } from "react";

import { Capacitor } from "@capacitor/core";

import dashboardService from "../services/dashboard.service";

import { OFFLINE_DATA_CHANGED_EVENT } from "@/libs/offline/events/offline.events";

import type { DashboardSummary } from "../types/dashboard.type";

const DASHBOARD_CACHE_KEY = "erp_dashboard_cache";

/* -------------------------------------------------------------------------- */
/* WEB CACHE                                                                  */
/* -------------------------------------------------------------------------- */

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

function saveDashboardCache(dashboard: DashboardSummary): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(dashboard));
  } catch (error) {
    console.error("Failed to save dashboard cache:", error);
  }
}

/* -------------------------------------------------------------------------- */
/* HOOK                                                                       */
/* -------------------------------------------------------------------------- */

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [isOffline, setIsOffline] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* LOAD                                                                      */
  /* ------------------------------------------------------------------------ */

  const loadDashboard = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError(null);

      /*
       * Native + offline = SQLite.
       */
      if (
        Capacitor.isNativePlatform() &&
        typeof navigator !== "undefined" &&
        !navigator.onLine
      ) {
        const data = await dashboardService.getOfflineDashboard();

        setDashboard(data);
        setIsOffline(true);
        setError(null);

        return;
      }

      /*
       * Online = existing backend API.
       */
      const data = await dashboardService.getDashboard();

      setDashboard(data);

      /*
       * Keep web cache as a fallback.
       */
      saveDashboardCache(data);

      setIsOffline(false);
      setError(null);
    } catch (error) {
      console.error("Dashboard request failed:", error);

      /*
       * Native fallback.
       */
      if (Capacitor.isNativePlatform()) {
        try {
          const data = await dashboardService.getOfflineDashboard();

          setDashboard(data);
          setIsOffline(true);
          setError(null);

          return;
        } catch (offlineError) {
          console.error("Offline dashboard failed:", offlineError);
        }
      }

      /*
       * Web fallback.
       */
      const cachedDashboard = getCachedDashboard();

      if (cachedDashboard) {
        setDashboard(cachedDashboard);
        setIsOffline(true);
        setError(null);
      } else {
        setDashboard(null);
        setIsOffline(true);
        setError("Dashboard is currently unavailable.");
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /* INITIAL LOAD                                                              */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (Capacitor.isNativePlatform()) {
      setIsOffline(!navigator.onLine);

      void loadDashboard(true);

      return;
    }

    const cachedDashboard = getCachedDashboard();

    if (cachedDashboard) {
      setDashboard(cachedDashboard);
      setLoading(false);

      if (navigator.onLine) {
        void loadDashboard(false);
      } else {
        setIsOffline(true);
      }

      return;
    }

    void loadDashboard(true);
  }, [loadDashboard]);

  /* ------------------------------------------------------------------------ */
  /* EVENTS                                                                    */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleOffline = () => {
      setIsOffline(true);

      if (Capacitor.isNativePlatform()) {
        void loadDashboard(false);

        return;
      }

      const cachedDashboard = getCachedDashboard();

      if (cachedDashboard) {
        setDashboard(cachedDashboard);
        setError(null);
      }
    };

    const handleOnline = () => {
      setIsOffline(false);

      /*
       * Keep the current Dashboard visible.
       * Refresh silently.
       */
      void loadDashboard(false);
    };

    const handleOfflineDataChanged = () => {
      if (!Capacitor.isNativePlatform()) {
        return;
      }

      void dashboardService
        .getOfflineDashboard()
        .then((data) => {
          setDashboard(data);
          setIsOffline(!navigator.onLine);
          setError(null);
        })
        .catch((error) => {
          console.error("Failed to refresh offline dashboard:", error);
        });
    };

    window.addEventListener("offline", handleOffline);

    window.addEventListener("online", handleOnline);

    window.addEventListener(
      OFFLINE_DATA_CHANGED_EVENT,
      handleOfflineDataChanged,
    );

    return () => {
      window.removeEventListener("offline", handleOffline);

      window.removeEventListener("online", handleOnline);

      window.removeEventListener(
        OFFLINE_DATA_CHANGED_EVENT,
        handleOfflineDataChanged,
      );
    };
  }, [loadDashboard]);

  /* ------------------------------------------------------------------------ */
  /* RETURN                                                                    */
  /* ------------------------------------------------------------------------ */

  return {
    dashboard,
    loading,
    error,
    isOffline,

    refresh: () => loadDashboard(false),
  };
}
