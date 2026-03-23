import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { subMonths } from 'date-fns';
import { PrismaService } from 'prisma/PrismaService';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async getDeepAnalysis(companyId: string, userMessage: string) {
    const threeMonthsAgo = subMonths(new Date(), 3);

    const [revenueData, productPerformance, customerIntel, stockAlerts] =
      await Promise.all([
        // 1. Evolução de Vendas (Últimos 3 meses)
        this.prisma.order.findMany({
          where: {
            companyId,
            createdAt: { gte: threeMonthsAgo },
            status: 'PAID',
          },
          select: { totalAmount: true, createdAt: true },
        }),

        // 2. Performance de Produtos (Lucratividade)
        this.prisma.product.findMany({
          where: { companyId },
          select: { name: true, price: true, cost: true, stock: true },
          orderBy: { stock: 'asc' },
          take: 10,
        }),

        // 3. Clientes VIP (Os que mais gastam)
        this.prisma.customer.findMany({
          where: { companyId },
          select: { name: true, orders: { select: { totalAmount: true } } },
          take: 5,
        }),

        // 4. Alertas de Stock Baixo
        this.prisma.product.count({
          where: { companyId, stock: { lt: 5 }, status: 'ACTIVE' },
        }),
      ]);

    // Prompt de Engenharia para Análise Preditiva
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini', 
      messages: [
        {
          role: 'system',
          content: `You are a Senior AI Business Analyst at SolveCode.
          You have access to the Company Snapshot:
          - 3-month history: ${JSON.stringify(revenueData)}
          - Products/Margins: ${JSON.stringify(productPerformance)}
          - Top Customers: ${JSON.stringify(customerIntel)}
          - Alerts: ${stockAlerts} products with critical stock.
          TASK:
          1. Identify problems (e.g., low margins, sales decline, churn).
          2. Make predictions based on historical data.
          3. Suggest 3 practical actions to increase profit.
          Respond in an executive manner in a professional in any language.`,
        },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.5, // Menos criatividade, mais lógica
    });

    

    return { analysis: completion.choices[0].message.content };
  }
}
