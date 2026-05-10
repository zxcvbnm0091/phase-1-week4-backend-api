import express from "express";
import userRoute from "./user.route";
import todoRoute from "./todo.route";
const router = express.Router();

router.use("/user", userRoute);
router.use("/todo", todoRoute);
