import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CostumerService } from './costumer.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole, CustomerStatus } from '@prisma/client';
import { AuthGuard } from 'src/auth/Guards/AuthGuard';
import { RolesGuard } from 'src/auth/Guards/roles.guards'; // ✅ Importado
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  GetCurrentCompanyId,
  GetCurrentUserRole,
} from 'src/auth/decorators/get.current.user';

@ApiTags('Customers')
@ApiBearerAuth('access-token')
// ✅ Adicionado RolesGuard para que as permissões funcionem
@UseGuards(AuthGuard, RolesGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CostumerService) {}

  // ❌ Apenas ADMIN e MANAGER podem criar clientes
  @Post()
  @Roles('ADMIN', 'MANAGER')
  async createCustomer(
    @GetCurrentUserRole() role: UserRole,
    @GetCurrentCompanyId() companyId: string,
    @Body() body: { name: string; email: string; phone?: string },
  ) {
    return this.customerService.createCostumer(companyId, role, body);
  }

  // ✅ Todos os níveis (incluindo VIEWER) podem listar clientes
  @Get()
  @Roles('ADMIN', 'MANAGER', 'VIEWER')
  async listCustomers(
    @GetCurrentCompanyId() companyId: string,
    @Query('status') status?: CustomerStatus,
    @Query('createdAt') createdAt?: string,
    @Query('orderBy') orderBy?: 'name' | 'createdAt',
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.customerService.listCustomers(companyId, {
      status,
      creationDate: createdAt ? new Date(createdAt) : undefined,
      orderBy,
      order,
    });
  }

  // ✅ Todos os níveis (incluindo VIEWER) podem ver detalhes de um cliente
  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'VIEWER')
  async getCustomerById(
    @GetCurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    return this.customerService.getCustomerById(companyId, id);
  }

  // ❌ Apenas ADMIN e MANAGER podem editar clientes
  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  async updateCustomer(
    @GetCurrentUserRole() role: UserRole,
    @GetCurrentCompanyId() companyId: string,
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; phone?: string },
  ) {
    return this.customerService.updateCustomer(companyId, role, id, body);
  }

  // ❌ Apenas ADMIN e MANAGER podem desativar clientes
  @Patch(':id/deactivate')
  @Roles('ADMIN', 'MANAGER')
  async deactivateCustomer(
    @GetCurrentUserRole() role: UserRole,
    @GetCurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    return this.customerService.deactiverCustomer(companyId, role, id);
  }
}
