import User from "../models/profile.model.js";
import * as profileService from "../service/profile.service.js";

class ProfileController {
  static async getProfile(req, res) {
    const userId = req.user.id;

    try {
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
    const userId = req.user.id;
    const { displayName, bio } = req.body;
    try {
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
