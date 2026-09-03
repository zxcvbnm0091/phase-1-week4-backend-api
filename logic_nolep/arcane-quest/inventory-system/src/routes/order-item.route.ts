import express from "express";
import OrderItemController from "../controllers/order-item.controller";
import validate from "../middlewares/validate";
import passport from "../config/passport";
import {
  CreateOrderItemSchema,
  UpdateOrderItemSchema,
} from "../dtos/order-item.dto";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  OrderItemController.getAll,
);
router.get(
  "/:orderItemId",
  passport.authenticate("jwt", { session: false }),
  OrderItemController.getOrderItemById,
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(CreateOrderItemSchema),
  OrderItemController.createOrderItem,
);
router.put(
  "/:orderItemId",
  passport.authenticate("jwt", { session: false }),
  validate(UpdateOrderItemSchema),
  OrderItemController.updateOrderItem,
);
router.delete(
  "/:orderItemId",
  passport.authenticate("jwt", { session: false }),
  OrderItemController.deleteOrderItem,
);

export default router;
