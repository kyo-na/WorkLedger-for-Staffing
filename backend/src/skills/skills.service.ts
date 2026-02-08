import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  // 一覧取得
  async findAll() {
    return this.prisma.skills.findMany({
      orderBy: { id: 'desc' },
    });
  }

  // 作成
  async create(data: { name: string; description?: string }) {
    return this.prisma.skills.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  // ★ 削除（今回追加した機能）
  async remove(id: number) {
    return this.prisma.skills.delete({
      where: { id },
    });
  }
}