'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, Building2, Briefcase, DollarSign, Activity, ArrowUpRight, Zap, TrendingUp, Layers, BarChart3, PieChart, CalendarDays } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    staffCount: 0,
    clientCount: 0,
    activeProjects: 0,
    monthlySales: 0,
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

  // データ補完ロジック
  const displaySales = stats.monthlySales > 0 
    ? stats.monthlySales 
    : (stats.monthlyTrend.length > 0 ? stats.monthlyTrend[stats.monthlyTrend.length - 1].amount : 0);

  // ダミートレンドデータの生成（UIデモ用）
  const chartData = stats.monthlyTrend.length > 0 ? stats.monthlyTrend : [
    { month: '4月', amount: 4000000 }, { month: '5月', amount: 3000000 },
    { month: '6月', amount: 5000000 }, { month: '7月', amount: 4500000 },
    { month: '8月', amount: 6000000 }, { month: '9月', amount: 5500000 },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 animate-in fade-in pb-20 relative font-sans text-slate-800">
        
        {/* 背景装飾: テクニカルドットグリッド */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        {/* --- Header Section: Command Center --- */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm px-6 py-4 rounded-[24px] flex flex-col md:flex-row justify-between items-center gap-4 transition-all mx-4 mt-2 ring-1 ring-slate-900/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
              <Activity size={24} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                WorkLedger <span className="text-indigo-600">Pro</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Executive Intelligence Board
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Period</span>
                <span className="text-sm font-black text-slate-700 font-mono">2023 FY - Q3</span>
             </div>
             <div className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 shadow-sm flex items-center gap-2">
               <CalendarDays size={16} className="text-slate-400"/>
               {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}
             </div>
          </div>
        </header>

        <div className="px-4 max-w-[1600px] mx-auto w-full space-y-6 relative z-10">
          
          {/* --- KPI Grid: High-Level Metrics --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <KPICard 
              title="Active Staff" 
              subtitle="稼働スタッフ数"
              value={`${stats.staffCount}`} 
              unit="名" 
              icon={<Users size={20} className="text-white"/>} 
              color="from-blue-500 to-blue-600"
              shadowColor="shadow-blue-500/20"
              trend="+12%"
            />
            <KPICard 
              title="Client Partners" 
              subtitle="取引先企業数"
              value={`${stats.clientCount}`} 
              unit="社" 
              icon={<Building2 size={20} className="text-white"/>} 
              color="from-emerald-500 to-emerald-600"
              shadowColor="shadow-emerald-500/20"
              trend="+5%"
            />
            <KPICard 
              title="Active Projects" 
              subtitle="稼働中案件数"
              value={`${stats.activeProjects}`} 
              unit="件" 
              icon={<Briefcase size={20} className="text-white"/>} 
              color="from-orange-500 to-orange-600"
              shadowColor="shadow-orange-500/20"
              trend="Stable"
            />
            <KPICard 
              title="Revenue Forecast" 
              subtitle="今月の売上予測"
              value={`¥${Math.floor(Number(displaySales) / 10000).toLocaleString()}`} 
              unit="万" 
              icon={<DollarSign size={20} className="text-white"/>} 
              color="from-pink-500 to-pink-600"
              shadowColor="shadow-pink-500/20"
              isCurrency
            />
          </div>

          {/* --- Main Analytics Area (Bento Grid) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            
            {/* Revenue Chart Section */}
            <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><BarChart3 size={20}/></div>
                    Revenue Trends
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-[3.25rem] mt-1">Monthly Financial Performance</p>
                </div>
                <button className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors uppercase tracking-wide">
                  View Report 
                </button>
              </div>

              {/* Chart Container */}
              <div className="h-[350px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '700'}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '700'}} 
                      tickFormatter={(val) => `¥${val/10000}万`}
                    />
                    <Tooltip 
                      cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '4 4' }}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                        padding: '12px 20px'
                      }}
                      itemStyle={{ color: '#1e293b', fontWeight: '800', fontSize: '14px' }}
                      labelStyle={{ color: '#94a3b8', fontWeight: '600', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase' }}
                      formatter={(val: any) => [`¥${Number(val).toLocaleString()}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#6366f1" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions Panel (Dark Mode) */}
            <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl shadow-slate-900/20 relative overflow-hidden flex flex-col justify-between h-full">
              
              {/* Decor */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

              <div>
                <div className="relative z-10 flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 backdrop-blur-md">
                    <Zap size={20} className="text-yellow-400 fill-yellow-400"/>
                  </div>
                  <h3 className="text-xl font-black tracking-tight">Quick Actions</h3>
                </div>

                <div className="space-y-4 relative z-10">
                  <ActionButton 
                    label="新規スタッフ登録" 
                    sub="Onboard New Talent"
                    icon={<Users size={18} className="text-white"/>} 
                    color="bg-blue-500" 
                  />
                  <ActionButton 
                    label="案件アサイン調整" 
                    sub="Resource Allocation"
                    icon={<Layers size={18} className="text-white"/>} 
                    color="bg-emerald-500" 
                  />
                  <ActionButton 
                    label="勤怠状況確認" 
                    sub="Attendance Check"
                    icon={<Briefcase size={18} className="text-white"/>} 
                    color="bg-orange-500" 
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">System Status</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-bold text-emerald-300">All Systems Operational</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// デザイン強化版 KPIカード
function KPICard({ title, subtitle, value, unit, icon, color, shadowColor, trend }: any) {
  return (
    <div className="group bg-white p-6 rounded-[28px] border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${shadowColor} group-hover:scale-110 transition-transform duration-500`}>
            {icon}
          </div>
          {trend && (
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
              <TrendingUp size={12} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-600">{trend}</span>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
          <p className="text-xs font-bold text-slate-500 mb-3">{subtitle}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight tabular-nums group-hover:text-indigo-600 transition-colors duration-300">
              {value}
            </h3>
            <span className="text-xs font-bold text-slate-400">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// デザイン強化版 アクションボタン
function ActionButton({ label, sub, icon, color }: any) {
  return (
    <button className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl flex items-center gap-4 transition-all backdrop-blur-md border border-white/5 group active:scale-[0.98]">
      <div className={`${color} p-3 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        {icon}
      </div>
      <div className="text-left flex-1">
        <p className="font-bold text-sm text-white group-hover:text-indigo-200 transition-colors">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium tracking-wide">{sub}</p>
      </div>
      <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"/>
    </button>
  );
}