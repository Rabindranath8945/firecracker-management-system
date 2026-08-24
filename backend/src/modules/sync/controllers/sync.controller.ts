import type { Request, Response } from "express";

import SyncService from "../services/sync.service.js";

import type { SyncRequest } from "../types/sync.types.js";

class SyncController {
  async sync(req: Request, res: Response) {
    const user = req.user as {
      userId: string;
    };

    const body = req.body as SyncRequest;

    const changes = Array.isArray(body?.changes) ? body.changes : [];

    const result = await SyncService.sync(user.userId, changes);

    return res.status(200).json({
      success: result.success,
      data: result,
    });
  }
}

export default new SyncController();
