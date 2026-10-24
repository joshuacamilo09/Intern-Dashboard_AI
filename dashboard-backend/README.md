# dashboard-backend

NestJS API of the Business Analytics Dashboard. See the [main README](../README.md) for the architecture, API and setup.

```bash
cp .env.example .env
npm install
npx prisma db push     # creates the schema from prisma/schema.prisma
npm run seed           # optional: admin + manager users from SEED_* variables
npm run start:dev      # http://localhost:3000 · Swagger at /docs
```
