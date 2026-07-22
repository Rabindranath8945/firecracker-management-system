import { Router } from "express";

import { healthRoutes } from "../modules/health/index.js";
import { authRoutes } from "../modules/auth/index.js";

// Routes
import productRoutes from "../modules/product/index.js";
import categoryRoutes from "../modules/category/index.js";
import subCategoryRoutes from "../modules/sub-category/index.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

// Products Routes
router.use("/products", productRoutes);
// Category Routes
router.use("/categories", categoryRoutes);
// Sub Category Routes
router.use("/sub-categories", subCategoryRoutes);

export default router;
