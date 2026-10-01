import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";

type Salary = {
  id: number;
  amount: string;
  currency: string;
  effective_from: string;
};

type Employee = {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  department: string;
  job_title: string;
  salaryHistory: Salary[];
};

type SalaryForm = {
  amount: string;
  currency: string;
  effectiveFrom: string;
};

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState<SalaryForm>({
    amount: "",
    currency: "USD",
    effectiveFrom: "2026-10-01",
  });

  /**
   * Load employee details
   */
  const loadEmployee = async () => {
    if (!id) {
      setMessage("Employee ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = await api<Employee>(`/employees/${id}`);

      setEmployee(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load employee details.";

      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load employee when page opens
   * or when employee ID changes.
   */
  useEffect(() => {
    loadEmployee();
  }, [id]);

  /**
   * Update salary
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      setMessage("Employee ID is missing.");
      return;
    }

    try {
      setMessage("");

      await api(`/employees/${id}/salary`, {
        method: "POST",
        body: JSON.stringify({
          amount: Number(form.amount),
          currency: form.currency,
          effectiveFrom: form.effectiveFrom,
        }),
      });

      setMessage("Salary updated successfully.");

      setForm((previousForm) => ({
        ...previousForm,
        amount: "",
      }));

      // Reload employee data so salary history/current salary is updated
      await loadEmployee();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update salary.";

      setMessage(message);
    }
  };

  /**
   * Loading state
   */
  if (loading) {
    return <div className="loading">Loading employee...</div>;
  }

  /**
   * Error / employee not found
   */
  if (!employee) {
    return (
      <div className="loading">
        {message || "Employee not found."}
      </div>
    );
  }

  const currentSalary = employee.salaryHistory[0];

  return (
    <>
      {/* Back button */}
      <Link to="/employees" className="back">
        ← Employees
      </Link>

      {/* Employee header */}
      <div className="profile">
        <div>
          <div className="avatar">
            {employee.first_name.charAt(0)}
            {employee.last_name.charAt(0)}
          </div>

          <h1>
            {employee.first_name} {employee.last_name}
          </h1>

          <p>
            {employee.job_title} · {employee.department}
          </p>
        </div>

        {/* Current salary */}
        <div className="currentSalary">
          <span>Current salary</span>

          <b>
            {currentSalary
              ? new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: currentSalary.currency,
                  maximumFractionDigits: 0,
                }).format(Number(currentSalary.amount))
              : "—"}
          </b>
        </div>
      </div>

      {/* Main content */}
      <div className="grid">

        {/* Employee details */}
        <section className="panel">
          <h2>Employee details</h2>

          <div className="details">
            <p>
              <span>Employee code</span>
              {employee.employee_code}
            </p>

            <p>
              <span>Email</span>
              {employee.email}
            </p>

            <p>
              <span>Country</span>
              {employee.country}
            </p>

            <p>
              <span>Department</span>
              {employee.department}
            </p>
          </div>
        </section>

        {/* Salary update */}
        <section className="panel">
          <h2>Update salary</h2>

          {message && <div className="notice">{message}</div>}

          <form className="salaryForm" onSubmit={handleSubmit}>

            {/* Amount */}
            <label>
              Amount

              <input
                type="number"
                min="0"
                required
                value={form.amount}
                onChange={(event) =>
                  setForm((previousForm) => ({
                    ...previousForm,
                    amount: event.target.value,
                  }))
                }
              />
            </label>

            {/* Currency */}
            <label>
              Currency

              <select
                value={form.currency}
                onChange={(event) =>
                  setForm((previousForm) => ({
                    ...previousForm,
                    currency: event.target.value,
                  }))
                }
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                <option value="SGD">SGD</option>
                <option value="AED">AED</option>
              </select>
            </label>

            {/* Effective date */}
            <label>
              Effective from

              <input
                type="date"
                required
                value={form.effectiveFrom}
                onChange={(event) =>
                  setForm((previousForm) => ({
                    ...previousForm,
                    effectiveFrom: event.target.value,
                  }))
                }
              />
            </label>

            <button type="submit">
              Save salary
            </button>
          </form>
        </section>
      </div>

      {/* Salary history */}
      <section className="panel">
        <h2>Salary history</h2>

        {employee.salaryHistory.length === 0 ? (
          <p>No salary history available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Effective from</th>
                <th>Amount</th>
                <th>Currency</th>
              </tr>
            </thead>

            <tbody>
              {employee.salaryHistory.map((salary) => (
                <tr key={salary.id}>
                  <td>{salary.effective_from}</td>

                  <td>
                    {Number(salary.amount).toLocaleString()}
                  </td>

                  <td>{salary.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

