import jwt from "jsonwebtoken";
import { authConfig } from "./auth.config.js";
import { JwtPayload } from "./auth.types.js";

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtExpiresIn,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
};