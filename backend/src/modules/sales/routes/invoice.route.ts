import { Router } from "express";

import InvoiceController from "../controllers/invoice.controller.js";

import { authenticate } from "../../../common/middleware/authenticate.js";

const router = Router();

router.get("/:id/pdf", authenticate, InvoiceController.download);

export default router;
