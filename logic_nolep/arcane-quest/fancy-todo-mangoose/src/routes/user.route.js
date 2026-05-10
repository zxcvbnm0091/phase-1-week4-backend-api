import express from "express";
import UserController from "../controllers/user.controller.js";
const router = express.Router();

router.route("/").get(UserController.getUser).post(UserController.createUser);
router.patch("/:id", protect, UserController.updateUser);
router.delete("/deleteUser/:id", protect, UserController.deleteUser);
