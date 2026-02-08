import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  // --- 認証用 (必須) ---
  async findOneByEmail(email: string) {
    return this.prisma.staff.findUnique({ where: { email } });
  }

  // --- スタッフ操作 ---
  async findAll() {
    return this.prisma.staff.findMany({
      orderBy: { id: 'desc' },
      include: {
        assignments: { include: { project: true } },
        events: true,
      }
    });
  }

  async findOne(id: number) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: {
        skills: { include: { skills: true } },
        licenses: { include: { licenses: true } }, // 資格情報も取得
        salarySettings: true,
        assignments: { 
          include: { project: { include: { client: true } } },
          orderBy: { startDate: 'desc' }
        },
        events: true,
      },
    });
    if (!staff) throw new NotFoundException(`Staff with ID ${id} not found`);
    return staff;
  }

  async create(data: any) {
    return this.prisma.staff.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password || 'password123',
        phone: data.phone || null,
        address: data.address || null,
        status: 'active',
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.staff.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: data.status,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.staff.delete({ where: { id } });
  }

  async updateSalary(staffId: number, data: any) {
    return this.prisma.salary_settings.upsert({
      where: { staff_id: staffId },
      create: { staff_id: staffId, hourly_rate: Number(data.hourly_rate || 0), monthly_salary: Number(data.monthly_salary || 0) },
      update: { hourly_rate: Number(data.hourly_rate || 0), monthly_salary: Number(data.monthly_salary || 0) },
    });
  }

  // --- スキル紐付け (スタッフ個人) ---
  async addSkill(staffId: number, data: { skillId: number; level: string; years: number }) {
    return this.prisma.staff_skills.create({
      data: { 
        staff_id: staffId, 
        skill_id: Number(data.skillId), 
        level: data.level, 
        years_of_exp: Number(data.years || 0) 
      },
    });
  }

  async removeSkill(staffSkillId: number) {
    return this.prisma.staff_skills.delete({ where: { id: staffSkillId } });
  }

  // --- 資格紐付け (スタッフ個人) ★ここを追加 ---
  async addLicense(staffId: number, data: { licenseId: number; obtainedDate: string }) {
    return this.prisma.staff_licenses.create({
      data: { 
        staff_id: staffId, 
        license_id: Number(data.licenseId), 
        obtained_date: data.obtainedDate ? new Date(data.obtainedDate) : null 
      },
    });
  }

  async removeLicense(staffLicenseId: number) {
    return this.prisma.staff_licenses.delete({ where: { id: staffLicenseId } });
  }

  // --- マスタ管理機能 ---
  
  // スキルマスタ
  async getSkillMaster() { return this.prisma.skills.findMany(); }
  
  async createSkillMaster(name: string) { 
    return this.prisma.skills.create({ 
      data: { name } 
    }); 
  }
  
  async deleteSkillMaster(id: number) { 
    return this.prisma.skills.delete({ where: { id } }); 
  }

  // 資格マスタ
  async getLicenseMaster() { return this.prisma.licenses.findMany(); }
  
  async createLicenseMaster(name: string) { 
    return this.prisma.licenses.create({ 
      data: { name } 
    }); 
  }
  
  async deleteLicenseMaster(id: number) { 
    return this.prisma.licenses.delete({ where: { id } }); 
  }
}