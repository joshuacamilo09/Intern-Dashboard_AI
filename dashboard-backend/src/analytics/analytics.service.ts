import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/PrismaService';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(companyId: string, startDate: Date, endDate: Date) {
    // Normalizar datas para evitar problemas de timezone
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const duration = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - duration);
    const prevEnd = new Date(start.getTime() - 1);

    console.log('📊 getOverview called:', {
      companyId,
      currentPeriod: { start, end },
      previousPeriod: { prevStart, prevEnd },
    });

    const [current, previous] = await Promise.all([
      this.getStatsForPeriod(companyId, start, end),
      this.getStatsForPeriod(companyId, prevStart, prevEnd),
    ]);

    console.log('📈 Stats calculated:', { current, previous });

    const calcGrowth = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return parseFloat((((curr - prev) / prev) * 100).toFixed(1));
    };

    return {
      totalRevenue: current.revenue,
      ordersCount: current.orders,
      customersCount: current.customers,
      revenueGrowth: calcGrowth(current.revenue, previous.revenue),
      ordersGrowth: calcGrowth(current.orders, previous.orders),
      customersGrowth: calcGrowth(current.customers, previous.customers),
    };
  }

  private async getStatsForPeriod(companyId: string, start: Date, end: Date) {
    console.log('🔍 getStatsForPeriod:', { companyId, start, end });

    const [orders, revenue, customers] = await Promise.all([
      this.prisma.order.count({
        where: {
          companyId,
          status: 'PAID',
          createdAt: {
            gte: start,
            lte: end, // Mudado para lte pois end já tem 23:59:59
          },
        },
      }),
      this.prisma.order.aggregate({
        where: {
          companyId,
          status: 'PAID',
          createdAt: {
            gte: start,
            lte: end,
          },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.customer.count({
        where: {
          companyId,
          orders: {
            some: {
              status: 'PAID',
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          },
        },
      }),
    ]);

    const result = {
      orders,
      revenue: Number(revenue._sum.totalAmount || 0),
      customers,
    };

    console.log('📊 Period stats:', result);
    return result;
  }

  async getRevenueOverTime(
    companyId: string,
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'month',
  ) {
    // Normalizar datas
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    console.log('📈 getRevenueOverTime:', { companyId, start, end, groupBy });

    const unit =
      groupBy === 'day' ? Prisma.raw("'day'") : Prisma.raw("'month'");

    const result = await this.prisma.$queryRaw<any[]>`
      SELECT
        DATE_TRUNC(${unit}, "createdAt") AS date,
        CAST(SUM("totalAmount") AS FLOAT) AS revenue
      FROM "Order"
      WHERE "companyId" = ${companyId}
        AND "status" = 'PAID'
        AND "createdAt" >= ${start}
        AND "createdAt" <= ${end}
      GROUP BY 1 
      ORDER BY 1 ASC
    `;

    console.log(`📊 Revenue data (${groupBy}):`, result.length, 'records');

    return result.map((item) => ({
      name: new Date(item.date).toLocaleDateString('pt-PT', {
        day: groupBy === 'day' ? '2-digit' : undefined,
        month: '2-digit',
        year: groupBy === 'month' ? 'numeric' : undefined,
      }),
      revenue: Number(item.revenue || 0),
    }));
  }

  async getTopProducts(
    companyId: string,
    startDate: Date,
    endDate: Date,
    limit = 5,
  ) {
    // Normalizar datas
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    console.log('🏆 getTopProducts:', { companyId, start, end, limit });

    const result = await this.prisma.$queryRaw<any[]>`
      SELECT
        p.id AS "productId",
        p.name AS name,
        CAST(SUM(oi.quantity) AS INTEGER) AS quantity,
        CAST(SUM(oi.quantity * oi."priceAtSale") AS FLOAT) AS revenue
      FROM "OrderItem" oi
      JOIN "Order" o ON o.id = oi."orderId"
      JOIN "Product" p ON p.id = oi."productId"
      WHERE o."companyId" = ${companyId}
        AND o.status = 'PAID'
        AND o."createdAt" >= ${start}
        AND o."createdAt" <= ${end}
      GROUP BY p.id, p.name
      ORDER BY revenue DESC 
      LIMIT ${limit}
    `;

    console.log('🏆 Top products found:', result.length);

    // Garantir que quantity seja number (converter BigInt se necessário)
    return result.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      revenue: Number(item.revenue),
    }));
  }

  async getRecentActivity(companyId: string, limit = 8) {
    console.log('🔔 getRecentActivity:', { companyId, limit });

    const [orders, customers] = await Promise.all([
      this.prisma.order.findMany({
        where: { companyId },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { customer: true },
      }),
      this.prisma.customer.findMany({
        where: { companyId },
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const orderActivities = orders.map((o) => ({
      id: `order-${o.id}`,
      type: 'order' as const,
      message: `Novo pedido de ${o.customer?.name || 'Cliente'}`,
      time: o.createdAt,
      color: 'text-purple-500',
    }));

    const customerActivities = customers.map((c) => ({
      id: `cust-${c.id}`,
      type: 'customer' as const,
      message: `Novo cliente: ${c.name}`,
      time: c.createdAt,
      color: 'text-blue-500',
    }));

    const activities = [...orderActivities, ...customerActivities]
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, limit);

    console.log('🔔 Activities found:', activities.length);
    return activities;
  }

  async getRevenueByCategory(
    companyId: string,
    startDate: Date,
    endDate: Date,
  ) {
    // Normalizar datas
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    console.log('🥧 getRevenueByCategory:', { companyId, start, end });

    const result = await this.prisma.$queryRaw<any[]>`
      SELECT
        p.category AS category,
        CAST(SUM(oi.quantity * oi."priceAtSale") AS FLOAT) AS revenue
      FROM "OrderItem" oi
      JOIN "Order" o ON o.id = oi."orderId"
      JOIN "Product" p ON p.id = oi."productId"
      WHERE o."companyId" = ${companyId}
        AND o.status = 'PAID'
        AND o."createdAt" >= ${start}
        AND o."createdAt" <= ${end}
      GROUP BY p.category
    `;

    console.log('🥧 Categories found:', result.length);

    return result.map((item) => ({
      label: item.category || 'Sem Categoria',
      value: Number(item.revenue || 0),
    }));
  }

  async getRecentOrders(companyId: string, limit: number) {
    console.log('📦 getRecentOrders:', { companyId, limit });

    const orders = await this.prisma.order.findMany({
      where: {
        companyId,
        status: 'PAID',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        customer: {
          select: { name: true },
        },
      },
    });

    console.log('📦 Orders found:', orders.length);

    return orders.map((order) => ({
      id: order.id,
      total: Number(order.totalAmount),
      customer: order.customer?.name || 'Cliente Oculto',
      createdAt: order.createdAt,
    }));
  }
}
