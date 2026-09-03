import jwt from "jsonwebtoken";
import type { JWTAccessPayload, JWTRefreshPayload } from "../types/index";
import config from "../config/config";

const getSecret = (secret: string | undefined, name: string) => {
  if (!secret) throw new Error(`${name} is not defined`);
  return secret;
};

export const generateAccessToken = (payload: JWTAccessPayload): string => {
  return jwt.sign(payload, getSecret(config.jwt.access, "JWT_ACCESS_SECRET"), {
    expiresIn: config.jwt.accessExpiresIn,
  });
};

export const generateRefreshToken = (payload: JWTRefreshPayload): string => {
  return jwt.sign(
    payload,
    getSecret(config.jwt.refresh, "JWT_REFRESH_SECRET"),
    {
      expiresIn: config.jwt.refreshExpiresIn,
    },
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, getSecret(config.jwt.access, "JWT_ACCESS_SECRET"));
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, getSecret(config.jwt.refresh, "JWT_REFRESH_SECRET"));
};
