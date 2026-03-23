//seed padrao com usuarios.
/*
import 'dotenv/config';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import bcrypt from 'bcrypt';

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedEverything() {
  console.log('🌱 Iniciando seed...');

  const adminEmail = process.env.SEED_ADMIN_EMAIL!;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD!;
  const managerEmail = process.env.SEED_MANAGER_EMAIL!;
  const managerPassword = process.env.SEED_MANAGER_PASSWORD!;

  if (!adminEmail || !adminPassword || !managerEmail || !managerPassword) {
    throw new Error('Missing seed environment variables');
  }

  console.log('🏢 Criando empresa padrão...');
  const defaultCompany = await prisma.company.upsert({
    where: { slug: 'solvecode-main' },
    update: {},
    create: {
      name: 'SolveCode Main',
      slug: 'solvecode-main',
    },
  });

  const users = [
    {
      email: adminEmail,
      name: 'Admin User',
      password: await bcrypt.hash(adminPassword, 10),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      companyId: defaultCompany.id, // 👈 Vínculo obrigatório adicionado
    },
    {
      email: managerEmail,
      name: 'Manager User',
      password: await bcrypt.hash(managerPassword, 10),
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      companyId: defaultCompany.id, // 👈 Vínculo obrigatório adicionado
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        companyId: user.companyId, // Garante que usuários antigos ganham a empresa
      },
      create: user,
    });
  }

  console.log(
    `✅ Created ${users.length} users associated with company: ${defaultCompany.name}`,
  );
}

async function main() {
  try {
    await seedEverything();
  } catch (e) {
    console.error('❌ Seed error details:', e);
    process.exit(1);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});

export default seedEverything;
*/
