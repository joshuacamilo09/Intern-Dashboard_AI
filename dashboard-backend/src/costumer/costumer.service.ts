import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole, CustomerStatus } from '@prisma/client';
import { PrismaService } from 'prisma/PrismaService';

@Injectable()
export class CostumerService {
  constructor(private readonly prisma: PrismaService) {}

  async createCostumer(
    companyId: string,
    requesterRole: UserRole,
    data: { name: string; email: string; phone?: string },
  ) {
    this.ensureManagerOrAdmin(requesterRole);

    const exisitingCostumer = await this.prisma.customer.findUnique({
      where: { email_companyId: { email: data.email, companyId } },
    });

    if (exisitingCostumer)
      throw new ConflictException('Customer already exists in your company');

    return this.prisma.customer.create({
      data: { ...data, companyId, status: CustomerStatus.ACTIVE },
    });
  }

  async listCustomers(companyId: string, filters?: any) {
    const customers = await this.prisma.customer.findMany({
      where: {
        companyId,
        status: filters?.status,
        createdAt: filters?.creationDate
          ? { gte: filters.creationDate }
          : undefined,
      },
      orderBy: filters?.orderBy
        ? { [filters.orderBy]: filters.order ?? 'asc' }
        : { createdAt: 'desc' },
      include: {
        orders: { select: { id: true, totalAmount: true, status: true } },
      },
    });

    return customers.map((customer) => ({
      ...customer,
      totalOrders: customer.orders.length,
      totalSpent: customer.orders
        .filter((o) => o.status === 'PAID')
        .reduce((s, o) => s + Number(o.totalAmount), 0),
    }));
  }

  async getCustomerById(companyId: string, customerId: string) {
    return await this.ensureActiveCustomer(customerId, companyId);
  }

  async updateCustomer(
    companyId: string,
    requesterRole: UserRole,
    customerId: string,
    data: any,
  ) {
    this.ensureManagerOrAdmin(requesterRole);
    await this.ensureActiveCustomer(customerId, companyId);
    return this.prisma.customer.update({
      where: { id: customerId, companyId },
      data,
    });
  }

  async deactiverCustomer(
    companyId: string,
    requesterRole: UserRole,
    customerId: string,
  ) {
    this.ensureManagerOrAdmin(requesterRole);
    await this.ensureActiveCustomer(customerId, companyId);
    return this.prisma.customer.update({
      where: { id: customerId, companyId },
      data: { status: CustomerStatus.INACTIVE },
    });
  }

  private ensureManagerOrAdmin(role: UserRole) {
    if (role !== UserRole.ADMIN && role !== UserRole.MANAGER)
      throw new ForbiddenException('Access denied');
  }

  private async ensureActiveCustomer(customerId: string, companyId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, companyId },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    if (customer.status === CustomerStatus.INACTIVE)
      throw new ForbiddenException('Customer is inactive');
    return customer;
  }
}