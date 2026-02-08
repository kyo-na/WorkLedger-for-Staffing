import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { PrismaService } from '../prisma/prisma.service';

// ★波括弧 { } の中に3つとも列挙されていることを確認
import { StaffController, SkillsController, LicensesController } from './staff.controller';

@Module({
  controllers: [StaffController, SkillsController, LicensesController],
  providers: [StaffService, PrismaService],
})
export class StaffModule {}