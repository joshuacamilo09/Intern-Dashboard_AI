import 'dotenv/config';

export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  migrations: {
    seed: 'ts-node prisma/seeds/seed.ts',
  },
};
