import * as userService from "../service/user.service.js";

class UserController {
  static async getAllUser(req, res) {
    try {
      const users = await userService.findAll();

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const userId = req.user.id;
      const user = await userService.findById(userId);

      res.status(200).json({
        message: "User fetched",
        status: "success",
        data: user,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { email, password } = req.body;
      const userId = req.user.id;
      const updateUser = await userService.updateUser(userId, email, password);

      res.status(200).json({
        message: "User data updated",
        status: "success",
        updateUser,
      });
    } catch (error) {
      console.error("FULL ERROR LOG:", error);
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = req.user.id;
      await userService.removeUser(userId);

      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        message: "User deleted",
        status: "success",
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }
}

export default UserController;
