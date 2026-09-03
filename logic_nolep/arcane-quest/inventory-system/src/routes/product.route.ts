import express from "express";
import productController from "../controllers/product.controller";
import validate from "../middlewares/validate";
import { CreateProductSchema, UpdateProductSchema } from "../dtos/product.dto";
import passport from "../config/passport";
const router = express.Router();

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  productController.getAllProduct,
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  productController.getProductById,
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(CreateProductSchema),
  productController.createProduct,
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(UpdateProductSchema),
  productController.updateProduct,
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  productController.deleteProduct,
);

export default router;
