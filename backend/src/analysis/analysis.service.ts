import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalysisService {
  constructor(private prisma: PrismaService) {}

  // ★変更点: アサイン(予定)ではなく、請求・給与(実績)から正確なマージン率を算出
  async getMonthlyStats(year: number) {
    // ↓ ここに ': any[]' を追加して型エラーを回避します
    const stats: any[] = [];

    for (let month = 1; month <= 12; month++) {
      // 月の範囲
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // 1. 売上 (Sales): その月に期日を迎える「請求書」の合計
      const invoices = await this.prisma.invoice.findMany({
        where: {
          dueDate: {
            gte: startDate,
            lte: endDate
          }
        }
      });
      const sales = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

      // 2. 原価 (Cost): その月の「給与支給総額」
      // ※給与データ(Payroll)は year/month カラムを持っているので直接指定
      const payrolls = await this.prisma.payroll.findMany({
        where: { year, month }
      });
      
      const salaryTotal = payrolls.reduce((sum, p) => sum + p.totalPayment, 0);
      
      // 法定福利費（会社負担分）の概算: 給与の約15%と仮定
      const socialInsuranceCompanyBurden = Math.round(salaryTotal * 0.15);
      
      const totalCost = salaryTotal + socialInsuranceCompanyBurden;

      // 3. 粗利 & マージン率
      const profit = sales - totalCost;
      const margin = sales > 0 ? (profit / sales) * 100 : 0;

      stats.push({
        month: `${month}月`,
        sales,
        cost: totalCost,
        profit,
        margin: parseFloat(margin.toFixed(1)),
        details: {
          salary: salaryTotal,
          social: socialInsuranceCompanyBurden,
          invoiceCount: invoices.length,
          staffCount: payrolls.length
        }
      });
    }

    return stats;
  }

  // --- 以下は既存の機能を維持 ---

  // プロジェクト別収益ランキング (TOP 5)
  // ※ここはアサインベースの概算でOK
  async getProjectRanking() {
    const projects = await this.prisma.project.findMany({
      include: {
        assignments: true,
        expenses: true,
      }
    });

    const ranking = projects.map(p => {
      // 完了済みまたは進行中のアサインから計算
      const sales = p.assignments.reduce((sum, a) => sum + (a.chargeRate || 0), 0); 
      const personnelCost = p.assignments.reduce((sum, a) => sum + (a.costRate || 0), 0);
      const expenseCost = p.expenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0);
      const profit = sales - (personnelCost + expenseCost);

      return {
        name: p.name,
        sales,
        profit,
      };
    });

    // 利益順にソートして上位5件
    return ranking.sort((a, b) => b.profit - a.profit).slice(0, 5);
  }

  // KPIサマリー取得
  async getSummary() {
    const activeStaffCount = await this.prisma.staff.count({
      where: { status: 'active' }
    });
    
    // 請求書テーブルから確定売上を取得するように変更しても良いですが、
    // 一旦既存ロジック(アサインベース)でも動作はします。
    // ここではより正確な「請求書合計」に変えておきます。
    const invoices = await this.prisma.invoice.findMany();
    const totalSales = invoices.reduce((sum, i) => sum + i.totalAmount, 0);

    return {
      activeStaffCount,
      totalSales
    };
  }
}