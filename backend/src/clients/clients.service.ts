import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.client.create({
      data: {
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });
  }

  async findAll() {
    return this.prisma.client.findMany({
      orderBy: { id: 'desc' },
      include: { projects: true },
    });
  }

  async findOne(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: { projects: { include: { assignments: true } } },
    });
    if (!client) throw new NotFoundException(`Client with ID ${id} not found`);
    return client;
  }

  async update(id: number, data: any) {
    return this.prisma.client.update({
      where: { id },
      data: {
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.client.delete({ where: { id } });
  }
}