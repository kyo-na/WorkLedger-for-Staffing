import { Controller, Get, Post, Body, Query, ParseIntPipe, Patch } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  async getMonthly(
    @Query('staffId', ParseIntPipe) staffId: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.attendanceService.findMonthly(staffId, year, month);
  }

  @Post()
  async save(@Body() body: any) {
    return this.attendanceService.saveRecord(body);
  }

  // --- ★追加: 月次ステータス取得 ---
  @Get('status')
  async getStatus(
    @Query('staffId', ParseIntPipe) staffId: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.attendanceService.getMonthlyStatus(staffId, year, month);
  }

  // --- ★追加: 月次ステータス更新 ---
  @Patch('status')
  async updateStatus(@Body() body: any) {
    return this.attendanceService.updateMonthlyStatus(
      Number(body.staffId), 
      Number(body.year), 
      Number(body.month), 
      body.status
    );
  }
}