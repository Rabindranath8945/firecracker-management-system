import api from "@/lib/api";

import type { ApiResponse } from "@/types/api.types";
import type { DashboardSummary } from "../types/dashboard.type";

export const dashboardApi = {
  getDashboard() {
    return api.get<ApiResponse<DashboardSummary>>("/dashboard", {
      timeout: 8000,
    });
  },
};
