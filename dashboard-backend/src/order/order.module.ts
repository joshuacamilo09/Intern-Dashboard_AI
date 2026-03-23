import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';

@Module({
  imports: [PrismaModule],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
