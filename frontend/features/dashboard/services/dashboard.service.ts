"use client";

import { Capacitor } from "@capacitor/core";

import { dashboardApi } from "../api/dashboard.api";
import { getOfflineDashboard } from "@/libs/offline/store/offline.dashboard";

import type { DashboardSummary } from "../types/dashboard.type";

class DashboardService {
  async getDashboard(): Promise<DashboardSummary> {
    /*
     * Native Capacitor + offline
     * --------------------------
     * Read directly from SQLite.
     */
    if (
      Capacitor.isNativePlatform() &&
      typeof navigator !== "undefined" &&
      !navigator.onLine
    ) {
      return getOfflineDashboard();
    }

    /*
     * Online
     * ------
     * Keep using the existing backend API.
     */
    const response = await dashboardApi.getDashboard();

    return response.data.data;
  }

  /*
   * Explicit offline read.
   *
   * Useful when the dashboard needs to
   * refresh from SQLite without contacting
   * the backend.
   */
  async getOfflineDashboard(): Promise<DashboardSummary> {
    return getOfflineDashboard();
  }
}

export default new DashboardService();
