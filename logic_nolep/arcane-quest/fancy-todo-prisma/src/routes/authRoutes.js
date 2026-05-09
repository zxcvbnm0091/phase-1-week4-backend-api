import express from "express";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
import {
  register,
  login,
  logout,
  deleteUser,
} from "../controllers/authController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.delete("/deleteUser", protect, deleteUser);

export default router;
