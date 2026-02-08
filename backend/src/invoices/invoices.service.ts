import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  // 1. 一覧取得
  async findAll() {
    return this.prisma.invoice.findMany({
      include: { client: true },
      orderBy: { issueDate: 'desc' },
    });
  }

  // 2. 詳細取得
  async findOne(id: number) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { client: true, items: true },
    });
  }

  // 3. 作成 (完了プロジェクトから予算をそのまま請求)
  async create(data: any) {
    const clientId = Number(data.clientId);
    const issueDate = new Date(data.issueDate || new Date());
    const dueDate = new Date(issueDate.getFullYear(), issueDate.getMonth() + 1, 10);

    // そのクライアントの「完了済み」プロジェクトを取得
    const completedProjects = await this.prisma.project.findMany({
      where: {
        clientId: clientId,
        status: 'completed' // 完了ステータスのみ
      }
    });

    // 明細(Items)を作成: 予算(budget)をそのまま請求額にする
    const items = completedProjects.map(project => ({
      description: `プロジェクト報酬: ${project.name}`,
      quantity: 1,
      unitPrice: project.budget || 0,
      amount: project.budget || 0
    }));

    // 合計計算
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = Math.floor(subtotal * 0.1);
    const totalAmount = subtotal + tax;

    // 請求書データを作成
    return this.prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${Date.now()}`,
        clientId,
        issueDate,
        dueDate,
        subject: `${issueDate.getFullYear()}年${issueDate.getMonth() + 1}月度 御請求書`,
        status: 'draft',
        
        // 金額フィールド
        subtotal,
        tax,
        totalAmount,

        items: {
          create: items 
        }
      },
      include: { items: true }
    });
  }

  // ステータス更新
  async updateStatus(id: number, status: string) {
    return this.prisma.invoice.update({
      where: { id },
      data: { status },
    });
  }

  // 削除
  async remove(id: number) {
    return this.prisma.invoice.delete({ where: { id } });
  }
}