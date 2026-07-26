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

router.get("/:id", authenticate, NotificationController.getById);

/* -------------------------------------------------------------------------- */
/*                                   Create                                   */
/* -------------------------------------------------------------------------- */

router.post("/", authenticate, NotificationController.create);

/* -------------------------------------------------------------------------- */
/*                                   Update                                   */
/* -------------------------------------------------------------------------- */

router.patch("/:id", authenticate, NotificationController.update);

router.patch("/:id/read", authenticate, NotificationController.markRead);

router.patch("/read-all", authenticate, NotificationController.markAllRead);

/* -------------------------------------------------------------------------- */
/*                                   Delete                                   */
/* -------------------------------------------------------------------------- */

router.delete("/:id", authenticate, NotificationController.delete);

router.delete("/clear/all", authenticate, NotificationController.clear);

export default router;
