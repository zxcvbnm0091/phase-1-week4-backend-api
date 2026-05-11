import express from "express";
import UserController from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/me", UserController.getUserById);
router.patch("/update", UserController.updateUser);
router.delete("/delete", UserController.deleteUser);

router.get("/:id", UserController.getUserById);
router.get("/", UserController.getAllUser);

export default router;
