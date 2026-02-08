import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  // 一覧取得 (月・スタッフでフィルタ可能)
  async findAll(staffId?: number, month?: string) {
    const where: any = {};
    
    if (staffId) {
      where.staffId = Number(staffId);
    }

    if (month) {
      // month = "2026-02" 形式
      const [y, m] = month.split('-');
      const startDate = new Date(Number(y), Number(m) - 1, 1);
      const endDate = new Date(Number(y), Number(m), 0);
      where.date = { gte: startDate, lte: endDate };
    }

    return this.prisma.expense.findMany({
      where,
      include: {
        staff: true,
        project: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  // 新規申請
  async create(data: any) {
    return this.prisma.expense.create({
      data: {
        staffId: Number(data.staffId),
        projectId: data.projectId ? Number(data.projectId) : null,
        date: new Date(data.date),
        category: data.category,
        amount: Number(data.amount),
        description: data.description,
        status: 'pending', // 最初は申請中
      },
    });
  }

  // ステータス更新 (承認/却下)
  async updateStatus(id: number, status: string) {
    return this.prisma.expense.update({
      where: { id },
      data: { status },
    });
  }

  // 削除
  async remove(id: number) {
    return this.prisma.expense.delete({ where: { id } });
  }
}