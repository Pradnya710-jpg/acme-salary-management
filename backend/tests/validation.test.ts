import { z } from "zod";
const salarySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().length(3),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
describe("salary validation", () => {
  it("accepts valid salary", () =>
    expect(
      salarySchema.safeParse({
        amount: 100000,
        currency: "USD",
        effectiveFrom: "2026-01-01",
      }).success,
    ).toBe(true));
  it("rejects negative salary", () =>
    expect(
      salarySchema.safeParse({
        amount: -1,
        currency: "USD",
        effectiveFrom: "2026-01-01",
      }).success,
    ).toBe(false));
  it("rejects invalid currency", () =>
    expect(
      salarySchema.safeParse({
        amount: 1,
        currency: "US",
        effectiveFrom: "2026-01-01",
      }).success,
    ).toBe(false));
});
