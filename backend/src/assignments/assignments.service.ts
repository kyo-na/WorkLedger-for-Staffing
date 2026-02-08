import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  // 全件取得 (契約書一覧用)
  async findAll() {
    return this.prisma.assignment.findMany({
      include: {
        staff: true,
        project: {
          include: { client: true }
        }
      },
      orderBy: { startDate: 'desc' }
    });
  }

  // 1件取得 (契約書印刷用)
  async findOne(id: number) {
    return this.prisma.assignment.findUnique({
      where: { id },
      include: {
        staff: true,
        project: {
          include: { client: true }
        }
      }
    });
  }
}