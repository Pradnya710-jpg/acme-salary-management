import { Router } from "express";
import { z } from "zod";
import { pool } from "../../db/pool.js";
const router = Router();
const schema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().length(3),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
router.get("/employees/:id/salary-history", async (req, res, next) => {
  try {
    const r = await pool.query(
      "SELECT id,amount,currency,effective_from FROM salaries WHERE employee_id=$1 ORDER BY effective_from DESC,id DESC",
      [Number(req.params.id)],
    );
    res.json(r.rows);
  } catch (e) {
    next(e);
  }
});
router.post("/employees/:id/salary", async (req, res, next) => {
  const client = await pool.connect();
  try {
    const p = schema.parse(req.body);
    await client.query("BEGIN");
    const emp = await client.query(
      "SELECT id FROM employees WHERE id=$1 FOR UPDATE",
      [Number(req.params.id)],
    );
    if (!emp.rowCount) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Employee not found" });
    }
    const r = await client.query(
      "INSERT INTO salaries(employee_id,amount,currency,effective_from) VALUES($1,$2,$3,$4) RETURNING *",
      [Number(req.params.id), p.amount, p.currency, p.effectiveFrom],
    );
    await client.query("COMMIT");
    res.status(201).json(r.rows[0]);
  } catch (e) {
    await client.query("ROLLBACK");
    next(e);
  } finally {
    client.release();
  }
});
export default router;
