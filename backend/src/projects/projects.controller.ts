import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() body: any) {
    return this.projectsService.create(body);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.projectsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }

  // --- アサイン管理 ---
  
  @Post(':id/assignments')
  addAssignment(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.projectsService.addAssignment(id, body);
  }

  @Delete('assignments/:assignmentId')
  removeAssignment(@Param('assignmentId', ParseIntPipe) assignmentId: number) {
    return this.projectsService.removeAssignment(assignmentId);
  }
}