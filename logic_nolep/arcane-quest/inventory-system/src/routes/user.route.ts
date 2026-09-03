import express from "express";
import UserController from "../controllers/user.controller";
import ProductController from "../controllers/product.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate";
import { CreateUserSchema, UpdateUserSchema } from "../dtos/user.dto";
import OrderController from "../controllers/order.controller";
import passport from "../config/passport";

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN"),
  validate(CreateUserSchema),
  UserController.createUser,
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN"),
  UserController.getAllUser,
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  UserController.getUserById,
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(UpdateUserSchema),
  UserController.updateUser,
);
router.delete(
  "/me",
  passport.authenticate("jwt", { session: false }),
  UserController.deleteOwnAccount,
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("ADMIN"),
  UserController.deleteUser,
);

router.get(
  "/:id/products",
  passport.authenticate("jwt", { session: false }),
  ProductController.getProductByUser,
);
router.get(
  "/:id/orders",
  passport.authenticate("jwt", { session: false }),
  OrderController.getAllOrder,
);

export default router;
