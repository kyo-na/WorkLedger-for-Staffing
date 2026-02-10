'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  Heart, Brain, Sparkles, Loader2, PartyPopper, 
  Edit3, PlusCircle, XCircle, ArrowRight, Zap, RefreshCw
} from 'lucide-react';

export default function CulturePage() {
  const [data, setData] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    // APIからデータを取得する代わりにダミーデータを設定
    const fetchDummyData = async () => {
      // 実際には fetch('http://localhost:3000/dashboard/culture') のような処理が入る
      await new Promise(resolve => setTimeout(resolve, 800)); // ローディング演出
      
      const dummyData = {
        summary: {
          avgCultureScore: 84,
          highSynergyCandidates: 3
        },
        matches: [
          {
            id: 1,
            staffName: "佐藤 健一",
            staffImg: "👨‍💻",
            type: "職人・スペシャリスト型",
            matchScore: 92,
            projectName: "次世代ECプラットフォーム構築",
            projectCulture: "技術的挑戦を歓迎し、個人の裁量と責任を重視する環境。",
            values: ["自律性", "技術探求", "論理的思考"],
            radarData: [
              { subject: '協調性', project: 70, staff: 60 },
              { subject: '外向性', project: 50, staff: 40 },
              { subject: '誠実性', project: 90, staff: 95 },
              { subject: '開放性', project: 80, staff: 85 },
              { subject: '情緒安定', project: 70, staff: 80 },
            ],
            reason: "プロジェクトが求める高い技術水準と自律的な行動特性が、候補者の職人気質と非常に強く合致しています。技術的なリーダーシップの発揮が期待できます。"
          },
          {
            id: 2,
            staffName: "鈴木 美咲",
            staffImg: "👩‍💼",
            type: "バランサー・調整型",
            matchScore: 88,
            projectName: "AIチャットボット導入",
            projectCulture: "多様なステークホルダーとの調整と、チームワークを最優先する環境。",
            values: ["協調性", "コミュニケーション", "安定性"],
            radarData: [
              { subject: '協調性', project: 90, staff: 95 },
              { subject: '外向性', project: 80, staff: 85 },
              { subject: '誠実性', project: 70, staff: 80 },
              { subject: '開放性', project: 60, staff: 70 },
              { subject: '情緒安定', project: 80, staff: 90 },
            ],
            reason: "チームの調和を重視するプロジェクト文化に対し、候補者の高い協調性と安定性がフィットします。チーム内の潤滑油としての活躍が見込まれます。"
          }
        ]
      };
      
      setData(dummyData);
      setMatches(dummyData.matches);
    };
    
    fetchDummyData();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleInterview = async (id: number, name: string) => {
    setProcessingId(id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMatches(prev => prev.filter(m => m.id !== id));
    setToast({ message: `${name}さんのカジュアル面談を設定しました`, type: 'success' });
    setProcessingId(null);
  };

  const handleRemove = async (id: number) => {
    setProcessingId(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    setMatches(prev => prev.filter(m => m.id !== id));
    setToast({ message: '候補リストから除外しました', type: 'info' });
    setProcessingId(null);
  };

  // Loading State
  if (!data) return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)] items-center justify-center gap-6 bg-slate-50/50">
        <div className="relative">
          <div className="absolute inset-0 bg-pink-500 blur-xl opacity-20 animate-pulse"></div>
          <div className="w-20 h-20 rounded-full border-4 border-white border-t-pink-500 animate-spin shadow-xl"></div>
          <Heart size={28} className="text-pink-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse fill-pink-500"/>
        </div>
        <p className="text-slate-400 font-black tracking-[0.3em] text-xs animate-pulse">ANALYZING SYNERGY...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in pb-24 relative font-sans text-slate-800">
        
        {/* 背景装飾 */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]" 
             style={{ backgroundImage: 'radial-gradient(circle at 60% 0%, #fbcfe8 0%, transparent 40%), radial-gradient(circle at 0% 100%, #e0e7ff 0%, transparent 40%)' }}>
        </div>

        {/* トースト通知 */}
        {toast && (
          <div className="fixed bottom-10 right-10 z-50 pl-5 pr-8 py-5 rounded-[20px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] bg-slate-900/95 backdrop-blur-xl text-white border border-white/10 flex items-center gap-5 animate-in slide-in-from-bottom-10 fade-in duration-300 ring-1 ring-white/10">
            <div className={`p-3 rounded-2xl shadow-lg ${toast.type === 'success' ? 'bg-gradient-to-br from-pink-500 to-rose-600 shadow-pink-500/30' : 'bg-slate-700'}`}>
              {toast.type === 'success' ? <PartyPopper size={24} className="text-white"/> : <RefreshCw size={24} className="text-slate-300"/>}
            </div>
            <div>
              <p className="font-bold text-base tracking-tight">{toast.message}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">System Notification</p>
            </div>
          </div>
        )}

        {/* --- Header Section: Emotional Intelligence Lab --- */}
        <div className="relative overflow-hidden rounded-[40px] bg-slate-900 shadow-2xl shadow-pink-900/20 ring-1 ring-white/10">
          {/* Decorative Orbs */}
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-pink-600 rounded-full blur-[160px] opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[140px] opacity-30"></div>
          
          <div className="relative z-10 p-10 md:p-12 flex flex-col xl:flex-row items-end justify-between gap-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center gap-2.5 shadow-lg">
                  <Heart size={14} className="text-pink-400 fill-pink-400 animate-pulse"/>
                  <span className="text-[10px] font-black text-pink-100 tracking-[0.2em] uppercase">Culture Fit Engine v2.0</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-6">
                チームの可能性を最大化する<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">「運命の出会い」</span>を提案
              </h2>
              <p className="text-slate-300 font-medium text-sm md:text-base max-w-xl leading-relaxed opacity-80">
                スキルマッチングを超えて。深層心理と価値観の分析により、チームのポテンシャルを解き放つ最適な人材をレコメンドします。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full xl:w-auto">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-6 flex flex-col items-center justify-center min-w-[160px]">
                <span className="text-[10px] font-bold text-pink-200/60 uppercase tracking-widest mb-1">Avg. Synergy</span>
                <span className="text-4xl font-black text-white tracking-tighter">{data.summary.avgCultureScore}</span>
              </div>
              
              <Link 
                href="/culture/edit" 
                className="flex-1 sm:flex-none bg-white hover:bg-pink-50 text-slate-900 px-10 py-6 rounded-[24px] font-black shadow-[0_0_50px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_-20px_rgba(236,72,153,0.6)] transition-all active:scale-95 flex items-center justify-center gap-3 group"
              >
                <PlusCircle size={20} className="text-pink-600 group-hover:scale-110 transition-transform"/>
                <span className="whitespace-nowrap">価値観定義を編集</span>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all"/>
              </Link>
            </div>
          </div>
        </div>

        {/* --- Main Content: Matching Cards --- */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 shadow-sm">
                <Sparkles size={20} fill="currentColor"/>
              </div>
              カルチャーマッチ候補
            </h3>
            <div className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-600">高シナジー: <span className="text-slate-900 text-sm ml-1">{data.summary.highSynergyCandidates}名</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {matches.map((match: any) => (
              <div key={match.id} className="group relative bg-white rounded-[40px] p-1 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-1">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-white to-purple-200 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="relative bg-white rounded-[36px] p-8 md:p-10 h-full flex flex-col">
                  
                  {/* Top Row: Score & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-10 gap-6">
                    <div className="flex items-center gap-6">
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 bg-slate-50 rounded-[24px] flex items-center justify-center text-5xl shadow-inner border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                          {match.staffImg}
                        </div>
                        <div className="absolute -bottom-3 -right-3 bg-white p-1.5 rounded-full shadow-md border border-slate-50">
                           <div className="w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center border border-pink-100">
                             <Heart size={14} className="text-pink-500 fill-pink-500"/>
                           </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-black text-3xl text-slate-800 tracking-tight mb-2">{match.staffName}</h4>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide border border-slate-200">
                            {match.type}
                          </span>
                          <Link href={`/culture/edit?id=${match.id}`} className="p-1.5 text-slate-300 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors">
                            <Edit3 size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="text-right bg-slate-50/50 p-4 rounded-3xl border border-slate-100 sm:bg-transparent sm:p-0 sm:border-0">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-purple-600 tracking-tighter drop-shadow-sm">
                          {match.matchScore}
                        </span>
                        <span className="text-xl font-black text-slate-300">%</span>
                      </div>
                      <p className="text-[10px] font-bold text-pink-400 uppercase tracking-[0.2em] mt-1 mr-1">Culture Match</p>
                    </div>
                  </div>

                  {/* Middle Row: Project & Radar */}
                  <div className="flex flex-col md:flex-row gap-10 mb-10 flex-1">
                    <div className="flex-1 space-y-6">
                      <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-100 relative group/proj hover:bg-indigo-50/30 hover:border-indigo-100 transition-colors">
                        <div className="absolute top-5 right-5 text-slate-300 group-hover/proj:text-indigo-400 transition-colors bg-white p-2 rounded-xl shadow-sm">
                          <Brain size={20} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">配属想定プロジェクト</p>
                        <h5 className="font-black text-slate-800 text-xl mb-2">{match.projectName}</h5>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{match.projectCulture}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {match.values.map((val: string, i: number) => (
                          <span key={i} className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-[11px] font-bold shadow-sm hover:border-pink-200 hover:text-pink-600 hover:shadow-md transition-all cursor-default">
                            #{val}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="w-full md:w-56 h-56 relative shrink-0">
                        {/* Radar Chart Background Circle */}
                        <div className="absolute inset-0 bg-slate-50/50 rounded-full scale-90 border border-slate-100"></div>
                        <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={match.radarData}>
                          <PolarGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: '700', fill: '#64748b' }} />
                          <Radar name="Project" dataKey="project" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.15} />
                          <Radar name="Staff" dataKey="staff" stroke="#ec4899" strokeWidth={2} fill="#ec4899" fillOpacity={0.4} />
                          <Tooltip 
                            contentStyle={{borderRadius:'16px', border:'none', boxShadow:'0 10px 30px -10px rgba(0,0,0,0.15)', padding: '12px'}}
                            itemStyle={{fontSize:'12px', fontWeight:'bold'}}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Bottom Row: AI Insight & Buttons */}
                  <div className="pt-8 border-t border-slate-100 space-y-8">
                    <div className="flex gap-5 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-5 rounded-[24px] border border-indigo-50/50">
                      <div className="shrink-0 w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-indigo-500 shadow-sm ring-4 ring-indigo-50">
                        <Sparkles size={18} fill="currentColor" className="opacity-50"/>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">AI分析インサイト</p>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed">
                          {match.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleRemove(match.id)}
                        disabled={processingId === match.id}
                        className="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold hover:bg-slate-50 hover:text-slate-600 hover:border-slate-300 transition-all text-xs uppercase tracking-wide flex items-center justify-center gap-2 active:scale-95"
                      >
                        {processingId === match.id ? <Loader2 size={18} className="animate-spin"/> : <XCircle size={18}/>}
                        見送る
                      </button>
                      <button 
                        onClick={() => handleInterview(match.id, match.staffName)}
                        disabled={processingId === match.id}
                        className="flex-[2] py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-pink-600 shadow-xl shadow-slate-900/10 hover:shadow-pink-500/30 transition-all active:scale-[0.98] text-xs uppercase tracking-wide flex items-center justify-center gap-2"
                      >
                        {processingId === match.id ? <Loader2 size={18} className="animate-spin"/> : <Zap size={18} className="text-yellow-400 fill-yellow-400"/>}
                        面談を設定する
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}