import express from "express";
import orderController from "../controllers/order.controller";
import validate from "../middlewares/validate";
import { CreateOrderSchema, UpdateOrderSchema } from "../dtos/order.dto";
import OrderItemController from "../controllers/order-item.controller";
import passport from "../config/passport";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  orderController.getAllOrder,
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  orderController.getOrderById,
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(CreateOrderSchema),
  orderController.createOrder,
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(UpdateOrderSchema),
  orderController.updateOrder,
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  orderController.deleteOrder,
);
router.get(
  "/:orderId/order-items",
  passport.authenticate("jwt", { session: false }),
  OrderItemController.getOrderItemByOrder,
);
export default router;
