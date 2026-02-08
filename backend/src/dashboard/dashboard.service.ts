import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // ダッシュボード用 (Topページ)
  async getStats() {
    const today = new Date();
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const staffCount = await this.prisma.staff.count({ where: { status: 'active' } });
    const clientCount = await this.prisma.client.count();
    const activeProjects = await this.prisma.project.count({ where: { status: 'active' } });

    const thisMonthSalesAgg = await this.prisma.invoice.aggregate({
      _sum: { totalAmount: true },
      where: { issueDate: { gte: startOfThisMonth, lt: startOfNextMonth } },
    });
    const monthlySales = thisMonthSalesAgg._sum.totalAmount || 0;
    const monthlyProfit = Math.floor(monthlySales * 0.3);

    const monthlyTrend: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const monthSales = await this.prisma.invoice.aggregate({
        _sum: { totalAmount: true },
        where: { issueDate: { gte: mStart, lt: mEnd } }
      });
      monthlyTrend.push({ 
        month: `${d.getMonth() + 1}月`, 
        amount: monthSales._sum.totalAmount || 0 
      });
    }

    return { staffCount, clientCount, activeProjects, monthlySales, monthlyProfit, monthlyTrend };
  }

  // 分析レポート用
  async getAnalysis(year: number) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    const baseCostRate = 0.65; // 基本原価率

    const invoices = await this.prisma.invoice.findMany({
      where: { issueDate: { gte: startOfYear, lt: endOfYear } },
      include: { client: true }
    });

    // 1. 月次データの作成
    const monthlyData: any[] = [];
    let totalSales = 0;
    let totalCost = 0;

    for (let i = 0; i < 12; i++) {
      const mStart = new Date(year, i, 1);
      const mEnd = new Date(year, i + 1, 1);
      
      const monthInvoices = invoices.filter(inv => {
        const d = new Date(inv.issueDate);
        return d >= mStart && d < mEnd;
      });
      
      const monthSales = monthInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
      
      let overtimeHours = 10 + Math.random() * 10; 
      if (i === 2 || i === 8 || i === 11) {
         overtimeHours += 20; 
      }
      
      const monthlyCostRate = baseCostRate + (overtimeHours / 10 * 0.02);
      
      const monthCost = Math.floor(monthSales * monthlyCostRate);
      const monthProfit = monthSales - monthCost;
      const estimatedStaff = monthSales > 0 ? Math.floor(monthSales / 500000) : 0;
      const profitPerHead = estimatedStaff > 0 ? Math.floor(monthProfit / estimatedStaff) : 0;
      const roi = monthCost > 0 ? (monthProfit / monthCost).toFixed(2) : '0.00';

      monthlyData.push({
        month: `${i + 1}月`,
        sales: monthSales,
        cost: monthCost,
        profit: monthProfit,
        margin: monthSales > 0 ? ((monthProfit / monthSales) * 100).toFixed(1) : '0.0',
        staffCount: estimatedStaff,
        profitPerHead: profitPerHead,
        roi: roi,
        overtimeAverage: Math.floor(overtimeHours)
      });

      totalSales += monthSales;
      totalCost += monthCost;
    }

    const grossProfit = totalSales - totalCost;
    const marginRate = totalSales > 0 ? ((grossProfit / totalSales) * 100).toFixed(1) : '0.0';

    const costBreakdown = [
      { name: '給与支給', value: Math.floor(totalCost * 0.84), color: '#3b82f6' },
      { name: '法定福利費', value: Math.floor(totalCost * 0.16), color: '#ef4444' },
    ];

    // 2. 収益ランキング
    const clientMap = new Map<string, number>();
    invoices.forEach(inv => {
      const name = inv.client?.companyName || '顧客未登録';
      const profit = Math.floor(Number(inv.totalAmount) * 0.3);
      clientMap.set(name, (clientMap.get(name) || 0) + profit);
    });

    const ranking = Array.from(clientMap.entries())
      .map(([name, profit]) => ({ name, profit }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);

    // 3. 残業時間ランキング
    const overtimeRanking = [
      { name: '佐藤 健一', hours: 58, department: '開発部', status: 'critical' }, 
      { name: '鈴木 一郎', hours: 44, department: 'インフラ', status: 'warning' }, 
      { name: '田中 美咲', hours: 41, department: 'デザイン', status: 'warning' },
      { name: '高橋 誠', hours: 25, department: '営業', status: 'safe' },
      { name: '渡辺 裕子', hours: 18, department: '事務', status: 'safe' },
    ];

    // 4. 有給休暇データ
    const paidLeaveData = [
      { name: '取得義務 達成済', value: 65, color: '#10b981' }, 
      { name: 'あと1~2日で達成', value: 25, color: '#facc15' }, 
      { name: '未取得 (危険)', value: 10, color: '#ef4444' },   
    ];

    // 5. 有休取得アラートリスト
    const paidLeaveAlerts = [
      { name: '山本 大介', department: '営業部', totalDays: 20, usedDays: 1, remainingObligation: 4 },
      { name: '加藤 さくら', department: '開発部', totalDays: 15, usedDays: 2, remainingObligation: 3 },
      { name: '小林 剛', department: 'インフラ', totalDays: 12, usedDays: 2, remainingObligation: 3 },
      { name: '中村 翔太', department: '開発部', totalDays: 10, usedDays: 3, remainingObligation: 2 },
    ];

    // 6. 契約更新データ
    const renewalData = [
      { month: '2026-03', done: 12, negotiating: 5, pending: 3, total: 20 },
      { month: '2026-04', done: 8, negotiating: 10, pending: 12, total: 30 }, 
      { month: '2026-05', done: 0, negotiating: 2, pending: 15, total: 17 },
    ];

    // 7. 契約更新アラート
    const renewalAlerts = [
      { name: '伊藤 健太', project: 'ECサイト構築', endDate: '2026-03-31', status: 'pending', daysLeft: 25 },
      { name: '木村 次郎', project: '基幹システム刷新', endDate: '2026-03-31', status: 'negotiating', daysLeft: 25 },
      { name: '斎藤 結衣', project: 'アプリ保守', endDate: '2026-04-30', status: 'pending', daysLeft: 55 },
    ];

    // ★追加 8. 組織スキル分布 (Skill Radar)
    const skillRadar = [
      { subject: 'Backend', A: 90, fullMark: 100 },
      { subject: 'Frontend', A: 75, fullMark: 100 },
      { subject: 'Cloud', A: 60, fullMark: 100 },
      { subject: 'Mobile', A: 40, fullMark: 100 },
      { subject: 'Data/AI', A: 30, fullMark: 100 },
      { subject: 'Infra', A: 85, fullMark: 100 },
    ];

    // ★追加 9. 案件マッチング提案 (Matching Suggestions)
    const matchingSuggestions = [
      { 
        project: '大手銀行DXアプリ開発', 
        reqSkill: 'Java, AWS', 
        candidate: '佐藤 健一', 
        staffExp: 'Java(7年), AWS(3年)', 
        matchRate: 98,
        status: 'available' 
      },
      { 
        project: '医療系SaaSフロントエンド', 
        reqSkill: 'React, TypeScript', 
        candidate: '田中 美咲', 
        staffExp: 'React(4年)', 
        matchRate: 85,
        status: 'negotiating'
      },
      { 
        project: '社内インフラAWS移行', 
        reqSkill: 'AWS, Terraform', 
        candidate: '鈴木 一郎', 
        staffExp: 'Azure(5年)', 
        matchRate: 70, 
        status: 'available'
      },
    ];

    return { 
      summary: { totalSales, totalCost, grossProfit, marginRate },
      costBreakdown, 
      monthlyData,
      ranking,
      overtimeRanking,
      paidLeaveData,
      paidLeaveAlerts,
      renewalData,
      renewalAlerts,
      skillRadar,          // ★レスポンスに追加
      matchingSuggestions  // ★レスポンスに追加
    };
  }

  // ★追加: マッチング専用ダッシュボード用 (/matching ページ用)
  async getMatchingData() {
    // 1. 稼働状況サマリー (KPI)
    const summary = {
      openPositions: 15,       // 募集中案件数
      availableStaff: 8,       // アサイン可能(待機予定)スタッフ数
      matchRate: 92.5,         // 平均マッチング精度
      opportunityLoss: 4500000 // 機会損失額(月間推定)
    };

    // 2. 組織スキルヒートマップ (レーダーチャート用)
    const skillRadar = [
      { subject: 'Backend', A: 95, fullMark: 100 },  // Java, Go, PHP
      { subject: 'Frontend', A: 70, fullMark: 100 }, // React, Vue
      { subject: 'Cloud', A: 50, fullMark: 100 },    // AWS, Azure
      { subject: 'Mobile', A: 30, fullMark: 100 },   // iOS, Android
      { subject: 'Data/AI', A: 40, fullMark: 100 },  // Python, SQL
      { subject: 'Infra', A: 85, fullMark: 100 },    // Linux, Network
    ];

    // 3. アサイン可能スタッフの空き予定 (Timeline)
    const availabilityTimeline = [
      { month: '3月', count: 3, label: '即戦力' },
      { month: '4月', count: 8, label: '契約満了' },
      { month: '5月', count: 5, label: '要営業' },
    ];

    // 4. AIマッチング提案 (Smart Matching List)
    const matches = [
      {
        id: 1,
        staffName: '佐藤 健一',
        staffRole: 'Backend Lead',
        staffExp: 'Java(7y), Spring(5y)',
        staffImg: '👨‍💻',
        projectName: '大手金融DX基盤構築',
        projectTech: 'Java, AWS, Microservices',
        price: '90万',
        matchScore: 98,
        tags: ['Best Match', '単価UP'],
        reason: 'Java経験とAWSの知見が案件要件と完全一致。過去の金融案件評価も高い。'
      },
      {
        id: 2,
        staffName: '田中 美咲',
        staffRole: 'Frontend Engineer',
        staffExp: 'React(3y), TypeScript(2y)',
        staffImg: '👩‍💻',
        projectName: '医療系SaaS UI刷新',
        projectTech: 'React, Next.js, Figma',
        price: '75万',
        matchScore: 89,
        tags: ['Skill Match'],
        reason: 'Reactの実務経験が豊富。デザインツール(Figma)の使用経験もプラス評価。'
      },
      {
        id: 3,
        staffName: '鈴木 一郎',
        staffRole: 'Infra Engineer',
        staffExp: 'Linux(10y), On-Prem(8y)',
        staffImg: '👨‍🔧',
        projectName: 'クラウド移行(AWS)案件',
        projectTech: 'AWS, Terraform',
        price: '80万',
        matchScore: 72,
        tags: ['Challenge', '教育枠'],
        reason: 'クラウド経験は浅いが、強固なLinux知識があり、Terraform習得への意欲が高い。'
      },
    ];

    return { summary, skillRadar, availabilityTimeline, matches };
  }

  // ★追加: 人間性・価値観マッチング用
  async getCultureMatchingData() {
    // 1. マッチングサマリー
    const summary = {
      highSynergyCandidates: 5, // 高シナジー候補者
      teamMoralePrediction: '上昇傾向', 
      avgCultureScore: 88.4
    };

    // 2. 組織のカルチャー傾向 (全体平均)
    const companyCulture = [
      { subject: '協調性', A: 80, fullMark: 100 },
      { subject: '外交性', A: 60, fullMark: 100 },
      { subject: '誠実性', A: 90, fullMark: 100 }, // 日本企業らしい真面目さ
      { subject: '開放性', A: 50, fullMark: 100 },
      { subject: '情緒安定', A: 70, fullMark: 100 },
    ];

    // 3. 人間性マッチング提案 (Culture Fit Matches)
    const matches = [
      {
        id: 1,
        staffName: '山本 大介',
        type: 'ムードメーカー型',
        staffImg: '🙋‍♂️',
        projectName: '新規事業開発チーム',
        projectCulture: '挑戦的・フラット・混沌',
        matchScore: 96,
        tags: ['Culture Best Match', 'リーダー適性'],
        // 性格レーダーデータ (プロジェクト vs 本人)
        radarData: [
          { subject: '協調性', project: 70, staff: 85 },
          { subject: '外交性', project: 90, staff: 95 },
          { subject: '誠実性', project: 60, staff: 70 },
          { subject: '開放性', project: 95, staff: 90 },
          { subject: '情緒安定', project: 50, staff: 80 },
        ],
        reason: 'カオスな新規事業現場において、高い「外交性」と「情緒安定性」を持つ山本氏は、チームの精神的支柱になれます。',
        values: ['挑戦重視', 'チームワーク', '自律駆動']
      },
      {
        id: 2,
        staffName: '加藤 さくら',
        type: '職人・スペシャリスト型',
        staffImg: '👩‍🔬',
        projectName: '金融基幹システム保守',
        projectCulture: '安定的・規律重視・正確性',
        matchScore: 92,
        tags: ['Stress Free', '定着率高'],
        radarData: [
          { subject: '協調性', project: 60, staff: 60 },
          { subject: '外交性', project: 40, staff: 30 },
          { subject: '誠実性', project: 95, staff: 98 },
          { subject: '開放性', project: 30, staff: 40 },
          { subject: '情緒安定', project: 90, staff: 90 },
        ],
        reason: '「誠実性」が極めて高く、ルーチンワークや厳格なルールを好む性格が、ミスの許されない金融案件と完全に合致します。',
        values: ['安定志向', '正確性', 'ソロワーク']
      },
      {
        id: 3,
        staffName: '中村 翔太',
        type: 'バランサー・調整型',
        staffImg: '🧘',
        projectName: '炎上案件の火消し',
        projectCulture: '高負荷・プレッシャー・混乱',
        matchScore: 85,
        tags: ['Resilience', 'メンタル強'],
        radarData: [
          { subject: '協調性', project: 50, staff: 90 },
          { subject: '外交性', project: 60, staff: 70 },
          { subject: '誠実性', project: 70, staff: 80 },
          { subject: '開放性', project: 50, staff: 60 },
          { subject: '情緒安定', project: 40, staff: 95 },
        ],
        reason: '混乱した現場（低い情緒安定スコア）に対し、圧倒的な「情緒安定性」と「協調性」を持つ中村氏が入ることで、現場が鎮静化します。',
        values: ['貢献意欲', '秩序維持', 'サポート']
      },
    ];

    return { summary, companyCulture, matches };
  }
}