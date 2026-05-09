import { prisma } from "../lib/prisma.js";

class ProfileController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const profile = await prisma.profile.findUnique({
        where: { userId: userId },
      });

      if (!profile) {
        return res.status(404).json({
          user: userId,
          error: "profile not found",
        });
      }

      res.status(200).json({
        message: "Get user profile",
        status: "success",
        data: profile,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { avatarUrl, displayName, bio } = req.body;

      const updatedProfile = await prisma.profile.update({
        where: { userId: userId },
        data: {
          avatarUrl,
          bio,
          displayName,
        },
      });

      res.status(200).json({
        message: "Profile updated successfully",
        status: "success",
        data: updatedProfile,
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Profile not found" });
      }

      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  }
}

export default ProfileController;
