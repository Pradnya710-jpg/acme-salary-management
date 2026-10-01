import express from "express";
import cors from "cors";
import employeeRoutes from "./modules/employees/employee.routes.js";
import salaryRoutes from "./modules/salaries/salary.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import { errorHandler } from "./middleware/error.js";
import authRoutes from "./modules/auth/auth.routes.js";
export const app = express();
console.log("CORS_ORIGIN",process.env.CORS_ORIGIN)
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/employees", employeeRoutes);
app.use("/api", salaryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(errorHandler);
