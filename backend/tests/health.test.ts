import request from "supertest";
import { app } from "../src/app.js";
describe("health", () => {
  it("returns ok", async () => {
    const r = await request(app).get("/api/health");
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ status: "ok" });
  });
});
