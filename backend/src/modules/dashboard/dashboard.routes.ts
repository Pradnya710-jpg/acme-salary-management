import { Router } from "express";
import { pool } from "../../db/pool.js";
const router = Router();
router.get("/summary", async (_req, res, next) => {
  try {
    const [count, countries, depts] = await Promise.all([
      pool.query("SELECT COUNT(*)::int total FROM employees"),
      pool.query(
        `SELECT e.country,s.currency,COUNT(*)::int employee_count,ROUND(AVG(s.amount),2) average_salary FROM employees e JOIN LATERAL (SELECT amount,currency FROM salaries WHERE employee_id=e.id ORDER BY effective_from DESC,id DESC LIMIT 1) s ON true GROUP BY e.country,s.currency ORDER BY employee_count DESC`,
      ),
      pool.query(
        `SELECT e.department,s.currency,COUNT(*)::int employee_count,ROUND(AVG(s.amount),2) average_salary FROM employees e JOIN LATERAL (SELECT amount,currency FROM salaries WHERE employee_id=e.id ORDER BY effective_from DESC,id DESC LIMIT 1) s ON true GROUP BY e.department,s.currency ORDER BY employee_count DESC`,
      ),
    ]);
    res.json({
      totalEmployees: count.rows[0].total,
      byCountry: countries.rows,
      byDepartment: depts.rows,
    });
  } catch (e) {
    next(e);
  }
});
export default router;
