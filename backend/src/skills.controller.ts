import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.skillsService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(Number(id));
  }
}