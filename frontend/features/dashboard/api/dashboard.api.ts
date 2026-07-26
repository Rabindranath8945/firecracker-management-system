import { apiClient } from "@/services/http";

import type { ApiResponse } from "@/types/api.types";
import type { DashboardSummary } from "../types/dashboard.type";

export const dashboardApi = {
  getDashboard() {
    return apiClient.get<ApiResponse<DashboardSummary>>("/dashboard");
  },
};
