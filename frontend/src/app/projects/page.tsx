'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Briefcase, Plus, Search, Calendar, Building2, 
  MoreHorizontal, TrendingUp, CheckCircle2, Clock, 
  Kanban, Users, CreditCard, ArrowRight, X 
} from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', clientId: '', startDate: '', endDate: '', description: '', status: 'planning', budget: 0 });

  const fetchData = async () => {
    try {
      // ダミーデータ（本来はfetchで取得）
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dummyProjects = [
        { id: 1, name: '次世代ECプラットフォーム構築', status: 'planning', startDate: '2023-11-01', budget: 15000000, client: { companyName: '株式会社ダミー1' }, assignments: [{ staff: { name: '山田' } }, { staff: { name: '鈴木' } }] },
        { id: 2, name: 'AIチャットボット導入', status: 'active', startDate: '2023-10-15', budget: 8000000, client: { companyName: 'ダミー2商事' }, assignments: [{ staff: { name: '佐藤' } }] },
        { id: 3, name: '社内ポータル刷新', status: 'completed', startDate: '2023-08-01', budget: 5000000, client: { companyName: '株式会社ダミー1' }, assignments: [] },
        { id: 4, name: 'SaaS製品UI/UX改善', status: 'planning', startDate: '2024-01-10', budget: 6500000, client: { companyName: 'ダミー3テクノロジー' }, assignments: [{ staff: { name: '高橋' } }] },
      ];
      const dummyClients = [
        { id: '1', companyName: '株式会社ダミー1' },
        { id: '2', companyName: 'ダミー2商事' },
        { id: '3', companyName: 'ダミー3テクノロジー' },
      ];

      setProjects(dummyProjects);
      setClients(dummyClients);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!newProject.name || !newProject.clientId) return;
    // APIコール（シミュレーション）
    console.log('Creating project:', newProject);
    setNewProject({ name: '', clientId: '', startDate: '', endDate: '', description: '', status: 'planning', budget: 0 });
    setIsModalOpen(false);
    fetchData(); // 実際はここで再取得
  };

  const filterByStatus = (status: string) => projects.filter(p => p.status === status && (p.name.toLowerCase().includes(search.toLowerCase()) || p.client?.companyName.toLowerCase().includes(search.toLowerCase())));

  const StatusColumn = ({ title, status, icon: Icon, colorClass, bgClass, borderClass }: any) => (
    <div className="flex-1 min-w-[340px] flex flex-col h-full bg-slate-50/50 backdrop-blur-sm rounded-[32px] border border-slate-200/60 p-4 shadow-inner ring-1 ring-white/50">
      
      {/* Column Header */}
      <div className={`flex items-center justify-between p-4 rounded-[20px] bg-white border border-slate-100 mb-4 shadow-sm sticky top-0 z-10`}>
        <div className={`flex items-center gap-3 font-black text-sm uppercase tracking-wide ${colorClass}`}>
          <div className={`p-2.5 rounded-xl ${bgClass}`}>
             <Icon size={18} />
          </div>
          {title}
        </div>
        <span className="bg-slate-50 px-3 py-1 rounded-lg text-xs font-black text-slate-500 border border-slate-100 tabular-nums">
          {filterByStatus(status).length}
        </span>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1 pb-2">
        {filterByStatus(status).map(proj => (
          <div 
            key={proj.id} 
            onClick={() => router.push(`/projects/${proj.id}`)} 
            className="group bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
          >
            {/* Hover Accent Bar */}
            <div className={`absolute top-0 left-0 w-1.5 h-full ${bgClass.replace('bg-', 'bg-opacity-100 bg-')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

            <div className="flex justify-between items-start mb-3 pl-2">
              <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-100 truncate max-w-[180px]">
                <Building2 size={12} className="text-slate-400" /> {proj.client?.companyName}
              </span>
              <button className="text-slate-300 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full -mr-2 -mt-2">
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            <h4 className="font-black text-slate-800 text-lg mb-5 leading-snug group-hover:text-indigo-700 transition-colors pl-2">
              {proj.name}
            </h4>
            
            <div className="grid grid-cols-2 gap-3 mb-6 pl-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Calendar size={14} className="text-slate-300 shrink-0"/> 
                <span className="truncate">{new Date(proj.startDate).toLocaleDateString()}</span>
              </div>
              {proj.budget > 0 && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CreditCard size={14} className="text-slate-300 shrink-0"/> 
                  <span className="truncate">¥{proj.budget.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-50 pt-4 flex justify-between items-center pl-2">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3 overflow-hidden py-1 pl-1">
                  {proj.assignments?.slice(0, 3).map((a: any, i: number) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-600 shadow-sm relative z-10 ring-1 ring-slate-100" title={a.staff?.name}>
                      {a.staff?.name.charAt(0)}
                    </div>
                  ))}
                  {proj.assignments?.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[9px] font-black text-slate-400 relative z-0 ring-1 ring-slate-100">
                      +{proj.assignments.length - 3}
                    </div>
                  )}
                </div>
                {proj.assignments?.length === 0 && <span className="text-[10px] text-slate-400 font-bold italic flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md"><Users size={12}/> 未アサイン</span>}
              </div>
              
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm group-hover:shadow-indigo-500/30">
                <ArrowRight size={14} strokeWidth={3} />
              </div>
            </div>
          </div>
        ))}
        
        {filterByStatus(status).length === 0 && (
          <div className="h-48 border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center text-slate-300 gap-3 bg-white/30 m-2">
            <div className="p-4 bg-white/50 rounded-full"><Kanban size={32} className="opacity-50" /></div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">No Projects</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 animate-in fade-in h-[calc(100vh-6rem)] relative font-sans text-slate-800">
        
        {/* 背景装飾 */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.6]" 
             style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #f1f5f9 0%, transparent 50%), radial-gradient(circle at 100% 0%, #e0e7ff 0%, transparent 50%)' }}>
        </div>

        {/* --- Command Header --- */}
        <div className="flex-none sticky top-0 z-30 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] p-5 flex flex-col lg:flex-row items-center justify-between gap-5 transition-all ring-1 ring-slate-900/5 mt-2 mx-2">
          <div className="flex items-center gap-5 w-full lg:w-auto">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
              <Briefcase size={28} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                プロジェクト管理ボード
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                <TrendingUp size={10} className="text-indigo-500"/> Status & Resource Tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto flex-1 justify-end">
            <div className="relative group w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18}/>
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 shadow-sm" 
                placeholder="プロジェクト名や企業名で検索..." 
              />
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all whitespace-nowrap text-xs uppercase tracking-wide active:scale-95"
            >
              <Plus size={18} strokeWidth={3} /> 新規作成
            </button>
          </div>
        </div>

        {/* --- Kanban Board --- */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 relative z-10 px-2">
          <div className="flex gap-6 h-full min-w-max">
            <StatusColumn 
              title="企画・交渉中 (Planning)" 
              status="planning" 
              icon={Clock} 
              colorClass="text-amber-600" 
              bgClass="bg-amber-100" 
              borderClass="border-amber-100"
            />
            <StatusColumn 
              title="稼働中 (Active)" 
              status="active" 
              icon={TrendingUp} 
              colorClass="text-indigo-600" 
              bgClass="bg-indigo-100" 
              borderClass="border-indigo-100"
            />
            <StatusColumn 
              title="完了・契約終了 (Completed)" 
              status="completed" 
              icon={CheckCircle2} 
              colorClass="text-emerald-600" 
              bgClass="bg-emerald-100" 
              borderClass="border-emerald-100"
            />
          </div>
        </div>

        {/* --- Creation Modal --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative overflow-hidden">
              
              <div className="bg-slate-900 p-8 flex justify-between items-center text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none"><Briefcase size={120} /></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl shadow-lg backdrop-blur-sm"><Plus size={24} className="text-indigo-200"/></div>
                    <div>
                        <span className="block text-[10px] font-bold text-indigo-300 uppercase tracking-widest">New Initiative</span>
                        <span className="block font-black text-xl tracking-tight">新規プロジェクト登録</span>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors relative z-10"><X size={20}/></button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">プロジェクト名</label>
                  <input 
                    value={newProject.name} 
                    onChange={e => setNewProject({...newProject, name: e.target.value})} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all placeholder:text-slate-300" 
                    placeholder="例: 次世代ECプラットフォーム開発" 
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">クライアント企業</label>
                  <div className="relative">
                    <select 
                      value={newProject.clientId} 
                      onChange={e => setNewProject({...newProject, clientId: e.target.value})} 
                      className="w-full pl-5 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">企業を選択してください...</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ArrowRight size={16} className="rotate-90"/>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">開始予定日</label>
                    <input 
                      type="date" 
                      value={newProject.startDate} 
                      onChange={e => setNewProject({...newProject, startDate: e.target.value})} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-600 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">予算 (円)</label>
                    <input 
                      type="number" 
                      value={newProject.budget} 
                      onChange={e => setNewProject({...newProject, budget: Number(e.target.value)})} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all placeholder:text-slate-300" 
                      placeholder="0" 
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs border border-transparent hover:border-slate-200"
                  >
                    キャンセル
                  </button>
                  <button 
                    onClick={handleCreate} 
                    className="flex-[2] bg-slate-900 text-white py-4 rounded-xl font-black shadow-xl hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Plus size={16} strokeWidth={3}/> プロジェクト作成
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}