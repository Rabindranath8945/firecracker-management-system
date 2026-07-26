import { Router } from "express";

import SalesController from "../controllers/sales.controller.js";

import { authenticate } from "../../../common/middleware/authenticate.js";

const router = Router();

router.use(authenticate);

router.post("/", SalesController.create);

router.get("/", SalesController.getAll);

router.get("/export", SalesController.exportExcel);

router.post("/import", SalesController.importExcel);

router.get("/:id", SalesController.getById);

router.put("/:id", SalesController.update);

router.delete("/:id", SalesController.delete);

export default router;
