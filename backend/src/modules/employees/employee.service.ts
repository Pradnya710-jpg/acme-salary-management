import { pool } from "../../db/pool.js";
export type EmployeeFilters = {
  page: number;
  limit: number;
  search?: string;
  country?: string;
  department?: string;
};
export async function listEmployees(f: EmployeeFilters) {
  const params: any[] = [];
  const where: string[] = [];
  if (f.search) {
    params.push(`%${f.search}%`);
    where.push(
      `(LOWER(first_name||' '||last_name) LIKE LOWER($${params.length}) OR LOWER(email) LIKE LOWER($${params.length}) OR LOWER(employee_code) LIKE LOWER($${params.length}))`,
    );
  }
  if (f.country) {
    params.push(f.country);
    where.push(`country=$${params.length}`);
  }
  if (f.department) {
    params.push(f.department);
    where.push(`department=$${params.length}`);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const count = await pool.query(
    `SELECT COUNT(*)::int total FROM employees ${clause}`,
    params,
  );
  const total = count.rows[0].total;
  const offset = (f.page - 1) * f.limit;
  const dataParams = [...params, f.limit, offset];
  const rows = await pool.query(
    `SELECT id,employee_code,first_name,last_name,email,country,department,job_title FROM employees ${clause} ORDER BY id LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams,
  );
  return {
    data: rows.rows,
    pagination: {
      page: f.page,
      limit: f.limit,
      total,
      totalPages: Math.ceil(total / f.limit),
    },
  };
}
export async function getEmployee(id: number) {
  const e = await pool.query("SELECT * FROM employees WHERE id=$1", [id]);
  if (!e.rowCount) return null;
  const s = await pool.query(
    "SELECT id,amount,currency,effective_from FROM salaries WHERE employee_id=$1 ORDER BY effective_from DESC,id DESC",
    [id],
  );
  return { ...e.rows[0], salaryHistory: s.rows };
}
export async function createEmployee(input: any) {
  const c = await pool.query(
    "INSERT INTO employees(employee_code,first_name,last_name,email,country,department,job_title) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    Object.values(input),
  );
  return c.rows[0];
}
