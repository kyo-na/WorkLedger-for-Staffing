// src/assignments/assignments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAssignmentDto } from './dto/assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  // ---------------------------------------------------------
  // 1. 【再現性】 importId があれば、その時のデータを取得
  // 2. 【例外】 取得したデータにリスク判定ロジックを適用
  // ---------------------------------------------------------
  async findAll(importId?: string) {
    const whereCondition = importId ? { importId } : {};

    const assignments = await this.prisma.assignment.findMany({
      where: whereCondition,
      include: { staff: true, project: true },
      orderBy: { startDate: 'desc' },
    });

    // 取得したデータに対してビジネスルール（例外）チェックを行い、結果を付与して返す
    return assignments.map((assignment) => {
      const risks = this.checkBusinessRules(assignment);
      return {
        ...assignment,
        _exceptions: risks, // フロントエンドで「赤・黄色」表示するためのデータ
      };
    });
  }

  async findOne(id: number) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: { staff: true, project: true },
    });
    if (!assignment) throw new NotFoundException();

    return {
      ...assignment,
      _exceptions: this.checkBusinessRules(assignment),
    };
  }

  // ---------------------------------------------------------
  // 3. 【監査】 更新時に差分(Diff)を取り、ログテーブルに保存
  // ---------------------------------------------------------
  async update(id: number, dto: UpdateAssignmentDto, userId: string = 'system') {
    // A. 更新前のデータを取得（Before）
    const oldData = await this.prisma.assignment.findUnique({ where: { id } });
    if (!oldData) throw new NotFoundException();

    // B. データ更新実行
    const updatedData = await this.prisma.assignment.update({
      where: { id },
      data: dto,
    });

    // C. 監査ログの保存（非同期でOKならawait外しても良い）
    await this.prisma.auditLog.create({
      data: {
        targetId: id,
        action: 'UPDATE',
        performedBy: userId,
        // ここで差分をJSONとして保存
        diff: {
          before: oldData,
          after: updatedData,
        },
      },
    });

    return updatedData;
  }

  // ---------------------------------------------------------
  // ビジネスルール判定ロジック（プライベートメソッド）
  // ---------------------------------------------------------
private checkBusinessRules(assignment: any) {
    // 【修正箇所】配列の中身の型（any[] または詳細な型）を指定する
    const alerts: { level: string; code: string; message: string }[] = []; 
    // ※面倒なら const alerts: any[] = []; でもOKです

    // 【修正済みのロジック】endDateがある場合のみチェック（これで1970年問題も解決）
    if (assignment.endDate && new Date(assignment.startDate) > new Date(assignment.endDate)) {
      alerts.push({ level: 'CRITICAL', code: 'E-002', message: '期間逆転エラー' });
    }

    // HighStressフラグのチェック
    if (assignment.role === 'PM' && assignment.project?.isHighStress) {
      alerts.push({ level: 'WARN', code: 'E-001', message: '高負荷リスク' });
    }

    return alerts;
  }
}