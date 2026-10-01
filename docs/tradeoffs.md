# Trade-offs

- **Modular monolith instead of microservices:** the assessment scope does not require independent scaling/deployment; a modular monolith is easier to reason about and deploy.
- **PostgreSQL:** relational data and salary history benefit from transactions and constraints. It also provides a practical path to production deployment.
- **REST instead of GraphQL:** the resource model is simple and predictable.
- **Server-side pagination/filtering:** avoids transferring and rendering 10,000 employees at once.
- **No live currency conversion:** accurate cross-country normalization requires an external FX source and business rules that are outside the MVP.
