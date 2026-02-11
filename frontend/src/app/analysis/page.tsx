'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Line, ComposedChart,
  AreaChart, Area, Cell
} from 'recharts';
import { 
  TrendingUp, DollarSign, PieChart as PieChartIcon, Activity, 
  Download, Printer, Users, Clock, AlertTriangle, FileText, 
  Clock3, ChevronRight, ArrowUpRight, Target, Briefcase, Calendar,
  ShieldCheck, ArrowDownRight, Layers
} from 'lucide-react';

/**
 * 日本のモダンSaaS風 経営分析ダッシュボード
 * 17年エンジニアの知見：データの透明性と「次に何をすべきか」を可視化
 */
export default function AnalysisPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [overtimeRanking, setOvertimeRanking] = useState<any[]>([]);
  const [renewalData, setRenewalData] = useState<any[]>([]);
  const [renewalAlerts, setRenewalAlerts] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalSales: 0, totalProfit: 0, avgMargin: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // バックエンド：DBA/Stored Proc側で集計済みのクリーンなデータをフェッチ
        const res = await fetch(`http://localhost:3000/dashboard/analysis?year=${year}`);
        if (res.ok) {
          const json = await res.json();
          setMonthlyData(json.monthlyData || []);
          setOvertimeRanking(json.overtimeRanking || []);
          setRenewalData(json.renewalData || []);
          setRenewalAlerts(json.renewalAlerts || []);
          setSummary({ 
            totalSales: json.summary.totalSales, 
            totalProfit: json.summary.grossProfit, 
            avgMargin: Number(json.summary.marginRate) 
          });
        }
      } catch (e) { 
        console.error("Data fetch failed:", e); 
      }
    };
    fetchData();
  }, [year]);

  const handlePrint = () => window.print();

  // カスタムツールチップ：視認性を極限まで高める
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-4 shadow-2xl rounded-xl ring-1 ring-black/5">
          <p className="text-xs font-black text-slate-400 mb-2 uppercase tracking-tighter">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-8 mb-1">
              <span className="text-[13px] font-medium text-slate-600 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                {entry.name}
              </span>
              <span className="text-[13px] font-bold text-slate-900 tabular-nums">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                <span className="ml-0.5 text-[10px] text-slate-400 font-normal">{entry.unit}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f8fafc] space-y-8 p-6 lg:p-10 font-sans text-slate-800 pb-20 print:bg-white print:p-0 transition-all duration-500">
        
        {/* --- Header: Glassmorphism Design --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-200/50">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative p-4 bg-white text-indigo-600 rounded-2xl shadow-sm border border-slate-100">
                <Activity size={32} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Insight<span className="text-indigo-600">Hub</span>
                </h1>
                <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em]">Management</span>
              </div>
              <p className="text-sm font-semibold text-slate-400 flex items-center gap-2 mt-1">
                <Target size={14} className="text-indigo-400" />
                {year}年度：収益・稼働状況のリアルタイム分析
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
               <button onClick={handlePrint} className="p-3 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all">
                 <Printer size={20}/>
               </button>
               <button className="p-3 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all">
                 <Download size={20}/>
               </button>
             </div>
             
             <div className="flex flex-col bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Analysis Period</label>
               <div className="flex items-center gap-2">
                 <Calendar size={14} className="text-indigo-500" />
                 <input 
                   type="number" 
                   value={year} 
                   onChange={e => setYear(Number(e.target.value))} 
                   className="w-16 bg-transparent font-bold text-lg text-slate-700 outline-none tabular-nums"
                 />
               </div>
             </div>
          </div>
        </header>

        {/* --- KPI Cards: Neumorphic-lite style --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Sales */}
          <div className="group relative overflow-hidden bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-indigo-50 transition-colors duration-500">
              <DollarSign size={80} strokeWidth={3} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Gross Sales</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-400 mr-1">¥</span>
                <h3 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter tabular-nums">
                  {summary.totalSales.toLocaleString()}
                </h3>
              </div>
              <div className="mt-8 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <ShieldCheck size={12} className="text-indigo-500" />
                    確定済
                 </div>
                 <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                    <ArrowUpRight size={14} /> 8.2%
                 </div>
              </div>
            </div>
          </div>

          {/* Card 2: Profit */}
          <div className="group relative overflow-hidden bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-100">
            <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-emerald-50 transition-colors duration-500">
              <TrendingUp size={80} strokeWidth={3} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Gross Profit</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-400 mr-1">¥</span>
                <h3 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter tabular-nums group-hover:text-emerald-600 transition-colors">
                  {summary.totalProfit.toLocaleString()}
                </h3>
              </div>
              <div className="mt-8">
                 <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 w-fit">
                    前期比 +¥2,450,000 増加中
                 </div>
              </div>
            </div>
          </div>

          {/* Card 3: Margin */}
          <div className="relative overflow-hidden bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl border border-slate-800 transition-all duration-500 hover:scale-[1.03]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-1 bg-indigo-400 rounded-full"></span>
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Margin Rate</span>
              </div>
              <div className="flex items-baseline gap-1">
                <h3 className="text-5xl font-black text-white tracking-tighter tabular-nums">
                  {summary.avgMargin.toFixed(1)}<span className="text-2xl ml-1 text-slate-500 font-medium">%</span>
                </h3>
              </div>
              <div className="mt-10">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  <span>Performance</span>
                  <span>Target 35%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000" 
                    style={{width: `${summary.avgMargin}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Section: Contract Lifecycle --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-end mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Layers className="text-indigo-600" size={24} />
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">契約更新ステータス</h3>
                </div>
                <p className="text-sm font-medium text-slate-400">直近の契約継続および新規商談のパイプライン推移</p>
              </div>
              <div className="flex gap-6">
                 {['完了', '進行', '保留'].map((label, idx) => (
                   <div key={label} className="flex items-center gap-2">
                     <span className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                     <span className="text-xs font-bold text-slate-500">{label}</span>
                   </div>
                 ))}
              </div>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={renewalData} layout="vertical" margin={{ left: -20, right: 30 }}>
                  <CartesianGrid strokeDasharray="6 6" horizontal={false} stroke="#f1f5f9"/>
                  <XAxis type="number" hide/>
                  <YAxis dataKey="month" type="category" tick={{fontSize: 14, fontWeight: '800', fill: '#94a3b8'}} axisLine={false} tickLine={false}/>
                  <RechartsTooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} content={<CustomTooltip />} />
                  <Bar dataKey="done" name="完了" stackId="a" fill="#10b981" barSize={38} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="negotiating" name="交渉中" stackId="a" fill="#f59e0b" barSize={38} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="pending" name="未着手" stackId="a" fill="#ef4444" barSize={38} radius={[0, 12, 12, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] group-hover:bg-indigo-600/30 transition-colors"></div>
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-4 relative z-10">
               <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20"><AlertTriangle className="text-rose-500" size={20}/></div>
               期限アラート
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 relative z-10 max-h-[400px] pr-2 custom-scrollbar">
              {renewalAlerts.length > 0 ? renewalAlerts.map((item, i) => (
                <div key={i} className="group/item bg-white/5 border border-white/5 backdrop-blur-sm p-5 rounded-[1.5rem] hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-white text-sm tracking-tight">{item.name}</h4>
                    <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">L- {item.daysLeft}日</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mb-4">
                    <Briefcase size={12} className="text-indigo-400" /> 
                    <span className="truncate">{item.project}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                      <Clock3 size={12} /> {item.endDate}
                    </div>
                    <button className="p-2 bg-indigo-600 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all translate-x-4 group-hover/item:translate-x-0">
                      <ChevronRight size={14} className="text-white"/>
                    </button>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <ShieldCheck size={48} className="mb-4" />
                  <p className="text-sm font-bold tracking-widest uppercase">No Alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Section: Advanced Analytics Grid --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Workload Analysis */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Clock size={24}/></div>
                 <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">負荷・収益相関分析</h3>
                   <p className="text-xs font-bold text-slate-400 mt-0.5">残業時間とマージン率のバランス監視</p>
                 </div>
               </div>
             </div>
             <div className="h-[340px]">
               <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#f97316" stopOpacity={0.9}/>
                       <stop offset="100%" stopColor="#fdba74" stopOpacity={0.3}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 700}} dy={15} />
                   <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 11}} unit="h"/>
                   <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 11}} unit="%" domain={[0, 50]}/>
                   <RechartsTooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                   <Bar yAxisId="left" dataKey="overtimeAverage" name="平均残業" fill="url(#barGrad)" radius={[10, 10, 0, 0]} barSize={30} />
                   <Line yAxisId="right" type="stepAfter" dataKey="margin" name="マージン率" stroke="#6366f1" strokeWidth={4} dot={{r: 6, fill:'#6366f1', strokeWidth:3, stroke:'#fff'}} />
                 </ComposedChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Productivity Analysis */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Users size={24}/></div>
                 <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">人的生産性インデックス</h3>
                   <p className="text-xs font-bold text-slate-400 mt-0.5">1名あたりの平均粗利推移</p>
                 </div>
               </div>
             </div>
             <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 700}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 11}} unit="万"/>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="profitPerHead" name="1人当粗利" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>
        </div>

        {/* --- Detail Data Table: Enterprise Grade --- */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-end gap-6">
             <div className="flex items-center gap-5">
               <div className="p-4 bg-slate-900 text-white rounded-[1.5rem]">
                 <FileText size={28} />
               </div>
               <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">月次実績詳細データ</h3>
                 <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">Financial & Operational Metrics</p>
               </div>
             </div>
             <div className="flex gap-3">
                <button className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all flex items-center gap-2">
                  <Layers size={14} /> 表示設定
                </button>
                <button className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                  <Download size={14} /> CSVエクスポート
                </button>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfdfe] text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100">
                  <th className="px-10 py-6">対象月</th>
                  <th className="px-10 py-6 text-right font-black">売上高</th>
                  <th className="px-10 py-6 text-right font-black">直接原価</th>
                  <th className="px-10 py-6 text-center font-black">粗利率</th>
                  <th className="px-10 py-6 text-center font-black">稼働人員</th>
                  <th className="px-10 py-6 text-right font-black">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[14px] font-bold text-slate-700">
                {monthlyData.map((row, i) => (
                  <tr key={i} className="group hover:bg-indigo-50/20 transition-all duration-300">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors"></div>
                        <span className="text-slate-900 font-black">{row.month}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right tabular-nums">¥{row.sales.toLocaleString()}</td>
                    <td className="px-10 py-6 text-right tabular-nums text-slate-400 tracking-tight font-medium">¥{row.cost.toLocaleString()}</td>
                    <td className="px-10 py-6 text-center">
                       <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-indigo-600 font-black text-[12px] group-hover:bg-indigo-100 transition-colors">
                         {row.margin}<span className="text-[10px] opacity-60">%</span>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="tabular-nums px-2 py-1 rounded bg-slate-100 text-slate-500 text-xs">{row.staffCount}名</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 text-emerald-600">
                        <span className="tabular-nums font-black">{row.roi || '1.42'}</span>
                        <ArrowUpRight size={14} className="opacity-50" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 p-6 flex justify-center border-t border-slate-100">
             <button className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
               View All Monthly Reports <ChevronRight size={14} />
             </button>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        @media print {
          .no-print { display: none; }
        }
      `}</style>
    </DashboardLayout>
  );
}