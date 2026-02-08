import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // --- 日次勤怠データの取得 ---
  async findMonthly(staffId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = await this.prisma.attendance.findMany({
      where: {
        staffId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return records;
  }

  // --- 日次勤怠データの保存 (Upsert) ---
  async saveRecord(data: any) {
    const date = new Date(data.date);
    
    let startTime: Date | null = null;
    let endTime: Date | null = null;

    if (data.startTime) {
      startTime = new Date(data.date);
      const [sh, sm] = data.startTime.split(':');
      startTime.setHours(Number(sh), Number(sm));
    }

    if (data.endTime) {
      endTime = new Date(data.date);
      const [eh, em] = data.endTime.split(':');
      endTime.setHours(Number(eh), Number(em));
    }

    return this.prisma.attendance.upsert({
      where: {
        staffId_date: {
          staffId: Number(data.staffId),
          date: date,
        },
      },
      update: {
        startTime,
        endTime,
        breakTime: Number(data.breakTime),
        memo: data.memo,
        status: endTime ? 'completed' : 'working',
        // 承認ステータスが送られてきた場合のみ更新 (なければ維持)
        approvalStatus: data.approvalStatus || undefined,
      },
      create: {
        staffId: Number(data.staffId),
        date: date,
        startTime,
        endTime,
        breakTime: Number(data.breakTime),
        memo: data.memo,
        status: 'working',
        approvalStatus: data.approvalStatus || 'draft',
      },
    });
  }

  // --- 月次ステータスの取得 ---
  async getMonthlyStatus(staffId: number, year: number, month: number) {
    const status = await this.prisma.monthlyAttendance.findUnique({
      where: { staffId_year_month: { staffId, year, month } }
    });
    return status || { status: 'draft' };
  }

  // --- 月次ステータスの更新 ---
  async updateMonthlyStatus(staffId: number, year: number, month: number, status: string) {
    return this.prisma.monthlyAttendance.upsert({
      where: { staffId_year_month: { staffId, year, month } },
      update: { status },
      create: { staffId, year, month, status },
    });
  }
}