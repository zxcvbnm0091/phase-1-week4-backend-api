import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authorized, please login" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;

    next();
  } catch (error) {
    res.status(401).json({ error: "Token is invalid or expired" });
  }
};
