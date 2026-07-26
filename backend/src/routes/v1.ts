import { Router } from "express";

import { healthRoutes } from "../modules/health/index.js";
import { authRoutes } from "../modules/auth/index.js";

// Routes
import productRoutes from "../modules/product/index.js";
import categoryRoutes from "../modules/category/index.js";
import subCategoryRoutes from "../modules/sub-category/index.js";
import customerRoutes from "../modules/customer/index.js";
import supplierRoutes from "../modules/supplier/index.js";
import reportRoutes from "../modules/reports/index.js";
import expenseRoutes from "../modules/expense/index.js";
import purchaseRoutes from "../modules/purchase/index.js";
import salesRoutes from "../modules/sales/index.js";
import invoiceRoutes from "../modules/sales/routes/invoice.route.js";
import { SettingsRoutes } from "../modules/settings/index.js";
import { SecurityRoutes } from "../modules/security/index.js";
import { AppSetupRoutes } from "../modules/app-setup/index.js";
import { BackupRoutes } from "../modules/backup/index.js";
import purchaseOcrRoutes from "../modules/purchase-ocr/routes/purchase-ocr.routes.js";
import userRoutes from "../modules/user/routes/user.routes.js";
import businessRoutes from "../modules/business/routes/business.routes.js";
import joinRequestRoutes from "../modules/join-request/routes/join-request.routes.js";
import dashboardRoutes from "../modules/dashboard/routes/dashboard.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

// Products Routes
router.use("/products", productRoutes);
// Category Routes
router.use("/categories", categoryRoutes);
// Sub Category Routes
router.use("/sub-categories", subCategoryRoutes);
// Customer
router.use("/customers", customerRoutes);
// Supplier Routes
router.use("/suppliers", supplierRoutes);
// Reports Routes
router.use("/reports", reportRoutes);
// Expense Routes
router.use("/expenses", expenseRoutes);
// Purchase Routes
router.use("/purchases", purchaseRoutes);
// Sales Routes
router.use("/sales", salesRoutes);
// Invoice Routes
router.use("/invoice", invoiceRoutes);
// Settings Routes
router.use("/settings", SettingsRoutes);
// Security ROutes
router.use("/security", SecurityRoutes);
// App Setup
router.use("/app-setup", AppSetupRoutes);
// Backup Routes
router.use("/backup", BackupRoutes);
// Purchase Ocr Routes
router.use("/purchase-ocr", purchaseOcrRoutes);
// User Routes
router.use("/users", userRoutes);
// Business Rotes
router.use("/business", businessRoutes);
// Join Request Routes
router.use("/join-requests", joinRequestRoutes);
// Dashboard Routes
router.use("/dashboard", dashboardRoutes);

export default router;
