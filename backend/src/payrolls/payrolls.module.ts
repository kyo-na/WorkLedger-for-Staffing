import { Module } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { PayrollsController } from './payrolls.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PayrollsController],
  providers: [PayrollsService, PrismaService],
})
export class PayrollsModule {}