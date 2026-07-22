import { Router } from "express";

import ProductController from "../controllers/product.controller.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { productUpload } from "../../../common/uploads/index.js";
import { excelUploadMiddleware } from "../../../common/excel/index.js";

const router = Router();

/**
 * Product Routes
 */

router.post(
  "/",
  authenticate,
  ProductController.create.bind(ProductController),
);

router.get("/", authenticate, ProductController.getAll.bind(ProductController));
router.get("/export", authenticate, ProductController.exportExcel);
router.post(
  "/import",
  authenticate,
  excelUploadMiddleware.single("file"),
  ProductController.importExcel,
);
router.post(
  "/upload",
  authenticate,
  productUpload.single("image"),
  ProductController.uploadImage,
);

router.get(
  "/:id",
  authenticate,
  ProductController.getById.bind(ProductController),
);

router.put(
  "/:id",
  authenticate,
  ProductController.update.bind(ProductController),
);

router.delete(
  "/:id",
  authenticate,
  ProductController.delete.bind(ProductController),
);

export default router;
