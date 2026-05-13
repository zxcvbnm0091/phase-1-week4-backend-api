import express from "express";
import userRoute from "./user.route.js";
import todoRoute from "./todo.route.js";
import profileRoute from "./profile.route.js";
import authRoute from "./auth.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/todos", todoRoute);
router.use("/profile", profileRoute);

export default router;
