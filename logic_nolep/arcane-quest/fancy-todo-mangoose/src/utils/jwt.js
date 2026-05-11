import jwt from "jsonwebtoken";

// helper
const getMilliseconds = (timeStr) => {
  const unit = timeStr.slice(-1);
  const value = parseInt(timeStr);

  const msMap = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
  };

  return value * (msMap[unit] || 0);
};

export const sendTokenResponse = (user, statusCode, res) => {
  const payload = { id: user.id, email: user.email };

  // sync cookie and jwt token duration
  const durationStr = process.env.EXPIRES_IN || "7d";
  const durationMs = getMilliseconds(durationStr);

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: durationStr,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + durationMs),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
};
