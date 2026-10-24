import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Decimal } from '@prisma/client/runtime/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/Guards/AuthGuard';
import { RolesGuard } from 'src/auth/Guards/roles.guards'; // ✅ Importado
import {
  GetCurrentCompanyId,
  GetCurrentUserRole,
} from 'src/auth/decorators/get.current.user';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ProductStatus, UserRole } from '@prisma/client';

@ApiTags('Products')
@ApiBearerAuth('access-token')
// ✅ Adicionado RolesGuard junto ao AuthGuard
@UseGuards(AuthGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly product: ProductService) {}

  // ✅ VIEWER pode ver a lista de produtos
  @Roles('ADMIN', 'MANAGER', 'VIEWER')
  @Get()
  async listProducts(
    @GetCurrentCompanyId() companyId: string,
    @Query('status') status?: ProductStatus,
    @Query('category') category?: string,
    @Query('orderBy') orderBy?: 'name' | 'price' | 'createdAt',
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.product.listProducts(companyId, {
      status,
      category,
      orderBy,
      order,
    });
  }

  // ✅ VIEWER pode ver detalhes de um produto
  @Roles('ADMIN', 'MANAGER', 'VIEWER')
  @Get(':id')
  async getProductById(
    @GetCurrentCompanyId() companyId: string,
    @Param('id') productId: string,
  ) {
    return this.product.getProductById(companyId, productId);
  }

  // ❌ VIEWER bloqueado (403 Forbidden)
  @Roles('ADMIN', 'MANAGER')
  @Post()
  async createProduct(
    @GetCurrentUserRole() role: UserRole,
    @GetCurrentCompanyId() companyId: string,
    @Body()
    body: {
      name: string;
      price: Decimal;
      category: string;
      cost?: Decimal;
      stock?: number;
    },
  ) {
    return this.product.createProduct(companyId, role, body);
  }

  // ❌ VIEWER bloqueado (403 Forbidden)
  @Roles('ADMIN', 'MANAGER')
  @Patch(':id')
  async updateProduct(
    @GetCurrentUserRole() role: UserRole,
    @GetCurrentCompanyId() companyId: string,
    @Param('id') productId: string,
    @Body()
    body: {
      name?: string;
      price?: number;
      category?: string;
      stock?: number;
      cost?: Decimal;
    },
  ) {
    return this.product.updateProduct(companyId, role, productId, body);
  }

  // ❌ VIEWER bloqueado (403 Forbidden)
  @Roles('ADMIN', 'MANAGER')
  @Delete(':id')
  async deactivateProduct(
    @GetCurrentUserRole() role: UserRole,
    @GetCurrentCompanyId() companyId: string,
    @Param('id') productId: string,
  ) {
    return this.product.deactivateProduct(companyId, role, productId);
  }
}
