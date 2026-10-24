import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderStatus, UserRole } from '@prisma/client';
import { PrismaService } from 'prisma/PrismaService';
import UpdateOrderStatusDto from './dto/update';
import { CreateOrderDto } from './dto/create';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(companyId: string, userId: string, dto: CreateOrderDto) {
    // 1. Validar Cliente e Produtos (Isolados por Company)
    const customer = await this.ensureCustomerActive(dto.customerId, companyId);
    const products = await this.ensureProductsActive(dto.items, companyId);

    const items = products.map((product) => {
      const itemDto = dto.items.find((i) => i.productId === product.id);
      if (product.stock < itemDto!.quantity)
        throw new BadRequestException(`Sem stock: ${product.name}`);
      return {
        productId: product.id,
        quantity: itemDto!.quantity,
        priceAtSale: product.price,
      };
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * Number(item.priceAtSale),
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId, companyId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      return tx.order.create({
        data: {
          customerId: customer.id,
          companyId,
          totalAmount,
          items: { create: items },
        },
        include: { items: true, customer: true },
      });
    });
  }

  async findAll(companyId: string, filters: any) {
    return this.prisma.order.findMany({
      where: {
        companyId,
        status: filters.status,
        customerId: filters.customerId,
        createdAt: { gte: filters.startDate, lte: filters.endDate },
      },
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(companyId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, companyId },
      include: { customer: true, items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(
    companyId: string,
    role: UserRole,
    orderId: string,
    dto: UpdateOrderStatusDto,
  ) {
    if (role === UserRole.VIEWER) throw new ForbiddenException('No permission');
    const order = await this.findById(companyId, orderId);
    // ... validações de status (ensureValidStatusTransition)
    return this.prisma.order.update({
      where: { id: orderId, companyId },
      data: { status: dto.status },
    });
  }

  // Helpers de validação interna usam sempre o companyId recebido
  private async ensureCustomerActive(id: string, companyId: string) {
    const c = await this.prisma.customer.findFirst({
      where: { id, companyId, status: 'ACTIVE' },
    });
    if (!c) throw new BadRequestException('Cliente inválido');
    return c;
  }

  private async ensureProductsActive(items: any[], companyId: string) {
    const ids = items.map((i) => i.productId);
    const p = await this.prisma.product.findMany({
      where: { id: { in: ids }, companyId, status: 'ACTIVE' },
    });
    if (p.length !== ids.length)
      throw new BadRequestException('Produtos inválidos');
    return p;
  }
}