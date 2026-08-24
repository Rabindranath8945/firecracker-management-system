import { Request, Response } from "express";
import { Types } from "mongoose";

import NotificationService from "../services/notification.service.js";

class NotificationController {
  private handleError(res: Response, error: unknown, message: string) {
    console.error(message, error);

    return res.status(500).json({
      success: false,
      message,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Find                                    */
  /* -------------------------------------------------------------------------- */

  get = async (req: Request, res: Response) => {
    try {
      const notifications = await NotificationService.get();

      return res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch notifications.");
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const notification = await NotificationService.getById(
        String(req.params.id),
      );

      return res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch notification.");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Latest                                   */
  /* -------------------------------------------------------------------------- */

  latest = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      const requestedLimit = Number(req.query.limit);

      const limit =
        Number.isFinite(requestedLimit) && requestedLimit > 0
          ? Math.min(requestedLimit, 50)
          : 20;

      const notifications = await NotificationService.latestForUser(
        userId,
        limit,
      );

      return res.status(200).json({
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
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Unread                                   */
  /* -------------------------------------------------------------------------- */

  unread = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      const notifications = await NotificationService.unread(userId);

      return res.status(200).json({
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
  };

  /* -------------------------------------------------------------------------- */
  /*                               Unread Count                                 */
  /* -------------------------------------------------------------------------- */

  unreadCount = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      const count = await NotificationService.unreadCount(userId);

      return res.status(200).json({
        success: true,
        data: {
          unread: count,
        },
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to fetch unread count.");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Create                                   */
  /* -------------------------------------------------------------------------- */

  create = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      const userObjectId = new Types.ObjectId(userId);

      const notification = await NotificationService.create(
        userObjectId.toString(),
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
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Update                                   */
  /* -------------------------------------------------------------------------- */

  update = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      const notification = await NotificationService.update(
        String(req.params.id),
        userId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Notification updated successfully.",
        data: notification,
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to update notification.");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                  Mark Read                                 */
  /* -------------------------------------------------------------------------- */

  markRead = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      const notification = await NotificationService.markRead(
        String(req.params.id),
        userId,
      );

      return res.status(200).json({
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
  };

  /* -------------------------------------------------------------------------- */
  /*                              Mark All Read                                 */
  /* -------------------------------------------------------------------------- */

  markAllRead = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      await NotificationService.markAllRead(userId);

      return res.status(200).json({
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
  };

  /* -------------------------------------------------------------------------- */
  /*                                    Clear                                   */
  /* -------------------------------------------------------------------------- */

  clear = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      await NotificationService.clear(userId);

      return res.status(200).json({
        success: true,
        message: "Notifications cleared successfully.",
      });
    } catch (error) {
      return this.handleError(res, error, "Failed to clear notifications.");
    }
  };
}

export default new NotificationController();
