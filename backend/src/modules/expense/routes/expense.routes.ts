import { Router } from "express";

import ExpenseController from "../controllers/expense.controller.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { asyncHandler } from "../../../common/utils/async-handler.js";
import { excelUpload } from "../../../common/uploads/middleware/excel-upload.middleware.js";

const router = Router();

router.post("/", authenticate, asyncHandler(ExpenseController.create));

router.get("/", asyncHandler(ExpenseController.getAll));

router.get(
  "/export",
  authenticate,
  asyncHandler(ExpenseController.exportExcel),
);

router.post(
  "/import",
  authenticate,
  excelUpload.single("file"),
  asyncHandler(ExpenseController.importExcel),
);

router.get("/:id", asyncHandler(ExpenseController.getById));

router.put("/:id", authenticate, asyncHandler(ExpenseController.update));

router.delete("/:id", authenticate, asyncHandler(ExpenseController.delete));

export default router;
