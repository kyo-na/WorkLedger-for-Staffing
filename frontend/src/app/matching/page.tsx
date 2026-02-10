'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  Zap, TrendingUp, Search, Filter, 
  ArrowRight, CheckCircle2, XCircle, Sparkles, Loader2, MailCheck, Briefcase, 
  Target, Cpu, Layers 
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
    // APIからデータを取得する代わりにダミーデータを設定
    const fetchDummyData = async () => {
      // 実際には fetch('http://localhost:3000/dashboard/matching') のような処理が入る
      await new Promise(resolve => setTimeout(resolve, 800)); // ローディング演出
      
      const dummyData = {
        summary: {
          matchRate: 88,
          openPositions: 12,
          availableStaff: 45
        },
        skillRadar: [
          { subject: 'Frontend', A: 85, fullMark: 100 },
          { subject: 'Backend', A: 92, fullMark: 100 },
          { subject: 'Infra', A: 65, fullMark: 100 },
          { subject: 'AI/ML', A: 40, fullMark: 100 },
          { subject: 'Design', A: 70, fullMark: 100 },
          { subject: 'PM', A: 60, fullMark: 100 },
        ],
        matches: [
          {
            id: 1,
            staffName: "佐藤 健一",
            staffRole: "バックエンドエンジニア",
            staffImg: "👨‍💻",
            staffExp: "Java (5年), Go (2年), AWS",
            projectName: "次世代ECプラットフォーム構築",
            projectTech: "Go, Microservices, Kubernetes",
            price: "¥850,000 / 月",
            matchScore: 94,
            reason: "候補者のGo言語経験とマイクロサービスアーキテクチャへの知見が、プロジェクトの技術要件と合致しています。",
            tags: ["ベストマッチ", "単価UP"]
          },
          {
            id: 2,
            staffName: "鈴木 美咲",
            staffRole: "フロントエンドエンジニア",
            staffImg: "👩‍💻",
            staffExp: "React (3年), TypeScript, Next.js",
            projectName: "SaaS管理ダッシュボード刷新",
            projectTech: "Next.js, Tailwind CSS",
            price: "¥750,000 / 月",
            matchScore: 88,
            reason: "即戦力となるReactエコシステムの経験が豊富であり、短期間での立ち上げに貢献できます。",
            tags: ["スキル合致"]
          },
          {
            id: 3,
            staffName: "高橋 誠",
            staffRole: "インフラエンジニア",
            staffImg: "🧑‍🔧",
            staffExp: "AWS, Terraform, Python",
            projectName: "クラウドインフラ自動化基盤",
            projectTech: "AWS CDK, Python",
            price: "¥900,000 / 月",
            matchScore: 82,
            reason: "IaCの実務経験があり、インフラ運用の効率化に対する課題意識が高い点が評価できます。",
            tags: []
          }
        ]
      };
      
      setData(dummyData);
      setMatches(dummyData.matches);
      setFilteredMatches(dummyData.matches);
    };
    
    fetchDummyData();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredMatches(matches);
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

  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, matches]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handlePropose = async (id: number, name: string) => {
    setProcessingId(id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newMatches = matches.filter(m => m.id !== id);
    setMatches(newMatches);
    setFilteredMatches(prev => prev.filter(m => m.id !== id));

    setToast({ message: `${name}さんの提案メールを送信しました`, type: 'success' });
    setProcessingId(null);
  };

  const handleDecline = async (id: number) => {
    setProcessingId(id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMatches = matches.filter(m => m.id !== id);
    setMatches(newMatches);
    setFilteredMatches(prev => prev.filter(m => m.id !== id));

    setToast({ message: '案件を見送りました', type: 'info' });
    setProcessingId(null);
  };

  if (!data) return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)] items-center justify-center gap-4 bg-white/50 backdrop-blur-sm">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin"></div>
          <Zap size={28} className="text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse fill-yellow-400"/>
        </div>
        <p className="text-indigo-400 font-bold tracking-widest text-sm animate-pulse">AIマッチングエンジン起動中...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 animate-in fade-in pb-24 relative min-h-screen font-sans text-slate-800">
        
        {/* 背景装飾 - 明るく開放的なグラデーション */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.6]" 
             style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, #e0e7ff 0%, transparent 50%), radial-gradient(circle at 100% 100%, #f0fdf4 0%, transparent 50%)' }}>
        </div>

        {/* 通知トースト */}
        {toast && (
          <div className={`fixed bottom-10 right-10 z-50 pl-6 pr-8 py-5 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl border flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300 ${
            toast.type === 'success' ? 'bg-white/90 text-slate-800 border-emerald-100 ring-4 ring-emerald-50' : 'bg-white/90 text-slate-600 border-slate-200 ring-4 ring-slate-50'
          }`}>
            <div className={`p-3 rounded-full shadow-inner ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
              {toast.type === 'success' ? <MailCheck size={24}/> : <XCircle size={24}/>}
            </div>
            <div>
              <p className="font-black text-base">{toast.message}</p>
              <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest mt-0.5">{toast.type === 'success' ? '処理完了' : '非表示にしました'}</p>
            </div>
          </div>
        )}

        {/* --- AI Header Section: Bright & Futuristic --- */}
        {/* タイトルの枠を薄い青色に変更 (bg-blue-50/50, border-blue-100) */}
        <div className="relative overflow-hidden rounded-[3rem] bg-blue-50/50 shadow-xl shadow-blue-100/50 mx-4 mt-4 border border-blue-100">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-[100px] opacity-60 pointer-events-none -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-50 to-teal-50 rounded-full blur-[80px] opacity-60 pointer-events-none -ml-32 -mb-32"></div>
          
          <div className="relative z-10 p-10 md:p-12 flex flex-col lg:flex-row items-end justify-between gap-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100/50 backdrop-blur-md flex items-center gap-2.5 shadow-sm">
                  <Zap size={16} className="text-yellow-500 fill-yellow-500 animate-pulse"/>
                  <span className="text-[11px] font-black text-indigo-600 tracking-widest uppercase">AI Matching Engine v4.2</span>
                </div>
              </div>
              {/* タイトルを日本語に変更 */}
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-4 drop-shadow-sm">
                機会レーダー <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Radar</span>
              </h2>
              <p className="text-slate-500 font-medium text-base md:text-lg max-w-lg leading-relaxed">
                スキルシナジーとプロジェクト要件をリアルタイムで解析。<br/>最適なスタッフィングの機会を可視化します。
              </p>
            </div>

            <div className="flex gap-8 md:gap-16 w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
              <div className="text-right shrink-0">
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1">平均マッチ率</p>
                <div className="flex items-baseline justify-end gap-1.5">
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-500 drop-shadow-sm">{data.summary.matchRate}</p>
                  <span className="text-sm font-black text-slate-400">%</span>
                </div>
              </div>
              <div className="w-px h-16 bg-slate-200 hidden md:block"></div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1">募集ポジション</p>
                <div className="flex items-baseline justify-end gap-1.5">
                  <p className="text-5xl font-black text-slate-800">{data.summary.openPositions}</p>
                  <span className="text-sm font-black text-slate-400">件</span>
                </div>
              </div>
              <div className="w-px h-16 bg-slate-200 hidden md:block"></div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1">稼働可能人材</p>
                <div className="flex items-baseline justify-end gap-1.5">
                  <p className="text-5xl font-black text-yellow-500">{data.summary.availableStaff}</p>
                  <span className="text-sm font-black text-slate-400">名</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 px-4">
          
          {/* --- Left Column: Control & Analytics (4 cols) --- */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Search Panel - Soft UI */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-lg shadow-indigo-100/50 border border-white">
              <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3 text-lg">
                <div className="p-2.5 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm"><Filter size={20}/></div>
                条件絞り込み
              </h3>
              
              <div className="space-y-5">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20}/>
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="キーワード (例: Java, AWS...)" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300 shadow-inner"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <select className="w-full bg-slate-50 hover:bg-white border border-slate-100 rounded-2xl p-4 font-bold text-slate-600 text-xs outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer shadow-sm">
                    <option>勤務地: 東京</option>
                    <option>大阪</option>
                    <option>リモート</option>
                  </select>
                  <select className="w-full bg-slate-50 hover:bg-white border border-slate-100 rounded-2xl p-4 font-bold text-slate-600 text-xs outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer shadow-sm">
                    <option>単価: 指定なし</option>
                    <option>60万 - 80万</option>
                    <option>80万以上</option>
                  </select>
                </div>

                <button 
                  onClick={handleSearch}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2.5 text-sm uppercase tracking-wide mt-2"
                >
                  <Search size={18} strokeWidth={3}/> 検索フィルター適用
                </button>
              </div>
            </div>

            {/* Radar Analytics - Bright Mode */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden border border-white">
               <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
               
               <h3 className="font-black text-slate-800 mb-2 flex items-center gap-2.5 z-10 relative text-lg">
                 <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><Cpu size={20}/></div>
                 スキル分布分析
               </h3>
               <p className="text-[10px] text-slate-400 font-bold mb-8 uppercase tracking-widest z-10 relative ml-11">Organizational Skill Distribution</p>
               
               <div className="h-[260px] w-full relative z-10">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.skillRadar}>
                     <PolarGrid stroke="#e2e8f0" />
                     <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: '800', fill: '#64748b' }} />
                     <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false}/>
                     <Radar name="Skill" dataKey="A" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.2} />
                     <Tooltip 
                       contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius:'16px', border:'none', boxShadow:'0 10px 30px -10px rgba(0,0,0,0.1)', color: '#1e293b', fontWeight: 'bold'}}
                       itemStyle={{color: '#6366f1'}}
                     />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
               
               <div className="bg-slate-50/80 rounded-2xl p-4 flex items-start gap-3 border border-slate-100 mt-4">
                 <TrendingUp size={20} className="text-emerald-500 mt-0.5 shrink-0"/>
                 <p className="text-xs text-slate-600 leading-relaxed font-bold">
                   バックエンド技術の層が厚いです。フロントエンドエンジニアの獲得に注力することを推奨します。
                 </p>
               </div>
            </div>
          </div>

          {/* --- Right Column: Matching List (8 cols) --- */}
          <div className="xl:col-span-8 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
                <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm">
                  <Target size={22}/>
                </span>
                高ポテンシャル候補者
              </h3>
              <div className="flex items-center gap-2.5 px-4 py-1.5 bg-white border border-indigo-100 rounded-full shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                </span>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wide">AIレコメンド稼働中</span>
              </div>
            </div>

            <div className="grid gap-6">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match: any) => (
                  <div key={match.id} className="group relative bg-white p-1 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-500 hover:-translate-y-1">
                    
                    {/* Score Badge */}
                    <div className="absolute top-0 right-0 bg-white text-indigo-600 pl-8 pr-6 py-4 rounded-bl-[2.5rem] rounded-tr-[2.5rem] font-black text-2xl z-20 shadow-xl shadow-indigo-100 flex items-baseline gap-1 group-hover:scale-110 origin-top-right transition-transform border-b border-l border-indigo-50">
                      {match.matchScore}<span className="text-[10px] font-bold text-slate-400">% MATCH</span>
                    </div>

                    <div className="bg-white rounded-[2.8rem] p-8 md:p-10 relative z-10 h-full flex flex-col">
                      
                      <div className="flex flex-col lg:flex-row gap-10 mb-8">
                        
                        {/* Staff Profile */}
                        <div className="flex-1 lg:border-r lg:border-slate-100 lg:pr-10">
                          <div className="flex items-center gap-6 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-white rounded-[1.5rem] flex items-center justify-center text-4xl shadow-md border border-indigo-50/50 group-hover:scale-105 transition-transform duration-500">
                              {match.staffImg}
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900 text-2xl tracking-tight mb-1">{match.staffName}</h4>
                              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg inline-block">
                                {match.staffRole}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                              <Layers size={14}/> スキルセット
                            </p>
                            <p className="text-sm font-bold text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                              {match.staffExp}
                            </p>
                          </div>
                        </div>

                        {/* Project Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-5 mb-6">
                            <div className="w-14 h-14 bg-indigo-100 rounded-[1.2rem] flex items-center justify-center text-indigo-600 shadow-inner">
                              <Briefcase size={24}/>
                            </div>
                            <div>
                              <h4 className="font-black text-slate-800 text-xl leading-tight line-clamp-1">{match.projectName}</h4>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase tracking-wide border border-emerald-100 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                  {match.price}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                              <Target size={14}/> 必須要件
                            </p>
                            <p className="text-sm font-bold text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border-2 border-slate-50 shadow-sm">
                              {match.projectTech}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="flex-1 w-full">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {match.tags.map((tag:string, i:number) => (
                              <span key={i} className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-sm ${
                                tag === 'ベストマッチ' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                tag === '単価UP' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                'bg-slate-50 text-slate-600 border-slate-100'
                              }`}>
                                {tag === 'ベストマッチ' && <Sparkles size={12} fill="currentColor"/>}
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50">
                             <div className="shrink-0 pt-0.5"><Sparkles size={18} className="text-indigo-500" fill="currentColor"/></div>
                             <p className="text-xs text-slate-600 font-bold leading-relaxed">
                               {match.reason}
                             </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 w-full md:w-auto shrink-0">
                          <button 
                            onClick={() => handleDecline(match.id)}
                            disabled={processingId === match.id}
                            className="flex-1 md:flex-none py-4 px-6 rounded-2xl border-2 border-slate-100 text-slate-400 font-black hover:bg-slate-50 hover:text-slate-600 hover:border-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-wide active:scale-95"
                          >
                            {processingId === match.id ? <Loader2 size={18} className="animate-spin"/> : <XCircle size={18}/>}
                            見送る
                          </button>
                          <button 
                            onClick={() => handlePropose(match.id, match.staffName)}
                            disabled={processingId === match.id}
                            className="flex-1 md:flex-none py-4 px-8 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2.5 disabled:opacity-50 text-xs uppercase tracking-wide"
                          >
                            {processingId === match.id ? <Loader2 size={18} className="animate-spin"/> : <CheckCircle2 size={18}/>}
                            提案を承認
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/50 text-slate-400">
                  <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                    <Search size={48} className="text-slate-200" />
                  </div>
                  <p className="font-black text-xl text-slate-300">マッチング候補なし</p>
                  <p className="text-xs font-bold opacity-60 mt-1">フィルター条件を変更して再検索してください。</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}