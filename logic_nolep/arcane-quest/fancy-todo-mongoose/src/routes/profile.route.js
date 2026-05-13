import express from "express";
import ProfileController from "../controllers/profile.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { ProfileZodSchema } from "../models/profile.model.js";
const router = express.Router();

router.use(protect);

router.route("/me").get(ProfileController.getProfile);
router.patch(
  "/me",
  validate(ProfileZodSchema),
  ProfileController.updateProfile,
);

export default router;
