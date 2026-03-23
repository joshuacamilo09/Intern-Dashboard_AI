import { Module } from '@nestjs/common';
import { CostumerService } from './costumer.service';
import { PrismaService } from 'prisma/PrismaService';
import { PrismaModule } from 'prisma/prisma.module';
import { CustomerController } from './costumer.controller';

@Module({
  providers: [CostumerService],
  controllers: [CustomerController],
  imports: [PrismaModule],
  exports: [CostumerService],
})
export class CostumerModule {}
