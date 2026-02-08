'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Briefcase, Save, Trash2, Users, Calendar, UserPlus, Building2 } from 'lucide-react';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [project, setProject] = useState<any>({ name: '', description: '', startDate: '', endDate: '', status: 'active', budget: 0, client: {}, assignments: [] });
  const [staffList, setStaffList] = useState<any[]>([]);
  const [assignForm, setAssignForm] = useState({ staffId: '', role: '', startDate: '', endDate: '' });

  const fetchData = async () => {
    if (!id) return;
    try {
      const resProj = await fetch(`http://localhost:3000/projects/${id}`);
      if (resProj.ok) {
        const data = await resProj.json();
        data.startDate = data.startDate.split('T')[0];
        if (data.endDate) data.endDate = data.endDate.split('T')[0];
        setProject(data);
      }
      const resStaff = await fetch('http://localhost:3000/staff');
      if (resStaff.ok) setStaffList(await resStaff.json());
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { if (id) fetchData(); }, [id]);

  const handleSave = async () => {
    await fetch(`http://localhost:3000/projects/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: project.name, description: project.description, startDate: project.startDate, endDate: project.endDate, status: project.status, budget: Number(project.budget)
      }),
    });
    alert('保存しました'); fetchData();
  };

  const handleDelete = async () => {
    if (!confirm('削除しますか？')) return;
    await fetch(`http://localhost:3000/projects/${id}`, { method: 'DELETE' });
    router.push('/projects');
  };

  const handleAddAssignment = async () => {
    if (!assignForm.staffId || !assignForm.startDate) { alert('必須項目がありません'); return; }
    await fetch(`http://localhost:3000/projects/${id}/assignments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(assignForm) });
    setAssignForm({ staffId: '', role: '', startDate: '', endDate: '' }); fetchData();
  };

  const handleRemoveAssignment = async (aid: number) => {
    if (!confirm('解除しますか？')) return;
    await fetch(`http://localhost:3000/projects/assignments/${aid}`, { method: 'DELETE' }); fetchData();
  };

  if (isLoading) return <div className="p-20 text-center font-bold text-slate-400">LOADING...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in pb-20">
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-4 z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-2xl"><Briefcase size={28} /></div>
            <div><h2 className="text-2xl font-black text-slate-900">{project.name}</h2><p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Building2 size={12}/> {project.client?.companyName}</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDelete} className="bg-red-50 text-red-500 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-100"><Trash2 size={20} /> 削除</button>
            <button onClick={handleSave} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:bg-indigo-700"><Save size={20} /> 保存</button>
          </div>
        </div>

        <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex gap-1">
          <button onClick={() => setActiveTab('basic')} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'basic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}><Briefcase size={18} /> 基本情報</button>
          <button onClick={() => setActiveTab('team')} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'team' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}><Users size={18} /> チーム編成 ({project.assignments?.length})</button>
        </div>

        {activeTab === 'basic' && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-slate-400 uppercase ml-2">プロジェクト名</label><input value={project.name} onChange={e => setProject({...project, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600" /></div>
            <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase ml-2">開始日</label><input type="date" value={project.startDate} onChange={e => setProject({...project, startDate: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600 text-slate-700" /></div>
            <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase ml-2">終了日 (予定)</label><input type="date" value={project.endDate || ''} onChange={e => setProject({...project, endDate: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600 text-slate-700" /></div>
            <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase ml-2">予算 (円)</label><input type="number" value={project.budget} onChange={e => setProject({...project, budget: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600" /></div>
            <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase ml-2">ステータス</label><select value={project.status} onChange={e => setProject({...project, status: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600"><option value="planning">Planning (計画中)</option><option value="active">Active (稼働中)</option><option value="completed">Completed (完了)</option></select></div>
            <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-slate-400 uppercase ml-2">詳細説明</label><textarea value={project.description || ''} onChange={e => setProject({...project, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600 h-32 resize-none" /></div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-fit">
              <h3 className="font-black text-lg mb-6 flex items-center gap-2"><UserPlus className="text-indigo-600"/> スタッフ追加</h3>
              <div className="space-y-4">
                <select value={assignForm.staffId} onChange={e => setAssignForm({...assignForm, staffId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100"><option value="">スタッフを選択...</option>{staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                <input value={assignForm.role} onChange={e => setAssignForm({...assignForm, role: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100" placeholder="役割 (例: PM)" />
                <input type="date" value={assignForm.startDate} onChange={e => setAssignForm({...assignForm, startDate: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100" />
                <button onClick={handleAddAssignment} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800">チームに追加</button>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {project.assignments?.map((assign: any) => (
                <div key={assign.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl">{assign.staff?.name.substring(0, 1)}</div>
                    <div><h4 className="font-black text-xl text-slate-800">{assign.staff?.name}</h4><p className="text-xs text-slate-500 font-bold flex items-center gap-2 mt-1"><span className="bg-slate-100 px-2 py-0.5 rounded-md uppercase">{assign.role || 'MEMBER'}</span><span className="flex items-center gap-1"><Calendar size={12}/> {new Date(assign.startDate).toLocaleDateString()}</span></p></div>
                  </div>
                  <button onClick={() => handleRemoveAssignment(assign.id)} className="p-4 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={20} /></button>
                </div>
              ))}
              {(!project.assignments || project.assignments.length === 0) && <div className="text-center p-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-bold">メンバーがいません</div>}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}