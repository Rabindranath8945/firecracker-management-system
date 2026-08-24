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
import userRoutes from "../modules/user/routes/user.routes.js";
import businessRoutes from "../modules/business/routes/business.routes.js";
import joinRequestRoutes from "../modules/join-request/routes/join-request.routes.js";
import dashboardRoutes from "../modules/dashboard/routes/dashboard.routes.js";
import customerPaymentRoutes from "../modules/customer/routes/customer-payment.routes.js";
import supplierPaymentRoutes from "../modules/supplier/routes/supplier-payment.routes.js";
import syncRouter from "../modules/sync/routes/sync.routes.js";
import notificationRoutes from "../modules/notification/routes/notification.routes.js";
import invitationRoutes from "../modules/invitation/routes/invitation.routes.js";
import importExportRoutes from "../modules/import-export/routes/import-export.routes.js";

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
// Customer Payment Routes
router.use("/customer-payments", customerPaymentRoutes);
// Supplier Routes
router.use("/suppliers", supplierRoutes);
// Reports Routes
router.use("/reports", reportRoutes);
// Expense Routes
router.use("/expenses", expenseRoutes);
// Purchase Routes
router.use("/purchases", purchaseRoutes);
// Supplier Payment Routes
router.use("/api/supplier-payments", supplierPaymentRoutes);
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

// User Routes
router.use("/users", userRoutes);
// Business Rotes
router.use("/business", businessRoutes);
// Join Request Routes
router.use("/join-requests", joinRequestRoutes);
// Dashboard Routes
router.use("/dashboard", dashboardRoutes);
// Sync Routes
router.use("/sync", syncRouter);
// Notification Routes
router.use("/notifications", notificationRoutes);
// Invitation Routes
router.use("/invitations", invitationRoutes);
// Import / Export Routes
router.use("/import-export", importExportRoutes);

export default router;
