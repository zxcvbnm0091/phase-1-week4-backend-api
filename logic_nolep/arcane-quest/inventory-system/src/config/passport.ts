// src/config/passport.ts
import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import type { Request } from "express";
import config from "./config";

const options = {
  // pulls the token from the accessToken cookie
  jwtFromRequest: (req: Request) => req.cookies?.accessToken as string | null,
  secretOrKey: config.jwt.access as string,
};

passport.use(
  new JwtStrategy(options, (payload, done) => {
    // runs after the token is already verified; payload becomes req.user
    return done(null, payload);
  }),
);

export default passport;
