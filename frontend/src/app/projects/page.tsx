'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Briefcase, Plus, Search, Calendar, Building2, MoreHorizontal, TrendingUp, CheckCircle2, Clock } from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', clientId: '', startDate: '', endDate: '', description: '', status: 'planning', budget: 0 });

  const fetchData = async () => {
    try {
      const [resProj, resClients] = await Promise.all([ fetch('http://localhost:3000/projects'), fetch('http://localhost:3000/clients') ]);
      if (resProj.ok) setProjects(await resProj.json());
      if (resClients.ok) setClients(await resClients.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!newProject.name || !newProject.clientId) return;
    await fetch('http://localhost:3000/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProject) });
    setNewProject({ name: '', clientId: '', startDate: '', endDate: '', description: '', status: 'planning', budget: 0 });
    setIsModalOpen(false);
    fetchData();
  };

  const filterByStatus = (status: string) => projects.filter(p => p.status === status && (p.name.toLowerCase().includes(search.toLowerCase()) || p.client?.companyName.toLowerCase().includes(search.toLowerCase())));

  const StatusColumn = ({ title, status, icon: Icon, colorClass, bgClass }: any) => (
    <div className="flex-1 min-w-[300px] flex flex-col gap-4">
      <div className={`flex items-center justify-between p-4 rounded-2xl ${bgClass} border border-transparent`}>
        <div className="flex items-center gap-2 font-black text-slate-700"><Icon size={20} className={colorClass} /> {title} <span className="bg-white px-2 py-0.5 rounded-md text-xs shadow-sm text-slate-500">{filterByStatus(status).length}</span></div>
      </div>
      <div className="flex-1 space-y-3">
        {filterByStatus(status).map(proj => (
          <div key={proj.id} onClick={() => router.push(`/projects/${proj.id}`)} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md flex items-center gap-1"><Building2 size={10} /> {proj.client?.companyName}</span>
            </div>
            <h4 className="font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{proj.name}</h4>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-3"><span className="flex items-center gap-1"><Calendar size={12}/> {new Date(proj.startDate).toLocaleDateString()}</span></div>
            <div className="border-t border-slate-50 pt-3 flex justify-between items-center">
              <div className="flex -space-x-2">
                {proj.assignments?.slice(0, 3).map((a: any, i: number) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-indigo-600">{a.staff?.name.charAt(0)}</div>
                ))}
                {proj.assignments?.length > 3 && <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-500">+{proj.assignments.length - 3}</div>}
              </div>
              {proj.budget > 0 && <span className="text-xs font-black text-slate-600">¥{proj.budget.toLocaleString()}</span>}
            </div>
          </div>
        ))}
        {filterByStatus(status).length === 0 && <div className="h-24 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 font-bold text-xs">案件なし</div>}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex justify-between items-end">
          <div><h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">PROJECT<span className="text-indigo-600">BOARD</span></h2><p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">案件進捗管理ボード</p></div>
          <div className="flex gap-4">
            <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/><input value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-3 bg-white rounded-xl shadow-sm border border-slate-100 font-bold text-sm outline-none focus:ring-2 ring-indigo-500/20" placeholder="案件検索..." /></div>
            <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all"><Plus size={18} /> 新規案件</button>
          </div>
        </div>
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-full h-full">
            <StatusColumn title="商談・計画中" status="planning" icon={Clock} colorClass="text-amber-500" bgClass="bg-amber-50" />
            <StatusColumn title="稼働中" status="active" icon={TrendingUp} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
            <StatusColumn title="完了" status="completed" icon={CheckCircle2} colorClass="text-emerald-500" bgClass="bg-emerald-50" />
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-[2rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95">
              <h3 className="text-xl font-black mb-6">新規プロジェクト作成</h3>
              <div className="space-y-4">
                <input value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100" placeholder="案件名" />
                <select value={newProject.clientId} onChange={e => setNewProject({...newProject, clientId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100"><option value="">顧客を選択...</option>{clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}</select>
                <div className="grid grid-cols-2 gap-2">
                   <input type="date" value={newProject.startDate} onChange={e => setNewProject({...newProject, startDate: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100 text-slate-600" />
                   <input type="number" value={newProject.budget} onChange={e => setNewProject({...newProject, budget: Number(e.target.value)})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100" placeholder="予算 (円)" />
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50">キャンセル</button>
                  <button onClick={handleCreate} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg">作成する</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}