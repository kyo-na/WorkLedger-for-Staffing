import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  // アサインとイベントの両方を取得してカレンダー用に整形
  async findAll() {
    // 1. アサイン情報の取得
    const assignments = await this.prisma.assignment.findMany({
      include: { staff: true, project: true },
      where: { isActive: true } // 稼働中のものだけ
    });

    // 2. カレンダーイベントの取得
    const events = await this.prisma.event.findMany({
      include: { staff: true },
    });

    // 3. アサインをカレンダー形式に変換 (IDに接頭辞をつける)
    const formattedAssignments = assignments.map((a) => ({
      id: `assign-${a.id}`, // フロントエンドで識別できるようにIDを変更
      title: `[案件] ${a.staff.name}: ${a.project.name}`,
      start: a.startDate,
      end: a.endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 未定なら1年後まで表示
      backgroundColor: a.color || '#3b82f6',
      borderColor: a.color || '#3b82f6',
      allDay: true,
      extendedProps: { type: 'assignment', staffId: a.staffId, projectId: a.projectId },
    }));

    // 4. イベントをカレンダー形式に変換
    const formattedEvents = events.map((e) => ({
      id: `event-${e.id}`, // こちらも接頭辞をつける
      title: `${e.staff ? `[${e.staff.name}] ` : ''}${e.title}`,
      start: e.start,
      end: e.end,
      backgroundColor: e.color,
      borderColor: e.color,
      allDay: e.allDay,
      extendedProps: { type: 'event', description: e.description },
    }));

    // 結合して返す
    return [...formattedAssignments, ...formattedEvents];
  }

  // イベント作成
  async create(data: any) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        start: new Date(data.start),
        end: new Date(data.end || data.start),
        allDay: data.allDay ?? true,
        color: data.color || '#10b981',
        staffId: data.staffId ? Number(data.staffId) : null,
        description: data.description,
      },
    });
  }

  // イベント削除
  async remove(idString: string) {
    // IDが "event-123" のような形式で来るため解析する
    if (idString.startsWith('assign-')) {
      throw new BadRequestException('案件アサインはカレンダーからは削除できません。アサイン調整画面で解除してください。');
    }

    if (idString.startsWith('event-')) {
      const id = Number(idString.replace('event-', ''));
      return this.prisma.event.delete({ where: { id } });
    }
    
    // 念のため数値だけで来た場合（旧仕様互換）
    const id = Number(idString);
    if (!isNaN(id)) {
        return this.prisma.event.delete({ where: { id } });
    }
  }
}