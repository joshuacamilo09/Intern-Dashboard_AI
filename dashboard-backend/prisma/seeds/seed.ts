import 'dotenv/config';
import {
  PrismaClient,
  UserRole,
  UserStatus,
  CustomerStatus,
  ProductStatus,
  OrderStatus,
  Prisma,
  Product,
  Customer,
} from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import bcrypt from 'bcrypt';

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function seedEverything() {
  // ID fixo para garantir que você saiba qual empresa os dados pertencem
  const COMPANY_ID = '00000000-0000-4000-a000-000000000001';

  console.log('🚀 Iniciando Seed...');

  // 1. Criar Empresa
  const company = await prisma.company.upsert({
    where: { id: COMPANY_ID },
    update: {},
    create: {
      id: COMPANY_ID,
      name: 'Global Tech Solutions',
      slug: 'global-tech',
    },
  });

  // 2. Criar Usuário Admin completo puxando do ENV
  console.log('👤 Criando usuário admin...');
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      '❌ Erro: SEED_ADMIN_EMAIL ou SEED_ADMIN_PASSWORD não definidos no .env',
    );
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Criamos o objeto completo conforme o seu modelo "user" (minúsculo)
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      companyId: company.id,
      password: hashedPassword,
      status: UserStatus.ACTIVE,
      role: UserRole.ADMIN,
    },
    create: {
      email: adminEmail,
      name: 'Administrador do Sistema',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      companyId: company.id,
    },
  });

  // 3. Criar Produtos
  console.log('📦 Gerando produtos...');
  const productsRaw = [
    {
      name: 'MacBook Pro M3',
      category: 'Hardware',
      price: 2499.0,
      cost: 1800.0,
    },
    {
      name: 'Dell UltraSharp 27',
      category: 'Hardware',
      price: 650.0,
      cost: 400.0,
    },
    {
      name: 'Licença SaaS Enterprise',
      category: 'Software',
      price: 1200.0,
      cost: 100.0,
    },
  ];

  const products: Product[] = [];
  for (const p of productsRaw) {
    const prod = await prisma.product.create({
      data: {
        name: p.name,
        category: p.category,
        price: new Prisma.Decimal(p.price),
        cost: new Prisma.Decimal(p.cost),
        status: ProductStatus.ACTIVE,
        stock: 50,
        companyId: company.id,
      },
    });
    products.push(prod);
  }

  // 4. Criar Clientes
  console.log('👥 Criando clientes...');
  const customersRaw = [
    {
      name: 'Ricardo Santos',
      email: 'r.santos@gmail.com',
      phone: '+351 912345678',
    },
    {
      name: 'Beatriz Oliveira',
      email: 'beatriz.o@empresa.pt',
      phone: '+351 934555666',
    },
  ];

  const customers: Customer[] = [];
  for (const c of customersRaw) {
    const cust = await prisma.customer.upsert({
      where: { email_companyId: { email: c.email, companyId: company.id } },
      update: {},
      create: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        status: CustomerStatus.ACTIVE,
        companyId: company.id,
      },
    });
    customers.push(cust);
  }

  // 5. Gerar Pedidos (Ajustado para status PAID)
  console.log('🛒 Gerando histórico de vendas...');
  for (let i = 0; i < 40; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];

    const orderDate = new Date();
    // Gera dados nos últimos 45 dias para garantir que o Dashboard tenha o que mostrar
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 45));

    await prisma.order.create({
      data: {
        companyId: company.id,
        customerId: customer.id,
        status: OrderStatus.PAID,
        totalAmount: product.price,
        createdAt: orderDate,
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            priceAtSale: product.price,
          },
        },
      },
    });
  }

  console.log(
    `✅ Seed finalizado! Login: ${adminEmail} | Empresa: ${company.name}`,
  );
}

async function main() {
  try {
    await seedEverything();
  } catch (e) {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  }
}

main().finally(() => prisma.$disconnect());

export default seedEverything;