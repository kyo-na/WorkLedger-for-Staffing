'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, Building2, Briefcase, DollarSign, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    staffCount: 0,
    clientCount: 0,
    activeProjects: 0,
    monthlySales: 0,
    monthlyProfit: 0, // 粗利益
    monthlyTrend: [] as any[]
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:3000/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error('Dashboard fetch error:', e);
      }
    };
    fetchStats();
  }, []);

  // 日付取得
  const today = new Date();
  const currentMonthLabel = `${today.getMonth() + 1}月`;

  // ■売上の表示ロジック（グラフデータ優先）
  let displaySales = stats.monthlySales;
  if (!displaySales && stats.monthlyTrend.length > 0) {
    const found = stats.monthlyTrend.find(d => d.month === currentMonthLabel);
    if (found) {
      displaySales = found.amount;
    } else {
      displaySales = stats.monthlyTrend[stats.monthlyTrend.length - 1].amount;
    }
  }

  // ■粗利益の表示ロジック (売上の30%と仮定、またはDBの値)
  const displayProfit = stats.monthlyProfit || Math.floor(displaySales * 0.3);
  
  // ■マージン率の計算
  const marginRate = displaySales > 0 ? ((displayProfit / displaySales) * 100).toFixed(1) : '0.0';

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in pb-20">
        
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">経営ダッシュボード</h2>
            <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wider">System Overview & Analytics</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-bold text-slate-500 text-sm">
             TODAY: {today.toLocaleDateString()}
          </div>
        </div>

        {/* KPI カードエリア: 5列で表示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <KPICard 
            title="稼働スタッフ数" 
            value={`${stats.staffCount}`} 
            unit="名" 
            icon={<Users className="text-white" size={24}/>} 
            color="bg-blue-500"
          />
          <KPICard 
            title="取引先企業数" 
            value={`${stats.clientCount}`} 
            unit="社" 
            icon={<Building2 className="text-white" size={24}/>} 
            color="bg-emerald-500"
          />
          <KPICard 
            title="稼働中案件数" 
            value={`${stats.activeProjects}`} 
            unit="件" 
            icon={<Briefcase className="text-white" size={24}/>} 
            color="bg-orange-500"
          />
          <KPICard 
            title="今月の売上予測" 
            value={`¥${Math.floor(Number(displaySales) / 10000)}`} 
            unit="万" 
            icon={<DollarSign className="text-white" size={24}/>} 
            color="bg-pink-500"
          />
          {/* ★追加: 粗利益カード */}
          <KPICard 
            title="今月の粗利益" 
            value={`¥${Math.floor(Number(displayProfit) / 10000)}`} 
            unit={`万 (${marginRate}%)`} 
            icon={<TrendingUp className="text-white" size={24}/>} 
            color="bg-indigo-500"
          />
        </div>

        {/* メインコンテンツエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 左側: 売上推移チャート */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="text-indigo-500"/> 売上推移
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyTrend.length > 0 ? stats.monthlyTrend : [{month:'-', amount:0}]}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={10}/>
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} tickFormatter={(val) => `¥${val/10000}万`}/>
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'}}
                    formatter={(val: any) => [`¥${Number(val).toLocaleString()}`, '売上']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 右側: クイックアクション (小型ウィンドウ) ★ここは消しません！ */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/staff')} 
                    className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all backdrop-blur-sm border border-white/5 group"
                  >
                    <div className="bg-blue-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <Users size={20} className="text-white"/>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">スタッフ登録</p>
                      <p className="text-[10px] text-slate-400">新規採用者の登録</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => router.push('/projects')}
                    className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all backdrop-blur-sm border border-white/5 group"
                  >
                     <div className="bg-emerald-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <Briefcase size={20} className="text-white"/>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">案件アサイン</p>
                      <p className="text-[10px] text-slate-400">プロジェクトへの配属</p>
                    </div>
                  </button>

                   <button 
                    onClick={() => router.push('/attendance')}
                    className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all backdrop-blur-sm border border-white/5 group"
                   >
                     <div className="bg-orange-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <ArrowUpRight size={20} className="text-white"/>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">勤怠確認</p>
                      <p className="text-[10px] text-slate-400">今月の稼働状況</p>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600 rounded-full blur-[80px] opacity-50"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-50"></div>
            </div>

            {/* システムステータス */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
               <h3 className="text-sm font-black text-slate-800 mb-4">System Status</h3>
               <div className="flex items-center gap-3 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl font-bold text-xs">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 All Systems Operational
               </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

function KPICard({ title, value, unit, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="relative z-10 flex justify-between items-start">
        <div>
           <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
             {icon}
           </div>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
           <h3 className="text-2xl lg:text-3xl font-black text-slate-800 truncate">
             {value} <span className="text-xs lg:text-sm text-slate-400 font-bold ml-1">{unit}</span>
           </h3>
        </div>
        <div className="bg-slate-50 text-[10px] font-bold text-slate-400 px-2 py-1 rounded-lg uppercase">Update</div>
      </div>
    </div>
  );
}