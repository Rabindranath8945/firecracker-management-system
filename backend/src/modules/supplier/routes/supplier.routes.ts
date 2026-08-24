import { Router } from "express";

import SupplierController from "../controllers/supplier.controller.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { asyncHandler } from "../../../common/utils/async-handler.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/* CREATE                                                                     */
/* -------------------------------------------------------------------------- */

router.post("/", authenticate, asyncHandler(SupplierController.create));

/* -------------------------------------------------------------------------- */
/* GET ALL                                                                    */
/* -------------------------------------------------------------------------- */

router.get("/", authenticate, asyncHandler(SupplierController.getAll));

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

router.get(
  "/export",
  authenticate,
  asyncHandler(SupplierController.exportExcel),
);

/* -------------------------------------------------------------------------- */
/* IMPORT                                                                     */
/* -------------------------------------------------------------------------- */

router.post(
  "/import",
  authenticate,
  asyncHandler(SupplierController.importExcel),
);

/* -------------------------------------------------------------------------- */
/* BALANCE                                                                     */
/* IMPORTANT: Keep this BEFORE /:id                                            */
/* -------------------------------------------------------------------------- */

router.get(
  "/:id/balance",
  authenticate,
  asyncHandler(SupplierController.getBalance),
);

/* -------------------------------------------------------------------------- */
/* GET BY ID                                                                  */
/* -------------------------------------------------------------------------- */

router.get("/:id", authenticate, asyncHandler(SupplierController.getById));

/* -------------------------------------------------------------------------- */
/* UPDATE                                                                     */
/* -------------------------------------------------------------------------- */

router.put("/:id", authenticate, asyncHandler(SupplierController.update));

/* -------------------------------------------------------------------------- */
/* DELETE                                                                     */
/* -------------------------------------------------------------------------- */

router.delete("/:id", authenticate, asyncHandler(SupplierController.delete));

export default router;
