import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { StaffModule } from './staff/staff.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { CalendarModule } from './calendar/calendar.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ExpensesModule } from './expenses/expenses.module';
import { AnalysisModule } from './analysis/analysis.module'; // ★追加
import { InvoicesModule } from './invoices/invoices.module';
import { PayrollsModule } from './payrolls/payrolls.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';

@Module({
  imports: [
    StaffModule,
    ClientsModule, 
    ProjectsModule, 
    CalendarModule,
    DashboardModule,
    AttendanceModule,
    ExpensesModule,
    AnalysisModule, // ★追加
    InvoicesModule,
    PayrollsModule,
    AssignmentsModule,
    FeedbacksModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}