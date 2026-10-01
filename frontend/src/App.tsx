import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeDetails from "./pages/EmployeeDetails";
import Login from "./pages/Login";

import { useAuth } from "./lib/AuthContext.js";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const loc = useLocation();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="app">
      {isAuthenticated && (
        <header>
          <div>
            <strong>ACME Salary Management</strong>
            <span className="muted">HR workspace</span>
          </div>

          <nav>
            <Link
              className={loc.pathname === "/" ? "active" : ""}
              to="/"
            >
              Dashboard
            </Link>

            <Link
              className={
                loc.pathname.startsWith("/employees")
                  ? "active"
                  : ""
              }
              to="/employees"
            >
              Employees
            </Link>

            <button className="logout" onClick={logout}>
              Logout
            </button>
          </nav>
        </header>
      )}

      <main>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees/:id"
            element={
              <ProtectedRoute>
                <EmployeeDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}