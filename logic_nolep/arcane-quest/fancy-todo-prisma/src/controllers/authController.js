import { sendTokenResponse } from "../utils/jwt.js";
import * as authService from "../services/authService.js";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await authService.createUser(email, password);

    // JWT TOKEN
    const jwtToken = sendTokenResponse(user, 200, res);

    res.status(201).json({
      message: "Registration successful",
      status: "success",
      jwtToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await authService.verifyUser(email, password);

    const jwtToken = sendTokenResponse(user, 200, res);

    res.status(200).json({
      message: "Login successful",
      status: "success",
      jwtToken,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.PROCESS_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ success: true, message: "Logged out" });
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    await authService.removeUserAccount(userId);

    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "User and all associated data deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export { register, login, logout, deleteUser };
