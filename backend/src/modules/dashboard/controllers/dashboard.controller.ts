import type { Request, Response } from "express";

import DashboardService from "../services/dashboard.service.js";

class DashboardController {
  async getDashboard(req: Request, res: Response) {
    const user = req.user as {
      userId: string;
    };

    const dashboard = await DashboardService.getDashboard(user.userId);

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  }
}

export default new DashboardController();
