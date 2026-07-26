import { Request, Response } from "express";
import { Types } from "mongoose";

import NotificationService from "../services/notification.service.js";

class NotificationController {
  private handleError(res: Response, error: unknown, message: string) {
    return res.status(500).json({
      success: false,
      message,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Find                                    */
  /* -------------------------------------------------------------------------- */

  async get(req: Request, res: Response) {
    try {
      const notifications = await NotificationService.get();

      return res.json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch notifications.");
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const notification = await NotificationService.getById(
        String(req.params.id),
      );

      return res.json({
        success: true,
        data: notification,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch notification.");
    }
  }

  async latest(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 20;

      const notifications = await NotificationService.latest(limit);

      return res.json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
        "Failed to fetch latest notifications.",
      );
    }
  }

  async unread(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const notifications = await NotificationService.unread(req.user.userId);

      return res.json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
        "Failed to fetch unread notifications.",
      );
    }
  }

  async unreadCount(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const count = await NotificationService.unreadCount(req.user.userId);

      return res.json({
        success: true,
        data: {
          unread: count,
        },
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch unread count.");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Create                                   */
  /* -------------------------------------------------------------------------- */

  async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const userId = new Types.ObjectId(req.user.userId);

      const notification = await NotificationService.create(
        userId.toString(),
        req.body,
      );

      return res.status(201).json({
        success: true,
        message: "Notification created successfully.",
        data: notification,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to create notification.");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Update                                   */
  /* -------------------------------------------------------------------------- */

  async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const notification = await NotificationService.update(
        String(req.params.id),
        req.user.userId,
        req.body,
      );

      return res.json({
        success: true,
        message: "Notification updated successfully.",
        data: notification,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update notification.");
    }
  }

  async markRead(req: Request, res: Response) {
    try {
      const notification = await NotificationService.markRead(
        String(req.params.id),
      );

      return res.json({
        success: true,
        message: "Notification marked as read.",
        data: notification,
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
        "Failed to mark notification as read.",
      );
    }
  }

  async markAllRead(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      await NotificationService.markAllRead(req.user.userId);

      return res.json({
        success: true,
        message: "All notifications marked as read.",
      });
    } catch (error) {
      return this.handleError(
        res,
        error,
        "Failed to mark all notifications as read.",
      );
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */

  async delete(req: Request, res: Response) {
    try {
      const notification = await NotificationService.delete(
        String(req.params.id),
      );

      return res.json({
        success: true,
        message: "Notification deleted successfully.",
        data: notification,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to delete notification.");
    }
  }

  async clear(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      await NotificationService.clear(req.user.userId);

      return res.json({
        success: true,
        message: "Notifications cleared successfully.",
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to clear notifications.");
    }
  }
}

export default new NotificationController();
