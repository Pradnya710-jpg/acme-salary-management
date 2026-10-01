import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";

import { login } from "../src/modules/auth/auth.controller.js";

import { pool } from "../src/db/pool.js";
import { comparePassword } from "../src/modules/auth/password.js";
import { generateToken } from "../src/modules/auth/jwt.js";

vi.mock("../password.js", () => ({
  comparePassword: vi.fn(),
}));

vi.mock("../jwt.js", () => ({
  generateToken: vi.fn(),
}));

describe("Login controller", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  const createResponse = () => {
    return {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
  };

  it("should return 400 when email or password is missing", async () => {
    const req = {
      body: {
        email: "",
        password: "",
      },
    } as Request;

    const res = createResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email and password are required",
    });
  });

  it("should return 401 when user does not exist", async () => {
    vi.spyOn(pool, "query").mockResolvedValue({
      rows: [],
    } as any);

    const req = {
      body: {
        email: "unknown@acme.com",
        password: "Test@123",
      },
    } as Request;

    const res = createResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid email or password",
    });
  });

  it("should return 401 when password is incorrect", async () => {
    vi.spyOn(pool, "query").mockResolvedValue({
      rows: [
        {
          id: 1,
          email: "hr@acme.com",
          password_hash: "hashed-password",
          role: "HR_ADMIN",
        },
      ],
    } as any);

    vi.mocked(comparePassword).mockResolvedValue(false);

    const req = {
      body: {
        email: "hr@acme.com",
        password: "Wrong@123",
      },
    } as Request;

    const res = createResponse();

    await login(req, res);

    expect(comparePassword).toHaveBeenCalledWith(
      "Wrong@123",
      "hashed-password"
    );

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid email or password",
    });
  });

  it("should login successfully with valid credentials", async () => {
    vi.spyOn(pool, "query").mockResolvedValue({
      rows: [
        {
          id: 1,
          email: "hr@acme.com",
          password_hash: "hashed-password",
          role: "HR_ADMIN",
        },
      ],
    } as any);

    vi.mocked(comparePassword).mockResolvedValue(true);

    vi.mocked(generateToken).mockReturnValue(
      "test-jwt-token"
    );

    const req = {
      body: {
        email: "hr@acme.com",
        password: "HR@12345",
      },
    } as Request;

    const res = createResponse();

    await login(req, res);

    expect(comparePassword).toHaveBeenCalledWith(
      "HR@12345",
      "hashed-password"
    );

    expect(generateToken).toHaveBeenCalledWith({
      userId: 1,
      email: "hr@acme.com",
      role: "HR_ADMIN",
    });

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Login successful",
      data: {
        token: "test-jwt-token",
        user: {
          id: 1,
          email: "hr@acme.com",
          role: "HR_ADMIN",
        },
      },
    });
  });

  it("should return 500 when database throws an error", async () => {
    vi.spyOn(pool, "query").mockRejectedValue(
      new Error("Database error")
    );

    const req = {
      body: {
        email: "hr@acme.com",
        password: "HR@12345",
      },
    } as Request;

    const res = createResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });
  });
});