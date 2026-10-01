import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
type Emp = {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  department: string;
  job_title: string;
};
type Result = {
  data: Emp[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "Canada",
  "Australia",
  "Singapore",
  "United Arab Emirates",
];
const departments = [
  "Engineering",
  "Product",
  "Finance",
  "HR",
  "Sales",
  "Marketing",
  "Operations",
];
export default function Employees() {
  const [data, setData] = useState<Result>();
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [err, setErr] = useState("");
  const load = () => {
    const p = new URLSearchParams({ page: String(page), limit: "25" });
    if (search) p.set("search", search);
    if (country) p.set("country", country);
    if (department) p.set("department", department);
    api<Result>("/employees?" + p)
      .then(setData)
      .catch((e) => setErr(e.message));
  };
  useEffect(() => {
    load();
  }, [page, country, department]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load();
  };
  return (
    <>
      <div className="pageTitle">
        <div>
          <h1>Employees</h1>
          <p>Search and manage salary records.</p>
        </div>
      </div>
      <form className="filters" onSubmit={submit}>
        <input
          placeholder="Search name, email or code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All countries</option>
          {countries.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All departments</option>
          {departments.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <button>Search</button>
      </form>
      {err && <div className="error">{err}</div>}
      <section className="panel tableWrap">
        <div className="tableMeta">
          {data?.pagination.total.toLocaleString() || 0} employees
        </div>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Country</th>
              <th>Department</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((e) => (
              <tr key={e.id}>
                <td>
                  <Link to={`/employees/${e.id}`}>
                    <b>
                      {e.first_name} {e.last_name}
                    </b>
                  </Link>
                  <small>
                    {e.employee_code} · {e.email}
                  </small>
                </td>
                <td>{e.country}</td>
                <td>{e.department}</td>
                <td>{e.job_title}</td>
                <td>
                  <Link to={`/employees/${e.id}`}>View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {data?.pagination.totalPages || 1}
          </span>
          <button
            disabled={!data || page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
}
