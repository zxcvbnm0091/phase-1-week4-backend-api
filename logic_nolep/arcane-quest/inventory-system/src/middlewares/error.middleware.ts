import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import config from "../config/config";
import logger from "../config/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(config.env === "development" && { stack: err.stack }),
    });
    return;
  }

  // Unexpected / non-operational error
  logger.error(err);

  res.status(500).json({
    success: false,
    message:
      config.env === "production" ? "Internal server error" : err.message,
    ...(config.env === "development" && { stack: err.stack }),
  });
};
