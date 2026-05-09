import express from "express";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
import ProfileController from "../controllers/profileController.js";

router.get("/me", protect, ProfileController.getProfile);
router.patch("/me", protect, ProfileController.updateProfile);

export default router;
