import { dashboardApi } from "../api/dashboard.api";

import type { DashboardSummary } from "../types/dashboard.type";

class DashboardService {
  async getDashboard(): Promise<DashboardSummary> {
    const response = await dashboardApi.getDashboard();

    return response.data.data;
  }
}

export default new DashboardService();
