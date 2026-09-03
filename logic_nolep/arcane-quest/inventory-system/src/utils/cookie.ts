import config from "../config/config";

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: config.env === "production",
  sameSite: "strict" as const,
  maxAge,
});
