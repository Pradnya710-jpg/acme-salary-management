# Performance considerations

- Employee list is paginated (default 25, maximum 100).
- Search and filters are executed by PostgreSQL rather than filtering 10,000 records in React.
- Indexes support common country/department and salary-history lookups.
- Dashboard queries aggregate in the database.
- Salary writes use a transaction and retain history instead of overwriting prior records.
