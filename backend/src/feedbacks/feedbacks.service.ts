import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbacksService {
  constructor(private prisma: PrismaService) {}

  async create(data: { assignmentId: number; rating: number; comment: string; recorder: string }) {
    return this.prisma.feedback.create({ data });
  }

  async findByAssignment(assignmentId: number) {
    return this.prisma.feedback.findMany({
      where: { assignmentId },
      orderBy: { recordedAt: 'desc' }
    });
  }

  // 最近の評価一覧 (ダッシュボード用)
  async findAllRecent() {
    return this.prisma.feedback.findMany({
      take: 10,
      orderBy: { recordedAt: 'desc' },
      include: {
        assignment: {
          include: {
            staff: true,
            project: { include: { client: true } }
          }
        }
      }
    });
  }
}