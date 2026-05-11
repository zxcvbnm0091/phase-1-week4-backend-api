import User from "../models/user.model.js";
import * as authService from "../service/auth.service.js";
import { createUser } from "../service/user.service.js";
import { sendTokenResponse } from "../utils/jwt.js";
import { UserZodSchema } from "../models/user.model.js";

class AuthController {
  static async register(req, res) {
    const validatedData = UserZodSchema.parse(req.body);
    const { email, password } = req.body;

    try {
      const newUser = await createUser(email, password);

      const jwtToken = sendTokenResponse(newUser, 201, res);

      return jwtToken;
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const message =
        statusCode === 500
          ? "An error occurred during registration"
          : error.message;
      return res
        .status(statusCode)
        .json({ error: message, stack: error.stack });
    }
  }

  static async login(req, res) {
    const validatedData = UserZodSchema.parse(req.body);
    const { email, password } = req.body;

    try {
      const user = await authService.verifyUser({ email, password });

      const jwtToken = sendTokenResponse(user, 200, res);

      return res.status(200).json({
        message: "Login successful",
        status: "success",
        jwtToken,
      });
    } catch (error) {
      const statusCode = error.statusCode || 401;
      const message =
        statusCode === 401 ? "Invalid credentials" : error.message;
      return res.status(statusCode).json({ error: message });
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(200).json({
        message: "Logged out successfully",
        status: "success",
      });
    } catch (error) {
      return res.status(500).json({ error: "Logout failed" });
    }
  }
}

export default AuthController;
