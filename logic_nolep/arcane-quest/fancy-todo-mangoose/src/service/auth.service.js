import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const findUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+passwordHash");
};

const verifyUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  const loginError = new Error("Invalid email or password");
  loginError.statusCode = 401;

  if (!user) {
    throw loginError;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw loginError;
  }

  const userObject = user.toObject();
  delete userObject.passwordHash;

  return userObject;
};

export { findUserByEmail, verifyUser };
