# Architecture

React + TypeScript frontend communicates with a Node.js + Express REST API. The backend is a modular monolith with Employee, Salary and Dashboard modules. PostgreSQL stores employees and salary history.

React UI -> REST API -> Employee/Salary/Dashboard modules -> PostgreSQL

Pagination and server-side filtering prevent the browser from loading all 10,000 employees. Salary changes are transactional so the new record is committed consistently. The system uses REST because the MVP has straightforward request/response resource operations and does not need the extra complexity of GraphQL or distributed messaging.
