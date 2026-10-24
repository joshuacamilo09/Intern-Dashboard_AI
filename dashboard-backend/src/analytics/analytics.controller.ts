import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/Guards/roles.guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/Guards/AuthGuard';
import { GetCurrentCompanyId } from 'src/auth/decorators/get.current.user';

@ApiTags('Analytics')
@ApiBearerAuth('access-token')
@Controller('analytics')
@UseGuards(AuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @Roles('ADMIN', 'MANAGER', 'VIEWER')
  async getOverview(
    @GetCurrentCompanyId() companyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    return this.analyticsService.getOverview(companyId, start, end);
  }

  @Get('revenue')
  @Roles('ADMIN', 'MANAGER', 'VIEWER')
  async getRevenueOverTime(
    @GetCurrentCompanyId() companyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('groupBy') groupBy?: 'day' | 'month',
  ) {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    return this.analyticsService.getRevenueOverTime(
      companyId,
      start,
      end,
      groupBy || 'day',
    );
  }

  @Get('top-products')
  @Roles('ADMIN', 'MANAGER', 'VIEWER') // Apenas cargos elevados podem ver performance de produtos
  async getTopProducts(
    @GetCurrentCompanyId() companyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    return this.analyticsService.getTopProducts(
      companyId,
      start,
      end,
      limit ? Number(limit) : 5,
    );
  }

  @Get('revenue-by-category')
  @Roles('ADMIN', 'MANAGER', 'VIEWER')
  async getRevenueByCategory(
    @GetCurrentCompanyId() companyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    return this.analyticsService.getRevenueByCategory(companyId, start, end);
  }

  @Get('recent-orders')
  @Roles('ADMIN', 'MANAGER', 'VIEWER')
  async getRecentOrders(
    @GetCurrentCompanyId() companyId: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getRecentOrders(
      companyId,
      limit ? Number(limit) : 10,
    );
  }

  @Get('recent-activity')
  @Roles('ADMIN', 'MANAGER', 'VIEWER')
  async getRecentActivity(
    @GetCurrentCompanyId() companyId: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getRecentActivity(
      companyId,
      limit ? Number(limit) : 8,
    );
  }
}
