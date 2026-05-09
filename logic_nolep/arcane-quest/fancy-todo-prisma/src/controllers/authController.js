import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { sendTokenResponse } from "../utils/jwt.js";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            displayName: "",
            bio: "Welcome to my profile!",
            avatarUrl: null,
          },
        },
      },
      // Use 'select' to grab specific fields from both User and Profile
      select: {
        id: true,
        email: true,
        createdAt: true,
        profile: true,
      },
    });

    // JWT TOKEN
    const jwtToken = sendTokenResponse(user, 200, res);

    res.status(201).json({
      message: "Registration successful",
      status: "success",
      data: user,
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

    const user = await prisma.user.findUnique({ where: { email } });

    // Stay consistent: use 401 for both to prevent user enumeration
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // --- ADDED THIS PART ---
    const jwtToken = sendTokenResponse(user, 200, res);

    res.json({
      message: "Login Success",
      status: "success",
      user: {
        id: user.id,
        email: user.email,
      },
      jwtToken, // Send the token back to the frontend
    });
    // -----------------------
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Logged out" });
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user)
      return res.status(404).json({
        error: "user not found",
      });

    const deleteUser = await prisma.user.delete({
      where: { id: id },
    });

    res.status(200).json({
      message: "User Deleted",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { register, login, logout, deleteUser };
