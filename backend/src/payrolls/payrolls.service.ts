import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PayrollsService {
  constructor(private prisma: PrismaService) {}

  // 一覧取得
  async findAll(year?: number, month?: number) {
    const where: any = {};
    if (year && month) {
      where.year = year;
      where.month = month;
    }
    return this.prisma.payroll.findMany({
      where,
      include: { staff: true },
      orderBy: { staffId: 'asc' },
    });
  }

  // 詳細取得
  async findOne(id: number) {
    return this.prisma.payroll.findUnique({
      where: { id },
      include: { staff: true },
    });
  }

  // ★重要: 給与の自動計算 (一括実行)
  async calculateMonthlyPayroll(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // 1. 全スタッフ取得 (時給設定込み)
    const staffs = await this.prisma.staff.findMany({
      where: { status: 'active' },
      include: { salarySettings: true } // salary_settings テーブル
    });

    // ★修正: 型定義を追加
    const results: any[] = [];

    for (const staff of staffs) {
      // 時給設定がない場合はスキップ (または0円計算)
      const hourlyRate = staff.salarySettings?.hourly_rate || 0;

      // 2. 勤怠集計
      const attendances = await this.prisma.attendance.findMany({
        where: {
          staffId: staff.id,
          date: { gte: startDate, lte: endDate },
        }
      });

      let totalMinutes = 0;
      attendances.forEach(a => {
        if (a.startTime && a.endTime) {
          const diff = (new Date(a.endTime).getTime() - new Date(a.startTime).getTime()) / (1000 * 60);
          totalMinutes += (diff - a.breakTime);
        }
      });
      const totalHours = Number((totalMinutes / 60).toFixed(2));

      // 3. 経費集計 (交通費のみ)
      const expenses = await this.prisma.expense.findMany({
        where: {
          staffId: staff.id,
          category: '交通費', // カテゴリが交通費のものだけ
          date: { gte: startDate, lte: endDate },
          status: 'approved'
        }
      });
      const transportation = expenses.reduce((sum, e) => sum + e.amount, 0);

      // 4. 計算ロジック
      const baseAmount = Math.floor(totalHours * hourlyRate); // 基本給
      const overtimeAmount = 0; // 今回は簡易版のため0
      const allowance = 0;      // 手当

      const totalPayment = baseAmount + overtimeAmount + transportation + allowance;

      // 簡易税金計算 (10.21% と仮定)
      const tax = Math.floor(baseAmount * 0.1021); 
      const socialInsurance = 0; // 今回は0
      const totalDeduction = tax + socialInsurance;

      const netAmount = totalPayment - totalDeduction;

      // 5. 保存 (Upsert: あれば更新、なければ作成)
      const payroll = await this.prisma.payroll.upsert({
        where: {
          staffId_year_month: {
            staffId: staff.id,
            year,
            month
          }
        },
        update: {
          baseAmount,
          transportation,
          tax,
          totalPayment,
          totalDeduction,
          netAmount,
          updatedAt: new Date()
        },
        create: {
          staffId: staff.id,
          year,
          month,
          baseAmount,
          transportation,
          tax,
          totalPayment,
          totalDeduction,
          netAmount,
          status: 'draft'
        }
      });
      
      results.push(payroll);
    }
    
    return results;
  }

  // 削除
  async remove(id: number) {
    return this.prisma.payroll.delete({ where: { id } });
  }
}