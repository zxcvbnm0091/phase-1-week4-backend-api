import express from "express";
import cookieParser from "cookie-parser";
import Apiroutes from "./routes/index.route";
import helmet from "helmet";
import cors from "cors";
import passport from "./config/passport";
import config from "./config/config";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// SECURITY HEADERS
app.use(helmet());

// PASSPORT
app.use(passport.initialize());

// Cross origin resource sharing
// only allow certain endpoint (origin) access the api
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempt, please try again",
  },
});
// Rate limiting
app.use("/api", limiter);
app.use("/api/auth", authLimiter);

// Body parsing & cookies
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Compression
app.use(compression());

// Morgan
// HTTP request logging
// "dev": light weight logging format, "combined": predefined format
app.use(morgan(config.env === "development" ? "dev" : "combined"));

// Routes
app.use("/api", Apiroutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error handler
app.use(errorHandler);

export default app;
