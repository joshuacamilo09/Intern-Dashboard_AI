import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/PrismaService';
import { UserRole, ProductStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(companyId: string, requesterRole: string, data: any) {
    this.ensureManagerOrAdmin(requesterRole as UserRole);

    const existing = await this.prisma.product.findFirst({
      where: { name: data.name, category: data.category, companyId },
    });

    if (existing)
      throw new ConflictException('Product already exists in your company');

    return this.prisma.product.create({
      data: { ...data, companyId, status: ProductStatus.ACTIVE },
    });
  }

  async listProducts(companyId: string, filters?: any) {
    return this.prisma.product.findMany({
      where: {
        companyId, // 🔒 Isolamento
        status: filters?.status ?? ProductStatus.ACTIVE,
        category: filters?.category,
      },
      orderBy: filters?.orderBy
        ? { [filters.orderBy]: filters.order ?? 'asc' }
        : { createdAt: 'desc' },
    });
  }

  async getProductById(companyId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, companyId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(
    companyId: string,
    role: string,
    productId: string,
    data: any,
  ) {
    this.ensureManagerOrAdmin(role as UserRole);
    await this.getProductById(companyId, productId); // Garante que é da empresa

    return this.prisma.product.update({
      where: { id: productId, companyId },
      data,
    });
  }

  async deactivateProduct(companyId: string, role: string, productId: string) {
    if (role !== UserRole.ADMIN)
      throw new ForbiddenException('Only admin can delete');
    await this.getProductById(companyId, productId);

    return this.prisma.product.update({
      where: { id: productId, companyId },
      data: { status: ProductStatus.INACTIVE },
    });
  }

  private ensureManagerOrAdmin(role: UserRole) {
    if (role !== UserRole.ADMIN && role !== UserRole.MANAGER)
      throw new ForbiddenException('Access denied');
  }
}