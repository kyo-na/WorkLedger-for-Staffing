'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Line, ComposedChart,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, DollarSign, PieChart as PieChartIcon, Activity, 
  Download, Printer, Users, Clock, AlertTriangle, FileText, 
  Clock3, ChevronRight, ArrowUpRight, Target, Briefcase, Calendar
} from 'lucide-react';

export default function AnalysisPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [projectData, setProjectData] = useState<any[]>([]); 
  const [overtimeRanking, setOvertimeRanking] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [paidLeaveData, setPaidLeaveData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [paidLeaveAlerts, setPaidLeaveAlerts] = useState<any[]>([]);
  const [renewalData, setRenewalData] = useState<any[]>([]);
  const [renewalAlerts, setRenewalAlerts] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalSales: 0, totalProfit: 0, avgMargin: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/dashboard/analysis?year=${year}`);
        if (res.ok) {
          const json = await res.json();
          setMonthlyData(json.monthlyData || []);
          setProjectData(json.ranking || []);
          setOvertimeRanking(json.overtimeRanking || []);
          setPaidLeaveData(json.paidLeaveData || []);
          setPaidLeaveAlerts(json.paidLeaveAlerts || []);
          setRenewalData(json.renewalData || []);
          setRenewalAlerts(json.renewalAlerts || []);
          setSummary({ 
            totalSales: json.summary.totalSales, 
            totalProfit: json.summary.grossProfit, 
            avgMargin: Number(json.summary.marginRate) 
          });
        }
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, [year]);

  const handlePrint = () => window.print();

  // カスタムツールチップ用スタイル
  const tooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    color: '#1e293b',
    fontSize: '12px',
    fontWeight: '600',
    padding: '8px 12px'
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/50 space-y-8 p-6 lg:p-10 font-sans text-slate-800 pb-20 print:bg-white print:p-0">
        
        {/* --- Header: Command Center Style --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-sm ring-1 ring-slate-900/5">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-2xl shadow-lg shadow-indigo-500/30">
              <Activity size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                経営分析インサイト
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-extrabold uppercase tracking-wider border border-indigo-100">Pro V2.0</span>
              </h1>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                <Target size={12} />
                リアルタイム経営数値モニタリング & リスク管理
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200">
               <button onClick={handlePrint} className="p-2.5 rounded-lg text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all duration-200">
                 <Printer size={18}/>
               </button>
               <div className="w-px h-4 bg-slate-300 mx-1"></div>
               <button className="p-2.5 rounded-lg text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all duration-200">
                 <Download size={18}/>
               </button>
             </div>
             
             <div className="flex items-center gap-3 bg-white pl-4 pr-2 py-1.5 rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                 <Calendar size={10} /> 年度指定
               </span>
               <input 
                 type="number" 
                 value={year} 
                 onChange={e => setYear(Number(e.target.value))} 
                 className="w-16 bg-transparent font-bold text-lg text-slate-700 outline-none text-right tabular-nums"
               />
             </div>
          </div>
        </header>

        {/* --- KPI Cards: Modern Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Sales */}
          <div className="relative overflow-hidden bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
            <div className="flex justify-between items-start mb-4 relative">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 w-fit">
                <DollarSign size={14} className="text-indigo-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">年間売上高</span>
              </div>
              <ArrowUpRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20}/>
            </div>
            <div className="relative">
              <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter tabular-nums">
                ¥{summary.totalSales.toLocaleString()}
              </h3>
              <div className="mt-4 flex items-center gap-2">
                 <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                 <span className="text-xs font-medium text-slate-400">確定請求ベース</span>
              </div>
            </div>
          </div>

          {/* Card 2: Profit */}
          <div className="relative overflow-hidden bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
            <div className="flex justify-between items-start mb-4 relative">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 w-fit">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">営業粗利益</span>
              </div>
            </div>
            <div className="relative">
              <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter tabular-nums group-hover:text-emerald-700 transition-colors">
                ¥{summary.totalProfit.toLocaleString()}
              </h3>
              <div className="mt-4 flex items-center gap-2">
                 <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">YoY +12.4%</span>
                 <span className="text-xs font-medium text-slate-400">成長推移</span>
              </div>
            </div>
          </div>

          {/* Card 3: Margin */}
          <div className="relative overflow-hidden bg-slate-900 p-6 rounded-[2rem] shadow-lg border border-slate-800 group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-600/10 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 w-fit">
                <PieChartIcon size={14} className="text-indigo-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">平均マージン率</span>
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tighter tabular-nums">
                {summary.avgMargin.toFixed(1)}<span className="text-2xl ml-1 text-slate-500 font-normal">%</span>
              </h3>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{width: `${summary.avgMargin}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Section: Renewal Management & Alerts --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart Area */}
          <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                  契約更新ステータス
                </h3>
                <p className="text-xs text-slate-400 mt-1 pl-4">直近3ヶ月の更新進捗状況</p>
              </div>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                 <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 完了</div>
                 <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 交渉中</div>
                 <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> 未着手</div>
              </div>
            </div>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={renewalData} layout="vertical" margin={{ left: 0, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9"/>
                  <XAxis type="number" hide/>
                  <YAxis dataKey="month" type="category" width={70} tick={{fontSize: 13, fontWeight: '700', fill: '#64748b'}} axisLine={false} tickLine={false}/>
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={tooltipStyle} border={0}/>
                  <Bar dataKey="done" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={32} />
                  <Bar dataKey="negotiating" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} barSize={32} />
                  <Bar dataKey="pending" stackId="a" fill="#ef4444" radius={[0, 8, 8, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts Area */}
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Clock3 size={120}/></div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3 relative z-10">
               <div className="p-2 bg-rose-500/20 rounded-lg"><AlertTriangle className="text-rose-400" size={18}/></div>
               期限アラート通知
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 relative z-10 max-h-[300px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {renewalAlerts.length > 0 ? renewalAlerts.map((item, i) => (
                <div key={i} className="group bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-400/50 p-4 rounded-2xl transition-all duration-200 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm tracking-tight leading-snug">{item.name}</h4>
                    <span className="text-[9px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/20 whitespace-nowrap">残り {item.daysLeft}日</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-3">
                    <Briefcase size={10} /> 
                    <span className="truncate">{item.project}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[10px] text-slate-500">期限: {item.endDate}</span>
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-white transition-colors"/>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 opacity-30 text-sm">アラートはありません</div>
              )}
            </div>
          </div>
        </div>

        {/* --- Section: Compliance & Productivity Analysis --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Overtime Correlation */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                 <div className="p-2 bg-orange-50 text-orange-500 rounded-xl"><Clock size={20}/></div>
                 残業時間・収益相関
               </h3>
             </div>
             <div className="h-[320px]">
               <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={monthlyData}>
                   <defs>
                     <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#f97316" stopOpacity={0.8}/>
                       <stop offset="100%" stopColor="#f97316" stopOpacity={0.2}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                   <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} unit="h"/>
                   <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} unit="%" domain={[0, 60]}/>
                   <RechartsTooltip contentStyle={tooltipStyle} cursor={{fill: '#f8fafc'}} />
                   <Bar yAxisId="left" dataKey="overtimeAverage" name="平均残業(h)" fill="url(#barGrad)" radius={[6, 6, 0, 0]} barSize={24} />
                   <Line yAxisId="right" type="monotone" dataKey="margin" name="マージン率" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill:'#6366f1', strokeWidth:2, stroke:'#fff'}} />
                 </ComposedChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Overtime Risk Ranking */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-6">
               <div className="p-2 bg-rose-50 text-rose-500 rounded-xl"><AlertTriangle size={20}/></div>
               36協定リスク・高負荷順位
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[320px] scrollbar-thin scrollbar-thumb-slate-200">
               {overtimeRanking.map((staff, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-indigo-200 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${staff.hours >= 45 ? 'bg-rose-100 text-rose-600' : 'bg-white text-slate-500 shadow-sm'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1.5">
                        <h4 className="font-bold text-sm text-slate-700 truncate">{staff.name}</h4>
                        <span className={`text-xs font-bold tabular-nums ${staff.hours >= 45 ? 'text-rose-500' : 'text-slate-600'}`}>{staff.hours}h</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${staff.hours >= 45 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                          style={{width: `${Math.min((staff.hours / 80) * 100, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* --- Section: ROI & Productivity --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Productivity */}
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl"><Users size={20}/></div>
                人的労働生産性
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} unit="名"/>
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} unit="万"/>
                    <RechartsTooltip contentStyle={tooltipStyle} cursor={{fill: '#f8fafc'}} />
                    <Bar yAxisId="left" dataKey="staffCount" name="稼働数" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                    <Line yAxisId="right" type="monotone" dataKey="profitPerHead" name="1人当粗利" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill:'#fff', strokeWidth:2, stroke:'#6366f1'}} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* ROI */}
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-8">
                <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl"><TrendingUp size={20}/></div>
                人的資源投資ROI (効率)
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                    <RechartsTooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="roi" name="ROI" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRoi)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* --- Detail Table Section --- */}
        <div className="bg-white rounded-[2.5rem] shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                 <FileText size={24} />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-slate-900">月次詳細レポート</h3>
                 <p className="text-xs text-slate-500 mt-1">労働者派遣法に基づく情報公開・予実管理表</p>
               </div>
             </div>
             <button className="text-xs font-bold text-white bg-slate-900 px-6 py-3 rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2">
               <Download size={14} /> CSV出力
             </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                  <th className="px-8 py-5">対象月</th>
                  <th className="px-8 py-5 text-right">売上高</th>
                  <th className="px-8 py-5 text-right">直接原価</th>
                  <th className="px-8 py-5 text-center">マージン率</th>
                  <th className="px-8 py-5 text-center">稼働人数</th>
                  <th className="px-8 py-5 text-right">1人当生産性</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {monthlyData.map((row, i) => (
                  <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-900">{row.month}</td>
                    <td className="px-8 py-5 text-right tabular-nums">¥{row.sales.toLocaleString()}</td>
                    <td className="px-8 py-5 text-right tabular-nums text-slate-500">¥{row.cost.toLocaleString()}</td>
                    <td className="px-8 py-5 text-center">
                       <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tabular-nums ${row.margin < 30 ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                         {row.margin}%
                       </span>
                    </td>
                    <td className="px-8 py-5 text-center tabular-nums">{row.staffCount}名</td>
                    <td className="px-8 py-5 text-right font-bold text-slate-900 tabular-nums">
                      ¥{row.profitPerHead.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}