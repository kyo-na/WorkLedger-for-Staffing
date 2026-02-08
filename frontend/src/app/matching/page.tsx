'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  Zap, TrendingUp, Search, Filter, 
  ArrowRight, CheckCircle2, XCircle, Sparkles, Loader2, MailCheck, Briefcase // ★ここに追加しました
} from 'lucide-react';

export default function MatchingPage() {
  const [data, setData] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]); 
  
  // 検索・フィルタリング用
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMatches, setFilteredMatches] = useState<any[]>([]);

  // アクション状態管理
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/dashboard/matching');
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setMatches(json.matches);
          setFilteredMatches(json.matches); // 初期状態は全件表示
        }
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  // 検索処理
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredMatches(matches); // 空なら全件
      return;
    }
    
    const lowerTerm = searchTerm.toLowerCase();
    const result = matches.filter(m => 
      m.staffName.toLowerCase().includes(lowerTerm) || 
      m.staffExp.toLowerCase().includes(lowerTerm) || 
      m.projectName.toLowerCase().includes(lowerTerm) ||
      m.projectTech.toLowerCase().includes(lowerTerm)
    );
    setFilteredMatches(result);
  };

  // リアルタイム検索
  useEffect(() => {
    handleSearch();
  }, [searchTerm, matches]);

  // 通知消去
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // アクション: 提案
  const handlePropose = async (id: number, name: string) => {
    setProcessingId(id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 元データと表示用データの両方から削除
    const newMatches = matches.filter(m => m.id !== id);
    setMatches(newMatches);
    setFilteredMatches(prev => prev.filter(m => m.id !== id));

    setToast({ message: `${name}さんの提案メールを送信しました`, type: 'success' });
    setProcessingId(null);
  };

  // アクション: 見送る
  const handleDecline = async (id: number) => {
    setProcessingId(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMatches = matches.filter(m => m.id !== id);
    setMatches(newMatches);
    setFilteredMatches(prev => prev.filter(m => m.id !== id));

    setToast({ message: '案件を見送りました', type: 'info' });
    setProcessingId(null);
  };

  if (!data) return <DashboardLayout><div className="flex h-screen items-center justify-center text-slate-400 font-bold gap-2"><Loader2 className="animate-spin"/> AI Matching Engine Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in pb-20 relative">
        
        {/* 通知トースト */}
        {toast && (
          <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 ${
            toast.type === 'success' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'
          }`}>
            {toast.type === 'success' ? <MailCheck size={20} className="text-emerald-400"/> : <XCircle size={20} className="text-slate-400"/>}
            <span className="font-bold">{toast.message}</span>
          </div>
        )}

        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row justify-between items-end bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500 rounded-lg text-slate-900"><Zap size={24} fill="currentColor"/></div>
              <span className="font-bold text-yellow-400 tracking-wider text-sm">AI MATCHING ENGINE</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-2">案件マッチング・ボード</h2>
            <p className="text-slate-400 font-medium">最適な人材配置で、機会損失をゼロに。</p>
          </div>
          
          <div className="flex gap-8 relative z-10 mt-6 md:mt-0">
            <div className="text-right">
              <p className="text-xs text-slate-400 font-bold uppercase">Average Match</p>
              <p className="text-3xl font-black text-emerald-400">{data.summary.matchRate}<span className="text-sm">%</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-bold uppercase">Open Positions</p>
              <p className="text-3xl font-black text-white">{data.summary.openPositions}<span className="text-sm">件</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-bold uppercase">Available Staff</p>
              <p className="text-3xl font-black text-yellow-400">{data.summary.availableStaff}<span className="text-sm">名</span></p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* 左カラム: 検索 & 分析 */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Search size={18}/> 条件絞り込み</h3>
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="スキル・言語・氏名で検索 (例: Java)" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-600 outline-none focus:border-indigo-500 transition-colors"
                />
                <div className="flex gap-2">
                  <select className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-600 outline-none"><option>東京</option></select>
                  <select className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-600 outline-none"><option>~60万</option></select>
                </div>
                <button 
                  onClick={handleSearch}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Filter size={18}/> 検索を実行
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center">
               <h3 className="font-black text-slate-800 mb-2 w-full flex items-center gap-2"><TrendingUp size={18} className="text-indigo-600"/> 組織スキル傾向</h3>
               <div className="h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.skillRadar}>
                     <PolarGrid stroke="#f1f5f9" />
                     <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} />
                     <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false}/>
                     <Radar name="Skill" dataKey="A" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.2} />
                     <Tooltip contentStyle={{borderRadius:'12px', border:'none'}}/>
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
               <p className="text-xs font-bold text-slate-400">※ Backend領域に強みがあります</p>
            </div>
          </div>

          {/* 右カラム: マッチングリスト (フィルタ結果を表示) */}
          <div className="xl:col-span-2 space-y-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Sparkles className="text-yellow-500" fill="currentColor"/> AI推奨マッチング候補
              <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">Score 80+ only</span>
            </h3>

            <div className="grid gap-6">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match: any) => (
                  <div key={match.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    
                    {/* マッチ度バッジ */}
                    <div className="absolute top-0 right-0 bg-slate-900 text-white px-6 py-3 rounded-bl-[2rem] font-black text-xl z-10">
                      {match.matchScore}<span className="text-sm font-medium ml-1">%</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                      {/* スタッフ情報 */}
                      <div className="flex-1 lg:border-r lg:border-slate-100 lg:pr-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm">{match.staffImg}</div>
                          <div>
                            <h4 className="font-black text-slate-800 text-lg">{match.staffName}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{match.staffRole}</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-500 font-bold mb-1">保有スキル:</p>
                          <p className="text-sm font-black text-slate-700">{match.staffExp}</p>
                        </div>
                      </div>

                      {/* 矢印 */}
                      <div className="hidden lg:flex items-center justify-center text-indigo-200"><ArrowRight size={32} strokeWidth={3}/></div>

                      {/* 案件情報 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          {/* ★ Briefcaseアイコンがここで使われています */}
                          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm"><Briefcase size={24}/></div>
                          <div>
                            <h4 className="font-black text-slate-800 text-lg line-clamp-1">{match.projectName}</h4>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">単価: {match.price}</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-500 font-bold mb-1">必須スキル:</p>
                          <p className="text-sm font-black text-slate-700">{match.projectTech}</p>
                        </div>
                      </div>
                    </div>

                    {/* アクションエリア */}
                    <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                          {match.tags.map((tag:string, i:number) => (
                            <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                              tag === 'Best Match' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                              tag === '単価UP' ? 'bg-pink-50 text-pink-600 border-pink-200' :
                              'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>{tag}</span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 font-medium flex items-start gap-2">
                          <Sparkles size={14} className="text-indigo-500 shrink-0 mt-0.5"/>
                          {match.reason}
                        </p>
                      </div>
                      
                      <div className="flex gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => handleDecline(match.id)}
                          disabled={processingId === match.id}
                          className="flex-1 md:flex-none py-3 px-6 rounded-xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {processingId === match.id ? <Loader2 size={18} className="animate-spin"/> : <XCircle size={18}/>}
                          見送る
                        </button>
                        <button 
                          onClick={() => handlePropose(match.id, match.staffName)}
                          disabled={processingId === match.id}
                          className="flex-1 md:flex-none py-3 px-6 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {processingId === match.id ? <Loader2 size={18} className="animate-spin"/> : <CheckCircle2 size={18}/>}
                          提案する
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">条件に一致する候補は見つかりませんでした 🕵️‍♂️</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}