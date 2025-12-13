# HIPIS
## Hybrid & Intelligent Psyche Intervention System

A comprehensive full-stack mental health intervention platform with role-based dashboards for students, counsellors, and administrators. Built with React + Vite + TypeScript on the frontend and Express + MongoDB on the backend, providing a unified API and database for seamless data integration across all user roles.

## Features
- **Role-aware dashboards:** Student (wellness, appointments, resources, forum), Counsellor (clients, session notes, appointments), Admin (system metrics, flags, assignments).
- **Auth & RBAC:** JWT-based auth; role enforced on protected routes.
- **Data sharing:** Single MongoDB backing all roles; actions in one dashboard reflect across others.
- **Wellness & assessments:** Mood logs, PHQ-9/GAD-7 style assessments, high-risk flagging for admins.
- **Engagement:** Forum posts/replies/likes/views; resource likes and engagement analytics.
- **Notifications:** Per-user notifications with mark-all-read support.

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, React Router 6, TailwindCSS, Radix UI, Lucide icons.
- **Backend:** Express, TypeScript, MongoDB via Mongoose.
- **Testing:** Vitest (configured), not yet populated with suites.
- **Tooling:** pnpm, eslint-style lint rules via get_errors integration.

## Project Structure
- `client/` – SPA frontend (pages, components, hooks, lib).
- `server/` – Express API (routes, models, middleware, seed script).
- `shared/` – Shared types.
- `netlify/` – Functions entry for serverless deploys (optional).

## Prerequisites
- Node 18+
- pnpm (`npm i -g pnpm`)
- MongoDB connection string

## Setup
1. Install deps:
   ```bash
   pnpm install
   ```
2. Create `.env` at project root:
   ```env
   MONGODB_URI="<your mongodb uri>"
   JWT_SECRET="change-me"
   PORT=8080
   ```
3. Seed sample data (users + resources + appointments + assessments + forum):
   ```bash
   pnpm tsx server/seed.ts
   ```
4. Run dev (frontend + backend on a single port):
   ```bash
   pnpm dev
   ```
5. Build:
   ```bash
   pnpm build
   ```
6. Start production build:
   ```bash
   pnpm start
   ```

## Roles & Logins (from seed)
- Student: `riya@student.edu` / `Password@123`
- Counsellor: `arjun@counselor.edu` / `Password@123`
- Admin: `admin@campus.edu` / `Password@123`

## Key APIs (examples)
- Auth: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/profile`
- Appointments: `GET /api/appointments/:userId`, `POST /api/appointments`, `PATCH /api/appointments/:id`
- Assessments: `GET /api/assessments/:userId`, `POST /api/assessments`
- Resources: `GET /api/resources`, `GET /api/resources/:id`, `PATCH /api/resources/:id/likes`
- Forum: `GET /api/forum`, `POST /api/forum`, `POST /api/forum/:id/reply`, `POST /api/forum/:id/like`, `POST /api/forum/:id/view`
- Admin: `GET /api/admin/stats`, `GET /api/admin/wellness-metrics`, `GET /api/admin/appointment-analytics`, `GET /api/admin/forum-activity`, `GET /api/admin/high-risk-flags`, `PATCH /api/admin/user/:userId/status`, `POST /api/admin/assign-counselor`

## Deployment Notes
- Works as a single-port app (Vite + Express). For Netlify/Vercel, use the server entry in `netlify/functions/api.ts` or adapt `server/index.ts` to your platform.
- Ensure `MONGODB_URI` and `JWT_SECRET` are set in the hosting env.

## Current Quality Status
- TypeScript strict mode enabled; major API surfaces typed.
- Remaining lint items: a few inline animation delay styles and accessibility titles/placeholders. Can be cleaned quickly if required.
- Vitest is available; add suites as needed.

## Scripts
- `pnpm dev` – Dev server (client + server)
- `pnpm build` – Build client + server
- `pnpm start` – Run production server
- `pnpm typecheck` – TypeScript check
- `pnpm test` – Vitest (add tests first)
- `pnpm tsx server/seed.ts` – Seed sample data

## Contact
For questions or deployment help, open an issue or reach out.
