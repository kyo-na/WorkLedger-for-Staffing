'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Line, ComposedChart,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, DollarSign, PieChart as PieChartIcon, AlertCircle, Activity, 
  Download, Printer, Users, Clock, AlertTriangle, Calendar, FileText, 
  Clock3, ChevronRight, ArrowUpRight, Target, Briefcase
} from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalysisPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [projectData, setProjectData] = useState<any[]>([]); 
  const [overtimeRanking, setOvertimeRanking] = useState<any[]>([]);
  const [paidLeaveData, setPaidLeaveData] = useState<any[]>([]);
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

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 print:p-0 selection:bg-indigo-100 font-sans">
        
        {/* --- Header: Glassmorphism Navigation --- */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] print:shadow-none print:border-none ring-1 ring-slate-900/5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 rotate-3 transition-transform hover:rotate-0 duration-500">
              <Activity size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic flex items-center gap-3">
                PROFIT<span className="text-indigo-600">ANALYTICS</span>
                <span className="not-italic text-[10px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-1.5 rounded-full ml-3 uppercase tracking-[0.2em] font-black shadow-lg shadow-indigo-200">Intelligence v2.0</span>
              </h2>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2">
                <Target size={12} className="text-indigo-500" /> Fiscal Intelligence & Compliance Dashboard
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-6 md:mt-0 print:hidden">
             <div className="flex bg-slate-100/50 p-1.5 rounded-[1.5rem] border border-slate-200/50 backdrop-blur-sm shadow-inner">
               <button onClick={handlePrint} className="p-3.5 rounded-2xl bg-white text-slate-400 hover:text-slate-900 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-slate-100 active:scale-95"><Printer size={20}/></button>
               <button className="p-3.5 rounded-2xl bg-white text-slate-400 hover:text-slate-900 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-slate-100 active:scale-95 ml-2"><Download size={20}/></button>
             </div>
             <div className="h-10 w-px bg-slate-200 mx-1"></div>
             <div className="flex items-center gap-3 bg-slate-900 text-white p-2 pl-6 rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:shadow-indigo-500/20 transition-all duration-500 border border-white/10 group">
               <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase group-hover:text-indigo-400 transition-colors">Period Selection</span>
               <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="w-20 bg-transparent font-black text-xl outline-none text-center tabular-nums focus:text-indigo-400 transition-colors"/>
             </div>
          </div>
        </div>

        {/* --- KPI Cards: Deep Shadows & Gradients --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group hover:scale-[1.03] transition-all duration-500 ring-1 ring-white/10">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-colors"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-8 border-b border-white/10 pb-2"><DollarSign size={14} strokeWidth={3}/> Annual Gross Revenue</div>
              <ArrowUpRight className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-all -translate-y-4 group-hover:translate-y-0 duration-500" size={28}/>
            </div>
            <h3 className="text-6xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">¥{summary.totalSales.toLocaleString()}</h3>
            <div className="mt-8 flex items-center gap-3 relative z-10">
               <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic whitespace-nowrap">Confirmed Invoiced Basis</span>
               </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 group hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700 relative overflow-hidden ring-1 ring-slate-900/5">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
             <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-8 border-b border-slate-50 pb-2"><TrendingUp size={14} className="text-emerald-500" strokeWidth={3}/> Operational Gross Profit</div>
             <h3 className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums transition-colors duration-500 group-hover:text-emerald-600">¥{summary.totalProfit.toLocaleString()}</h3>
             <div className="flex items-center gap-3 mt-8">
                <div className="w-10 h-1 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-black text-emerald-600 tracking-[0.2em] uppercase">Growth Index: +12.4% YoY</span>
             </div>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 group hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700 ring-1 ring-slate-900/5">
             <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-8 border-b border-slate-50 pb-2"><PieChartIcon size={14} className="text-indigo-500" strokeWidth={3}/> Portfolio Margin Efficiency</div>
             <h3 className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums transition-colors duration-500 group-hover:text-indigo-600">{summary.avgMargin.toFixed(1)}<span className="text-3xl ml-1 text-slate-300 font-normal">%</span></h3>
             <div className="w-full bg-slate-100 h-2.5 rounded-full mt-10 overflow-hidden shadow-inner border border-slate-200/50">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-[1500ms] ease-out-expo" style={{width: `${summary.avgMargin}%`}}></div>
             </div>
          </div>
        </div>

        {/* --- Contract Renewal Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 relative overflow-hidden group ring-1 ring-slate-900/5">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 scale-125 -rotate-12"><FileText size={200}/></div>
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6 relative z-10">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-5">
                      <div className="w-2.5 h-10 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"></div>
                      契約更新進捗管理
                    </h3>
                    <div className="text-xs font-bold text-slate-400 mt-2 ml-[35px] uppercase tracking-widest italic">Renewal Velocity Over Rolling 3-Month Window</div>
                  </div>
                  <div className="flex bg-slate-50 p-2.5 rounded-2xl gap-5 text-[10px] font-black uppercase tracking-widest border border-slate-200/50 shadow-inner">
                    <span className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-md"></div> 完了</span>
                    <span className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-md"></div> 交渉中</span>
                    <span className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-rose-500 shadow-md animate-pulse"></div> 未着手</span>
                  </div>
               </div>
               <div className="h-[280px] w-full relative z-10">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={renewalData} layout="vertical" margin={{ left: 20 }}>
                     <CartesianGrid strokeDasharray="10 10" horizontal={false} stroke="#f1f5f9"/>
                     <XAxis type="number" hide/>
                     <YAxis dataKey="month" type="category" width={80} tick={{fontSize: 16, fontWeight: '900', fill: '#0f172a'}} axisLine={false} tickLine={false}/>
                     <RechartsTooltip cursor={{fill: 'slate-100', opacity: 0.5}} contentStyle={{borderRadius:'24px', border:'none', boxShadow:'0 25px 50px -12px rgb(0 0 0 / 0.15)'}}/>
                     <Bar dataKey="done" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={45} />
                     <Bar dataKey="negotiating" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} barSize={45} />
                     <Bar dataKey="pending" stackId="a" fill="#ef4444" radius={[0, 24, 24, 0]} barSize={45} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl text-white relative overflow-hidden ring-1 ring-white/10">
               <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none"></div>
               <h3 className="text-2xl font-black mb-10 flex items-center gap-4 relative z-10">
                 <div className="p-3 bg-rose-500/20 rounded-2xl"><Clock3 className="text-rose-500" size={26}/></div>
                 期限アラート通知
               </h3>
               <div className="space-y-5 relative z-10">
                  {renewalAlerts.map((item, i) => (
                    <div key={i} className="group bg-white/[0.03] border border-white/5 p-6 rounded-[2.5rem] hover:bg-white/[0.08] hover:border-white/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                           <h4 className="font-black text-base tracking-tight leading-none group-hover:text-indigo-300 transition-colors">{item.name}</h4>
                           <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20 ring-4 ring-rose-500/5 uppercase tracking-tighter">Due in {item.daysLeft}d</span>
                        </div>
                        {/* ✅ Hydration Error 修正箇所：flexコンテナの中で min-w-0 と truncate を適用 */}
                        <div className="flex items-center gap-2 mb-6 text-[11px] font-bold text-slate-500 italic min-w-0">
                          <Briefcase size={12} className="opacity-50 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate">
                              {item.project}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Term End: {item.endDate}</span>
                           <div className="p-2 rounded-full bg-slate-800 group-hover:bg-indigo-600 transition-all duration-500">
                            <ChevronRight size={18} className="text-slate-500 group-hover:text-white"/>
                           </div>
                        </div>
                    </div>
                  ))}
                  {renewalAlerts.length === 0 && (
                    <div className="text-center py-10 opacity-30 italic font-bold">No active renewal alerts found</div>
                  )}
               </div>
            </div>
        </div>

        {/* --- Work Compliance Analysis --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 group ring-1 ring-slate-900/5">
              <div className="flex justify-between items-start mb-12">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-5">
                  <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 group-hover:rotate-6 transition-transform"><Clock size={28}/></div>
                  残業時間・収益相関分析
                </h3>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyData}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#fb923c" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 13, fontWeight: '900'}} />
                    <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} unit="h"/>
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} unit="%" domain={[0, 60]}/>
                    <RechartsTooltip contentStyle={{ borderRadius: '28px', border: 'none', boxShadow:'0 25px 50px -12px rgb(0 0 0 / 0.15)' }} cursor={{fill: '#f8fafc'}} />
                    <Bar yAxisId="left" dataKey="overtimeAverage" name="平均残業時間" fill="url(#barGrad)" radius={[14, 14, 0, 0]} barSize={32} />
                    <Line yAxisId="right" type="monotone" dataKey="margin" name="マージン率" stroke="#6366f1" strokeWidth={6} dot={{r: 8, fill:'#6366f1', strokeWidth:4, stroke:'#fff'}} activeDot={{r: 10, strokeWidth:0, fill:'#6366f1'}} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 ring-1 ring-slate-900/5 overflow-hidden">
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-12 flex items-center gap-5">
                <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100 transition-all hover:scale-110"><AlertTriangle size={28}/></div>
                36協定・労働時間リスク順位
               </h3>
               <div className="space-y-6">
                 {overtimeRanking.map((staff, i) => (
                   <div key={i} className="flex items-center gap-8 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200/50 hover:bg-white hover:border-indigo-400 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group relative">
                      <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight className="text-slate-300" /></div>
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl transition-all group-hover:-rotate-6 ${staff.hours >= 45 ? 'bg-rose-500 text-white shadow-rose-200 ring-8 ring-rose-500/5' : 'bg-white text-slate-400 ring-8 ring-slate-100'}`}>0{i + 1}</div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center mb-4">
                           <h4 className="font-black text-xl text-slate-800 tracking-tight">{staff.name}</h4>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">{staff.department}</span>
                         </div>
                         <div className="w-full bg-slate-200/50 h-4 rounded-full overflow-hidden shadow-inner p-0.5 border border-slate-300/20">
                           <div className={`h-full rounded-full transition-all duration-[2000ms] ease-out-expo ${staff.hours >= 45 ? 'bg-gradient-to-r from-rose-500 to-rose-700 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.4)]'}`} style={{width: `${Math.min((staff.hours / 60) * 100, 100)}%`}}></div>
                         </div>
                      </div>
                      <div className="text-right min-w-[100px]">
                         <div className={`text-4xl font-black tracking-tighter tabular-nums ${staff.hours >= 45 ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>{staff.hours}<span className="text-xs ml-1 font-bold text-slate-400 uppercase tracking-widest">hrs</span></div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
        </div>

        {/* --- Productivity & ROI Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-12 rounded-[4.5rem] shadow-xl border border-slate-100 group ring-1 ring-slate-900/5">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-12 flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:-rotate-3 transition-transform"><Users size={28}/></div>
                人的労働生産性指標
              </h3>
              <div className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 13, fontWeight:'bold'}} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} unit="名"/>
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} unit="万"/>
                    <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '28px', border: 'none' }} />
                    <Bar yAxisId="left" dataKey="staffCount" name="稼働スタッフ数" fill="#cbd5e1" radius={[12, 12, 0, 0]} barSize={28} />
                    <Line yAxisId="right" type="monotone" dataKey="profitPerHead" name="1人当粗利(円)" stroke="#6366f1" strokeWidth={5} dot={{r: 6, fill:'#fff', strokeWidth:3, stroke:'#6366f1'}} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[4.5rem] shadow-xl border border-slate-100 relative overflow-hidden group ring-1 ring-slate-900/5">
              <div className="absolute top-0 right-0 p-12 text-emerald-500 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 rotate-12 pointer-events-none"><TrendingUp size={280}/></div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-12 flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 group-hover:rotate-6 transition-transform"><TrendingUp size={28}/></div>
                人的資源投資ROI (効率)
              </h3>
              <div className="h-[380px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 13, fontWeight:'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <RechartsTooltip contentStyle={{ borderRadius: '28px', border: 'none', boxShadow:'0 25px 50px -12px rgb(0 0 0 / 0.15)' }}/>
                    <Area type="monotone" dataKey="roi" name="人的資源ROI" stroke="#10b981" strokeWidth={6} fillOpacity={1} fill="url(#colorRoi)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
        </div>

        {/* --- Public Table: Corporate Disclosure Level --- */}
        <div className="bg-slate-900 p-12 rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(15,23,42,0.5)] border border-white/10 print:border-none print:shadow-none overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/5 blur-[120px] pointer-events-none"></div>
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-16 gap-10 relative z-10">
            <div className="flex items-start gap-8">
              <div className="p-6 bg-white/5 text-indigo-400 rounded-[2rem] border border-white/10 shadow-2xl shadow-indigo-500/10 group-hover:rotate-6 transition-all duration-700"><AlertCircle size={36} strokeWidth={2.5}/></div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">労働者派遣法に基づく情報公開事項</h3>
                {/* ✅ Hydration Error 修正箇所：p を div に変更 */}
                <div className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-[0.25em] italic flex items-center gap-2">
                   <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span> Compliance Transparency Index
                </div>
              </div>
            </div>
            <button className="flex items-center gap-4 text-xs font-black text-white bg-indigo-600 px-10 py-5 rounded-[1.5rem] hover:bg-indigo-500 hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.5)] hover:scale-105 transition-all duration-300 uppercase tracking-widest active:scale-95 group">
              <Download size={20} className="group-hover:animate-bounce" /> Download Official PDF Report
            </button>
          </div>
          
          <div className="overflow-x-auto rounded-[3rem] border border-white/5 shadow-2xl bg-black/20 backdrop-blur-md relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-10 py-8 text-[11px] font-black text-indigo-300 uppercase tracking-[0.3em]">Reporting Month</th>
                  <th className="px-10 py-8 text-[11px] font-black text-indigo-300 uppercase tracking-[0.3em]">Total Revenue</th>
                  <th className="px-10 py-8 text-[11px] font-black text-indigo-300 uppercase tracking-[0.3em]">Direct Costs</th>
                  <th className="px-10 py-8 text-[11px] font-black text-indigo-300 uppercase tracking-[0.3em]">Margin rate</th>
                  <th className="px-10 py-8 text-[11px] font-black text-indigo-300 uppercase tracking-[0.3em]">Active Talent</th>
                  <th className="px-10 py-8 text-[11px] font-black text-indigo-300 uppercase tracking-[0.3em]">Profitability /Head</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {monthlyData.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.04] transition-all duration-300 group cursor-default">
                    <td className="px-10 py-8 font-black text-white text-lg tracking-tighter">{row.month}</td>
                    <td className="px-10 py-8 font-bold tabular-nums text-slate-300">¥{row.sales.toLocaleString()}</td>
                    <td className="px-10 py-8 font-bold tabular-nums text-slate-500 italic">¥{row.cost.toLocaleString()}</td>
                    <td className="px-10 py-8">
                       <span className={`inline-flex items-center px-5 py-2 rounded-full text-[11px] font-black tabular-nums shadow-lg ring-1 ring-inset ${row.margin < 30 ? 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'}`}>
                         <span className="w-1.5 h-1.5 rounded-full bg-current mr-2.5 animate-pulse"></span>
                         {row.margin}%
                       </span>
                    </td>
                    <td className="px-10 py-8 font-black text-white tabular-nums text-lg">
                      {row.staffCount}<span className="text-[10px] font-black text-slate-600 ml-2 uppercase tracking-tighter">Resources</span>
                    </td>
                    <td className="px-10 py-8 transition-all duration-500">
                      <div className="bg-indigo-600 group-hover:bg-indigo-500 px-6 py-3 rounded-2xl inline-block shadow-2xl shadow-indigo-500/20 transition-all group-hover:scale-110">
                        <span className="font-black text-white tabular-nums">¥{row.profitPerHead.toLocaleString()}</span>
                      </div>
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