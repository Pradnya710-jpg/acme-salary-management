# Fast deployment plan

## Database
Create a managed PostgreSQL database and copy its connection string into `DATABASE_URL`.

## Backend
Deploy the `backend` directory as a Node/Docker service. Set:
- `DATABASE_URL`
- `PORT=4000`
- `CORS_ORIGIN=https://YOUR-FRONTEND-DOMAIN`

Run once after the database is available:
- `npm run db:migrate`
- `npm run db:seed`

Health check: `/api/health`

## Frontend
Deploy the `frontend` directory as a Vite app. Set:
- `VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`

Build command: `npm run build`
Output directory: `dist`

Before submission, open the deployed frontend in an incognito window and verify dashboard, search, employee details and salary update.
