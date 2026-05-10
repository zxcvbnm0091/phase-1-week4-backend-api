import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const verifyUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  return user;
};

export const createUser = async (email, password) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  return await prisma.user.create({
    data: {
      email,
      passwordHash,
      profile: {
        create: {
          displayName: "",
          bio: "Welcome to my profile!",
        },
      },
    },
    select: {
      id: true,
      email: true,
      profile: true,
    },
  });
};

export const updateUser = async (id, email, password) => {
  if (email) {
    const existingUser = await findUserByEmail(email);

    if (existingUser && existingUser.id !== id) {
      const error = new Error("Email is already in use by another account");
      error.statusCode = 409;
      throw error;
    }
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    data.passwordHash = await bcrypt.hash(password, salt);
  }

  return await prisma.user.update({
    where: { id },
    data: {
      email,
      passwordHash,
    },
  });
};

export const removeUserAccount = async (userId) => {
  return await prisma.user.delete({
    where: { id: userId },
  });
};
