import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  findAll() {
    return this.calendarService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.calendarService.create(body);
  }

  // ★修正: IDは文字列(event-1 等)で来る可能性があるため、ParseIntPipeを外してstringで受け取る
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarService.remove(id);
  }
}