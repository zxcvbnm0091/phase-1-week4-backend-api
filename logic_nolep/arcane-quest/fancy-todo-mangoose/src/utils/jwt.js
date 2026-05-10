import jwt from "jsonwebtoken";

export const sendTokenResponse = (user, statusCode, res) => {
  const payload = { id: user.id, email: user.email };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN || "7d",
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
