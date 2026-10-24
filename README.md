# Business Analytics Dashboard with AI Insights

A multi-tenant sales dashboard for small businesses: companies manage their **customers, products and orders**, follow revenue and product performance on interactive charts, and ask an **AI business analyst** questions about their own data.

**Stack:** TypeScript · NestJS · Prisma · PostgreSQL · React 19 · Recharts · OpenAI API

---

## Features

**Operations**
- Customers: create, edit, deactivate
- Products: catalogue with price, cost (margin) and stock
- Orders: multi-item orders with status (`PENDING`, `PAID`, `CANCELED`, `REFUNDED`); order creation checks and **decrements stock inside a database transaction**

**Analytics**
- KPI overview for a chosen date range, compared with the previous period
- Revenue over time (grouped by day or month, SQL aggregation)
- Top products, revenue by category, recent orders and activity feed

**AI analyst**
- `POST /ai/deep-analysis`: builds a snapshot of the company (3-month paid revenue, products and margins, top customers, low-stock alerts) in parallel queries, and sends it with the user's question to **GPT-4o-mini**, which answers as a business analyst. Answers render as Markdown, with formulas supported.

**Teams and access control**
- Every record belongs to a `Company`: queries are always scoped by `companyId` (multi-tenant)
- Roles `ADMIN`, `MANAGER` and `VIEWER`, enforced with a `RolesGuard` (e.g. viewers can read but not create orders)
- Admins invite users and change their roles

## Security

| | |
|---|---|
| Authentication | Short-lived **access token** (Bearer) + **refresh token** in an HttpOnly, SameSite cookie, stored **hashed** and rotated on every refresh |
| Passwords | bcrypt |
| Password reset | Random token stored in the database with a 1-hour expiry, sent by email (Nodemailer); the endpoint never reveals whether an email exists |
| Rate limiting | Global `ThrottlerGuard`, with stricter limits on auth routes (10/min) and password reset (5/min) |
| Headers | Helmet |
| CORS | Allow-list (local frontend + `FRONTEND_URL`), credentials enabled |
| Logging | Winston: console + JSON files for errors and combined logs |

## Architecture

```
┌──────────────────────────────┐   REST + Bearer JWT    ┌──────────────────────────────────────────┐
│ dashboard-frontend           │ ─────────────────────▶ │ dashboard-backend (NestJS)               │
│ React 19 · TypeScript · Vite │                        │ auth · users · customers · products      │
│ Tailwind · Recharts · Axios  │ ◀───────────────────── │ orders · analytics · ai                  │
│ (auto refresh on 401)        │   refresh via cookie   └──────────┬───────────────────┬───────────┘
└──────────────────────────────┘                                   │ Prisma            │ OpenAI SDK
                                                                    ▼                   ▼
                                                            PostgreSQL (Neon)      GPT-4o-mini
```

- **Backend**: one NestJS module per domain (controller, service, DTOs); Prisma with the Neon serverless adapter; Swagger at `/docs` outside production.
- **Frontend**: pages per domain, a service layer per resource, custom hooks (`useOrders`, `useAnalytics`, `useAiAnalysis`…), an `AuthContext`, and an Axios interceptor that refreshes the access token transparently and queues requests made during a refresh.

### Data model

`Company` 1—N `User`, `Customer`, `Product`, `Order`, `ActivityLog` · `Order` 1—N `OrderItem` N—1 `Product` · `User` 1—N `PasswordReset`

## API (overview)

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/signup`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password` · `GET /auth/me` |
| Users | `GET /users` · `POST /users/invite` · `PATCH /users/:id/role`, `/users/:id/deactivate`, `/users/me` |
| Customers | `GET/POST /customers` · `GET/PATCH /customers/:id` · `PATCH /customers/:id/deactivate` |
| Products | `GET/POST /product` · `GET/PATCH/DELETE /product/:id` |
| Orders | `GET/POST /orders` · `GET /orders/:id` · `PATCH /orders/:id/status` |
| Analytics | `GET /analytics/overview`, `/revenue`, `/top-products`, `/revenue-by-category`, `/recent-orders`, `/recent-activity` |
| AI | `POST /ai/deep-analysis` |

Full, interactive reference in Swagger (`/docs`).

## Running locally

Requirements: Node.js 20+, a PostgreSQL database (Neon or local) and an OpenAI API key.

```bash
# backend
cd dashboard-backend
cp .env.example .env              # database, JWT secrets, SMTP, OpenAI key
npm install
npx prisma db push                # create the schema
npm run seed                      # optional: admin + manager from SEED_* variables
npm run start:dev                 # http://localhost:3000 · Swagger at /docs

# frontend
cd ../dashboard-frontend
cp .env.example .env              # VITE_API_URL=http://localhost:3000
npm install
npm run dev                       # http://localhost:5173
```

## Tech stack

| | |
|---|---|
| Backend | NestJS 11, TypeScript, Prisma 7, PostgreSQL (Neon), Passport JWT, bcrypt, Nodemailer, Helmet, @nestjs/throttler, Winston, Swagger |
| AI | OpenAI API (GPT-4o-mini) |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion, Axios, React Router, react-markdown + KaTeX |
