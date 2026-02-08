import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('monthly')
  // フロントエンドからは ?year=2026 のように送られてきます
  async getMonthlyReport(@Query('year', ParseIntPipe) year: number) {
    // Service側のメソッド名は getMonthlyStats なので、ここを修正します
    return this.analysisService.getMonthlyStats(year);
  }

  @Get('projects')
  async getProjectRanking() {
    return this.analysisService.getProjectRanking();
  }

  @Get('summary')
  async getSummary() {
    return this.analysisService.getSummary();
  }
}