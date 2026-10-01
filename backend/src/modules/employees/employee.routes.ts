import { Router } from "express";
import { z } from "zod";
import {
  createEmployee,
  getEmployee,
  listEmployees,
} from "./employee.service.js";
const router = Router();
const employeeSchema = z.object({
  employeeCode: z.string().min(2),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  country: z.string().min(2),
  department: z.string().min(2),
  jobTitle: z.string().min(2),
});
router.get("/", async (req, res, next) => {
  try {
    const q = req.query;
    const page = Math.max(1, Number(q.page) || 1),
      limit = Math.min(100, Math.max(1, Number(q.limit) || 25));
    res.json(
      await listEmployees({
        page,
        limit,
        search: q.search?.toString(),
        country: q.country?.toString(),
        department: q.department?.toString(),
      }),
    );
  } catch (e) {
    next(e);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const item = await getEmployee(Number(req.params.id));
    if (!item) return res.status(404).json({ error: "Employee not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const p = employeeSchema.parse(req.body);
    const item = await createEmployee({
      employee_code: p.employeeCode,
      first_name: p.firstName,
      last_name: p.lastName,
      email: p.email,
      country: p.country,
      department: p.department,
      job_title: p.jobTitle,
    });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});
export default router;
