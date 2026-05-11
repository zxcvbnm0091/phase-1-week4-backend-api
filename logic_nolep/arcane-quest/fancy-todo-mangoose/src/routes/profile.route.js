import express from "express";
import ProfileController from "../controllers/profile.controller.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use(protect);

router.route("/").get(ProfileController.getProfile);
router.patch("/", ProfileController.updateProfile);

export default router;
