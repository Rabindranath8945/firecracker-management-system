import { Router } from "express";

import NotificationController from "../controllers/notification.controller.js";

import { authenticate } from "../../../common/middleware/authenticate.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                    Find                                    */
/* -------------------------------------------------------------------------- */

router.get("/", authenticate, NotificationController.get);

router.get("/latest", authenticate, NotificationController.latest);

router.get("/unread", authenticate, NotificationController.unread);

router.get("/unread-count", authenticate, NotificationController.unreadCount);

/* -------------------------------------------------------------------------- */
/*                                   Update                                   */
/* -------------------------------------------------------------------------- */

router.patch("/read-all", authenticate, NotificationController.markAllRead);

router.patch("/:id/read", authenticate, NotificationController.markRead);

router.patch("/:id", authenticate, NotificationController.update);

/* -------------------------------------------------------------------------- */
/*                                   Create                                   */
/* -------------------------------------------------------------------------- */

router.post("/", authenticate, NotificationController.create);

/* -------------------------------------------------------------------------- */
/*                                   Delete                                   */
/* -------------------------------------------------------------------------- */

router.delete("/clear/all", authenticate, NotificationController.clear);

/* -------------------------------------------------------------------------- */
/*                                   Single                                   */
/* -------------------------------------------------------------------------- */

router.get("/:id", authenticate, NotificationController.getById);

export default router;
