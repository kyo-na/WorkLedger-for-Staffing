import { Controller, Get, Post, Body, Query } from '@nestjs/common'; // ★PostとBodyを追加
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // 1. メインダッシュボード用
  @Get()
  getStats() {
    return this.dashboardService.getStats();
  }

  // 2. 分析レポート専用
  @Get('analysis')
  getAnalysis(@Query('year') year: string) {
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    return this.dashboardService.getAnalysis(targetYear);
  }

  // 3. 案件マッチング専用
  @Get('matching')
  getMatching() {
    return this.dashboardService.getMatchingData();
  }

  // 4. 人財・カルチャーマッチング専用
  @Get('culture')
  getCulture() {
    return this.dashboardService.getCultureMatchingData();
  }

  // 5. ★追加: 性格・価値観データの更新（保存用）
  @Post('culture/update')
  updateCulture(@Body() body: any) {
    console.log('Received culture data:', body);
    // 本来はここでDB（Prisma等）に保存するロジックを記述します
    return { success: true, message: '人間性データを更新しました' };
  }

  // ★追加: スタッフの新規登録用
  @Post('staff/create')
  createStaff(@Body() body: any) {
    console.log('Creating new staff:', body);
    // 本来は Prisma 等で DB に保存
    // return this.prisma.staff.create({ data: { ... } });
    return { success: true, id: Math.floor(Math.random() * 1000), message: 'スタッフを新規登録しました' };
  }

}