import { describe, expect, it } from "vitest";

import {
  hashPassword,
  comparePassword,
} from "../src/modules/auth/password";

describe("Password utilities", () => {
  it("should hash a password", async () => {
    const password = "Test@123";

    const hashedPassword = await hashPassword(password);

    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword).toBeTypeOf("string");
  });

  it("should correctly compare a valid password", async () => {
    const password = "Test@123";

    const hashedPassword = await hashPassword(password);

    const result = await comparePassword(
      password,
      hashedPassword
    );

    expect(result).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "Test@123";
    const wrongPassword = "Wrong@123";

    const hashedPassword = await hashPassword(password);

    const result = await comparePassword(
      wrongPassword,
      hashedPassword
    );

    expect(result).toBe(false);
  });
});