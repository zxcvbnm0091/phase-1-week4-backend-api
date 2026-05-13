import express from "express";
import AuthController from "../controllers/auth.controller.js";
import validate from "../middleware/validate.js";
import { UserZodSchema } from "../models/user.model.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/login", validate(UserZodSchema), AuthController.login);
router.post("/register", validate(UserZodSchema), AuthController.register);
router.post("/logout", protect, AuthController.logout);

export default router;
