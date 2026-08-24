import { Router } from "express";

import SubCategoryController from "../controllers/sub-category.controller.js";

import { authenticate } from "../../auth/middleware/auth.middleware.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/* CREATE                                                                     */
/* -------------------------------------------------------------------------- */

router.post("/", authenticate, SubCategoryController.create);

/* -------------------------------------------------------------------------- */
/* GET ALL                                                                    */
/* -------------------------------------------------------------------------- */

router.get("/", authenticate, SubCategoryController.getAll);

/* -------------------------------------------------------------------------- */
/* GET BY ID                                                                  */
/* -------------------------------------------------------------------------- */

router.get("/:id", authenticate, SubCategoryController.getById);

/* -------------------------------------------------------------------------- */
/* UPDATE                                                                     */
/* -------------------------------------------------------------------------- */

router.put("/:id", authenticate, SubCategoryController.update);

/* -------------------------------------------------------------------------- */
/* DELETE                                                                     */
/* -------------------------------------------------------------------------- */

router.delete("/:id", authenticate, SubCategoryController.delete);

export default router;
