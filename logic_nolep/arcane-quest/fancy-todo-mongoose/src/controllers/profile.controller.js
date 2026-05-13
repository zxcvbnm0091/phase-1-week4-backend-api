import User from "../models/profile.model.js";
import * as profileService from "../service/profile.service.js";
import { ProfileZodSchema } from "../models/profile.model.js";

class ProfileController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await profileService.findById(userId);

      res.status(200).json({
        message: "Showing profile",
        status: "success",
        data: profile,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }
  static async updateProfile(req, res) {
    try {
      const validateData = ProfileZodSchema.parse(req.body);
      const userId = req.user.id;
      const { displayName, bio } = validateData;
      const profile = await profileService.updateProfile(
        userId,
        displayName,
        bio,
      );

      res.status(200).json({
        message: "Profile data updated",
        status: "success",
        profile,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }
}

export default ProfileController;
