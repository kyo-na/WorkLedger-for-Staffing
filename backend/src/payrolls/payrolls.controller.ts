import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';

@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @Get()
  findAll(
    @Query('year') year?: string,
    @Query('month') month?: string
  ) {
    return this.payrollsService.findAll(
      year ? Number(year) : undefined,
      month ? Number(month) : undefined
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.payrollsService.findOne(id);
  }

  @Post('calculate')
  calculate(@Body() body: { year: number; month: number }) {
    return this.payrollsService.calculateMonthlyPayroll(
      Number(body.year), 
      Number(body.month)
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.payrollsService.remove(id);
  }
}