// src/assignments/assignments.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { GetAssignmentsQueryDto, UpdateAssignmentDto } from './dto/assignment.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  findAll(@Query() query: GetAssignmentsQueryDto) {
    // ?importId=IMP-001 のようにクエリでフィルタリング可能（再現性）
    return this.assignmentsService.findAll(query.importId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    // 実際はJWTなどからユーザーIDを取得して渡す
    const currentUserId = '管理者 太郎'; 
    return this.assignmentsService.update(id, updateAssignmentDto, currentUserId);
  }
}