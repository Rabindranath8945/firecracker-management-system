import { Router } from "express";

import CategoryController from "../controllers/category.controller.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, CategoryController.create);

router.get("/", authenticate, CategoryController.getAll);

router.get("/:id", authenticate, CategoryController.getById);

router.put("/:id", authenticate, CategoryController.update);

router.delete("/:id", authenticate, CategoryController.delete);

export default router;
