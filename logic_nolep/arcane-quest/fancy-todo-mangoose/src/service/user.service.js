import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const findAll = async () => {
  return await User.find({});
};

const findById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const createUser = async (email, password, displayName = "New User") => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [newUser] = await User.create([{ email, passwordHash }], { session });

    await Profile.create([{ userId: newUser._id, displayName }], { session });

    await session.commitTransaction();
    return newUser;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const updateUser = async (id, email, password) => {
  const updateData = {};

  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== id) {
      const error = new Error("Email is already in use by another account");
      error.statusCode = 409;
      throw error;
    }
    updateData.email = email;
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateData.passwordHash = await bcrypt.hash(password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedUser;
};

const removeUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return await user.deleteOne();
};

export { findAll, findById, createUser, updateUser, removeUser };
