import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  create(@Body() body: any) {
    return this.feedbacksService.create({
      assignmentId: Number(body.assignmentId),
      rating: Number(body.rating),
      comment: body.comment,
      recorder: body.recorder || '担当営業'
    });
  }

  @Get('recent')
  findAllRecent() {
    return this.feedbacksService.findAllRecent();
  }

  @Get(':assignmentId')
  findByAssignment(@Param('assignmentId', ParseIntPipe) id: number) {
    return this.feedbacksService.findByAssignment(id);
  }
}