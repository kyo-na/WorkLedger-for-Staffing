import { Controller, Get, Post, Body, Param, Delete, Put, Patch, ParseIntPipe } from '@nestjs/common';
import { StaffService } from './staff.service';

// --- スタッフ本体の操作 ---
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  findAll() { return this.staffService.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.staffService.findOne(id); }

  @Post()
  create(@Body() body: any) { return this.staffService.create(body); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) { return this.staffService.update(id, body); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.staffService.remove(id); }

  // 給与設定
  @Put(':id/salary')
  updateSalary(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.staffService.updateSalary(id, body);
  }

  // スキル紐付け (スタッフ個人のスキル)
  @Post(':id/skills')
  addSkill(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.staffService.addSkill(id, body);
  }

  @Delete(':id/skills/:skillId')
  removeSkill(@Param('skillId', ParseIntPipe) skillId: number) {
    return this.staffService.removeSkill(skillId);
  }

  // 資格紐付け (スタッフ個人の資格) ★ここを追加
  @Post(':id/licenses') 
  addLicense(@Param('id', ParseIntPipe) id: number, @Body() body: any) { 
    return this.staffService.addLicense(id, body); 
  }

  @Delete(':id/licenses/:licenseId') 
  removeLicense(@Param('licenseId', ParseIntPipe) licenseId: number) { 
    return this.staffService.removeLicense(licenseId); 
  }
}

// --- スキルマスタ専用 ---
@Controller('skills')
export class SkillsController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  findAll() { return this.staffService.getSkillMaster(); }

  @Post()
  create(@Body() body: any) { return this.staffService.createSkillMaster(body.name); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.staffService.deleteSkillMaster(id); }
}

// --- 資格マスタ専用 ---
@Controller('licenses')
export class LicensesController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  findAll() { return this.staffService.getLicenseMaster(); }

  @Post()
  create(@Body() body: any) { return this.staffService.createLicenseMaster(body.name); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.staffService.deleteLicenseMaster(id); }
}