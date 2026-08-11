import { Router } from "express";

import SalesController from "../controllers/sales.controller.js";

import { authenticate } from "../../../common/middleware/authenticate.js";

const router = Router();

router.use(authenticate);

/* -------------------------------------------------------------------------- */
/*                                   Create                                   */
/* -------------------------------------------------------------------------- */

router.post("/", SalesController.create);

/* -------------------------------------------------------------------------- */
/*                                   Special                                  */
/* -------------------------------------------------------------------------- */

router.get("/summary", SalesController.getSummary);

router.get("/next-code", SalesController.getNextCode);

router.get("/export", SalesController.exportExcel);

router.post("/import", SalesController.importExcel);

/* -------------------------------------------------------------------------- */
/*                                    List                                    */
/* -------------------------------------------------------------------------- */

router.get("/", SalesController.getAll);

/* -------------------------------------------------------------------------- */
/*                              Dynamic Routes                                */
/* -------------------------------------------------------------------------- */

router.get("/:id", SalesController.getById);

router.put("/:id", SalesController.update);

router.delete("/:id", SalesController.delete);

export default router;
