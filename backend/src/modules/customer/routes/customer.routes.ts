import { Router } from "express";

import CustomerController from "../controllers/customer.controller.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

router.post("/", authenticate, asyncHandler(CustomerController.create));

router.get("/", asyncHandler(CustomerController.getAll));

router.get("/export", authenticate, CustomerController.exportExcel);

router.post(
  "/import",
  authenticate,
  asyncHandler(CustomerController.importExcel),
);

router.get("/:id", asyncHandler(CustomerController.getById));

router.put("/:id", authenticate, asyncHandler(CustomerController.update));

router.delete("/:id", authenticate, asyncHandler(CustomerController.delete));

export default router;
