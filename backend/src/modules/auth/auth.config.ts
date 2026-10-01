import dotenv from "dotenv";

dotenv.config();

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || "development-secret-key",
  jwtExpiresIn: "1h" as const,
};