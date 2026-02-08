'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link'; // ★Linkを追加
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  Tooltip, Legend
} from 'recharts';
import { 
  Heart, Users, Brain, Sparkles, Loader2, PartyPopper, 
  Settings2, Edit3, PlusCircle, XCircle // ★アイコン追加
} from 'lucide-react';

export default function CulturePage() {
  const [data, setData] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/dashboard/culture');
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setMatches(json.matches);
        }
      } catch (e) { console.error(e); }
    };
    fetchData();
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
    setToast({ message: 'リストから除外しました', type: 'info' });
    setProcessingId(null);
  };

  if (!data) return <DashboardLayout><div className="flex h-screen items-center justify-center text-slate-400 font-bold gap-2"><Loader2 className="animate-spin"/> Culture Engine Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in pb-20 relative">
        
        {toast && (
          <div className="fixed bottom-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl bg-slate-900 text-white border border-slate-800 flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in">
            <PartyPopper size={20} className="text-yellow-400"/>
            <span className="font-bold">{toast.message}</span>
          </div>
        )}

        {/* ヘッダーセクション */}
        <div className="flex flex-col md:flex-row justify-between items-end bg-gradient-to-r from-pink-600 to-purple-700 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><Heart size={24} fill="currentColor"/></div>
              <span className="font-bold text-pink-100 tracking-wider text-sm">CULTURE FIT ENGINE</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-2">価値観・人財マッチング</h2>
            <p className="text-pink-100 font-medium opacity-80">スキルだけでなく、性格と価値観で「最高のチーム」を。</p>
          </div>
          
          {/* ★ 右側のボタンエリアを追加 */}
          <div className="flex items-center gap-4 relative z-10 mt-6 md:mt-0">
            <div className="text-right mr-4 hidden xl:block">
              <p className="text-xs text-pink-200 font-bold uppercase tracking-widest">Avg Score</p>
              <p className="text-2xl font-black text-white">{data.summary.avgCultureScore}</p>
            </div>
            {/* 登録画面へのボタン */}
            <Link href="/culture/edit" className="flex items-center gap-2 bg-white text-pink-600 px-6 py-4 rounded-2xl font-black shadow-lg hover:bg-pink-50 transition-all active:scale-95">
              <PlusCircle size={20} />
              データ登録・編集
            </Link>
          </div>
          <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-pink-500 rounded-full blur-[100px] opacity-50"></div>
        </div>

        {/* メインリスト */}
        <div className="grid grid-cols-1 gap-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Sparkles className="text-pink-500" fill="currentColor"/> AI推奨：カルチャーフィット候補
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">高シナジー: {data.summary.highSynergyCandidates}名</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {matches.map((match: any) => (
              <div key={match.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-lg transition-all group relative overflow-hidden">
                
                {/* ★ カード個別編集ボタン（ホバーで表示） */}
                <Link 
                  href={`/culture/edit?id=${match.id}`} 
                  className="absolute top-6 left-6 p-2 bg-slate-50 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 z-20 border border-slate-100"
                  title="この人のデータを編集"
                >
                   <Edit3 size={18} />
                </Link>

                <div className="absolute top-6 right-6 flex flex-col items-end">
                   <div className="text-3xl font-black text-pink-600">{match.matchScore}<span className="text-sm text-pink-400">%</span></div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Match Score</div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                        {match.staffImg}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-xl">{match.staffName}</h4>
                        <span className="text-xs font-bold bg-pink-100 text-pink-600 px-2 py-1 rounded-md">{match.type}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                       <h5 className="font-bold text-slate-700 text-sm mb-1">{match.projectName}</h5>
                       <p className="text-[11px] text-slate-500 leading-tight">現場環境: {match.projectCulture}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {match.values.map((val: string, i: number) => (
                        <span key={i} className="text-[10px] font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-400">#{val}</span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full md:w-[260px] h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={match.radarData}>
                        <PolarGrid stroke="#f1f5f9" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }} />
                        <Radar name="現場" dataKey="project" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.05} />
                        <Radar name="本人" dataKey="staff" stroke="#ec4899" strokeWidth={3} fill="#ec4899" fillOpacity={0.3} />
                        <Tooltip contentStyle={{borderRadius:'12px', border:'none'}}/>
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50">
                  <div className="flex gap-3 mb-4 bg-pink-50/30 p-3 rounded-xl border border-pink-100/50">
                    <Brain size={18} className="text-pink-500 shrink-0 mt-0.5"/>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{match.reason}</p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleRemove(match.id)}
                      disabled={processingId === match.id}
                      className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-400 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      {processingId === match.id ? <Loader2 size={16} className="animate-spin"/> : <XCircle size={16}/>}
                      除外
                    </button>
                    <button 
                      onClick={() => handleInterview(match.id, match.staffName)}
                      disabled={processingId === match.id}
                      className="flex-[2] py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      {processingId === match.id ? <Loader2 size={16} className="animate-spin"/> : <Users size={16}/>}
                      カジュアル面談を設定
                    </button>
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