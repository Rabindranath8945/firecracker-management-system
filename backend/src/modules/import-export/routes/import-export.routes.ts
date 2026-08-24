import { Router } from "express";

import controller from "../controllers/import-export.controller.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/* IMPORT                                                                     */
/* -------------------------------------------------------------------------- */

router.post("/import", authenticate, controller.importFile.bind(controller));

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

router.get("/export", authenticate, controller.exportData.bind(controller));

export default router;
