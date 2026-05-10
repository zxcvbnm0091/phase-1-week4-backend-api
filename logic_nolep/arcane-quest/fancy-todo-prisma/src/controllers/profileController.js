import * as profileService from "../services/profileService.js";

class ProfileController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await profileService.getProfileByUserId(userId);

      res.status(200).json({
        message: "Get user profile",
        status: "success",
        data: profile,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        error: error.message,
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { avatarUrl, displayName, bio } = req.body;

      const updatedProfile = await profileService.updateProfileByUserId(
        userId,
        {
          avatarUrl,
          displayName,
          bio,
        },
      );

      res.status(200).json({
        message: "Profile updated successfully",
        status: "success",
        data: updatedProfile,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({
        error: error.message || "Internal server error",
      });
    }
  }
}

export default ProfileController;
