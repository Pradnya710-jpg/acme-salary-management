import { describe, expect, it } from "vitest";

import {
  generateToken,
  verifyToken,
} from "../src/modules/auth/jwt";

describe("JWT utilities", () => {
  it("should generate a JWT token", () => {
    const payload = {
      userId: 1,
      email: "hr@acme.com",
      role: "HR_ADMIN",
    };

    const token = generateToken(payload);

    expect(token).toBeTypeOf("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("should verify a valid JWT token", () => {
    const payload = {
      userId: 1,
      email: "hr@acme.com",
      role: "HR_ADMIN",
    };

    const token = generateToken(payload);

    const decoded = verifyToken(token);

    expect(decoded).toBeDefined();
    expect(decoded.userId).toBe(1);
    expect(decoded.email).toBe("hr@acme.com");
    expect(decoded.role).toBe("HR_ADMIN");
  });

  it("should reject an invalid JWT token", () => {
    expect(() => {
      verifyToken("invalid-token");
    }).toThrow();
  });
});