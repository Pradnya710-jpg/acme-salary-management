# ACME Salary Management — Requirements

## Goal
Replace spreadsheet-based salary management with a simple web application for the HR Manager to manage employee salary information and answer basic questions about organizational compensation across countries.

## MVP scope
- View 10,000 employees with pagination.
- Search employees by name, email or employee code.
- Filter by country and department.
- View employee details and salary history.
- Add/update salary with an effective date; preserve previous salary records.
- Dashboard: employee count, employee count by country/department and average salary by country/department within each currency.
- Seed script for 10,000 employees.

## Deliberately out of scope
Payroll processing, tax/benefit calculations, employee self-service, attendance, recruitment, SSO, complex RBAC, email notifications and live FX conversion. These are excluded to keep the MVP focused on salary management and compensation insights. Cross-currency global averages are also excluded because they require an exchange-rate source and conversion-date rules.

## Success criteria
An HR Manager can complete the core workflows without Excel, data is persisted reliably, salary history is retained, the UI remains responsive with 10,000 seeded employees, and core business rules are covered by automated tests.
