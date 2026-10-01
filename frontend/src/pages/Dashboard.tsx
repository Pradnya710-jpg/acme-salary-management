import { useEffect, useState } from "react";
import { api } from "../lib/api";
type Row = {
  country?: string;
  department?: string;
  currency: string;
  employee_count: number;
  average_salary: number;
};
type Data = { totalEmployees: number; byCountry: Row[]; byDepartment: Row[] };
const money = (n: number, c: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(n);
export default function Dashboard() {
  const [d, setD] = useState<Data | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    api<Data>("/dashboard/summary")
      .then(setD)
      .catch((e) => setErr(e.message));
  }, []);
  if (err) return <div className="error">{err}</div>;
  if (!d) return <div className="loading">Loading dashboard...</div>;
  return (
    <>
      <div className="pageTitle">
        <div>
          <h1>Salary overview</h1>
          <p>Compensation insights for the HR Manager.</p>
        </div>
      </div>
      <section className="cards">
        <div className="card">
          <span>Total employees</span>
          <b>{d.totalEmployees.toLocaleString()}</b>
        </div>
        <div className="card">
          <span>Countries</span>
          <b>{d.byCountry.length}</b>
        </div>
        <div className="card">
          <span>Departments</span>
          <b>{d.byDepartment.length}</b>
        </div>
      </section>
      <div className="grid">
        <section className="panel">
          <h2>Salary by country</h2>
          {d.byCountry.map((r) => (
            <div className="stat" key={r.country}>
              <div>
                <b>{r.country}</b>
                <small>{r.employee_count.toLocaleString()} employees</small>
              </div>
              <strong>{money(Number(r.average_salary), r.currency)}</strong>
            </div>
          ))}
        </section>
        <section className="panel">
          <h2>Salary by department</h2>
          {d.byDepartment.map((r) => (
            <div className="stat" key={r.department}>
              <div>
                <b>{r.department}</b>
                <small>{r.employee_count.toLocaleString()} employees</small>
              </div>
              <strong>{money(Number(r.average_salary), r.currency)}</strong>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
