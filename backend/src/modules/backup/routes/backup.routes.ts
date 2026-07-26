import { Router } from "express";

import BackupController from "../controllers/backup.controller.js";

import { authenticate } from "../../../common/middleware/authenticate.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                                   Query                                    */
/* -------------------------------------------------------------------------- */

router.get("/", authenticate, BackupController.get);

router.get("/history", authenticate, BackupController.history);

router.get("/:id", authenticate, BackupController.getById);

router.get("/:id/download", authenticate, BackupController.download);

/* -------------------------------------------------------------------------- */
/*                                  Commands                                  */
/* -------------------------------------------------------------------------- */

router.post("/", authenticate, BackupController.create);

router.post("/:id/restore", authenticate, BackupController.restore);

router.delete("/:id", authenticate, BackupController.delete);

export default router;
