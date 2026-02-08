import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status || 'planning',
        clientId: Number(data.clientId),
        budget: Number(data.budget || 0), // ★追加
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { id: 'desc' },
      include: {
        client: true,
        assignments: { include: { staff: true } }, // アサイン詳細も含める
      },
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        assignments: {
          include: { staff: true },
          orderBy: { startDate: 'asc' }
        },
      },
    });
    if (!project) throw new NotFoundException(`Project with ID ${id} not found`);
    return project;
  }

  async update(id: number, data: any) {
    return this.prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status,
        budget: data.budget ? Number(data.budget) : undefined, // ★追加
      },
    });
  }

  async remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }

  // アサイン追加
  async addAssignment(projectId: number, data: any) {
    return this.prisma.assignment.create({
      data: {
        projectId: projectId,
        staffId: Number(data.staffId),
        role: data.role,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        color: '#3b82f6',
      },
    });
  }

  async removeAssignment(assignmentId: number) {
    return this.prisma.assignment.delete({ where: { id: assignmentId } });
  }
}