import express from "express";
import categoryController from "../controllers/category.controller";
import validate from "../middlewares/validate";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "../dtos/category.dto";
import passport from "../config/passport";
import { authorizeRoles } from "../middlewares/auth.middleware";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  categoryController.getAllCategory,
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  categoryController.getCategoryById,
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN"),
  validate(CreateCategorySchema),
  categoryController.createCategory,
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN"),
  validate(UpdateCategorySchema),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN"),
  categoryController.deleteCategory,
);

export default router;
