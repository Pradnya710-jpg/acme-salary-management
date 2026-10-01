import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt.js";
import { JwtPayload } from "./auth.types.js";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyToken(token);

    req.user = payload;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};