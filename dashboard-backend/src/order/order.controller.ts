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

import { CreateOrderDto } from './dto/create';
import UpdateOrderStatusDto from './dto/update';
import { OrdersService } from './order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/Guards/AuthGuard';
import { RolesGuard } from 'src/auth/Guards/roles.guards'; // ✅ Importado
import {
  GetCurrentCompanyId,
  GetCurrentUserId,
  GetCurrentUserRole,
} from 'src/auth/decorators/get.current.user';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Orders') // Alterado de Analytics para Orders
@ApiBearerAuth('access-token')
@Controller('orders')
// ✅ Adicionado RolesGuard aqui para que o @Roles() funcione
@UseGuards(AuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER') // ❌ VIEWER bloqueado (Não pode criar)
  create(
    @GetCurrentUserId() userId: string,
    @GetCurrentCompanyId() companyId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(companyId, userId, dto);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'VIEWER') // ✅ VIEWER pode ver a lista
  findAll(
    @GetCurrentCompanyId() companyId: string,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.ordersService.findAll(companyId, {
      status,
      customerId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'VIEWER') // ✅ VIEWER pode ver detalhes
  findById(@GetCurrentCompanyId() companyId: string, @Param('id') id: string) {
    return this.ordersService.findById(companyId, id);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'MANAGER') 
  updateStatus(
    @GetCurrentUserRole() role: UserRole,
    @GetCurrentCompanyId() companyId: string,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(companyId, role, id, dto);
  }
}
