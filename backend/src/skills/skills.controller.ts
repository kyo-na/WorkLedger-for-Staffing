import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  findAll() { return this.skillsService.findAll(); }

  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.skillsService.create(body);
  }

  // ★ 削除: スキルマスタそのもの
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.remove(id);
  }
}