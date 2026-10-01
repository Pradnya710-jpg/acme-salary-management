import { Request, Response } from "express";
import { pool } from "../../db/pool.js";
import { comparePassword } from "./password.js";
import { generateToken } from "./jwt.js";
import { LoginRequest } from "./auth.types.js";

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;
    console.log("password_hash",req.body)

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const result = await pool.query(
      `
      SELECT id, email, password_hash, role
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const user = result.rows[0];

    const isPasswordValid = await comparePassword(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};