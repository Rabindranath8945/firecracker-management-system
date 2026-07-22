import { Router } from "express";

import SubCategoryController from "../controllers/sub-category.controller.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, SubCategoryController.create);

router.get("/", authenticate, SubCategoryController.getAll);

router.get("/:id", authenticate, SubCategoryController.getById);

router.put("/:id", authenticate, SubCategoryController.update);

router.delete("/:id", authenticate, SubCategoryController.delete);

export default router;
