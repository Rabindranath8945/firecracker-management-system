import { Router } from "express";

import { authenticate } from "../../../common/middleware/authenticate.js";
import { authController } from "../controllers/auth.controller.js";

const router = Router();

/**
 * Google Authentication
 */
router.post("/google", authController.googleLogin);

/**
 * Refresh Access Token
 */
router.post("/refresh", authController.refresh);

/**
 * Logout
 */
router.post("/logout", authController.logout);

/**
 * Current Logged-in User
 */
router.get("/me", authenticate, authController.me);

export default router;
