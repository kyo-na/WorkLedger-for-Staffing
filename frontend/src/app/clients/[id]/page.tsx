'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Briefcase, Save, Trash2, Users, Calendar, UserPlus, 
  Building2, ArrowLeft, CheckCircle2, Clock, 
  AlertCircle, CreditCard, AlignLeft, Plus, Loader2
} from 'lucide-react';

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
    // ダミーデータ（APIの代わり）
    await new Promise(resolve => setTimeout(resolve, 800)); // ローディング演出用
    setProject({
      id: 1,
      name: '次世代ECプラットフォーム構築',
      description: '既存のオンプレミス環境からクラウドネイティブなマイクロサービスアーキテクチャへの移行プロジェクト。スケーラビリティと耐障害性の向上を目的とする。',
      startDate: '2023-11-01',
      endDate: '2024-03-31',
      status: 'active',
      budget: 15000000,
      client: { companyName: '株式会社ダミー1', address: 'ダミー3' },
      assignments: [
        { id: 101, role: 'Tech Lead', startDate: '2023-11-01', endDate: '', staff: { name: '山田 太郎' } },
        { id: 102, role: 'Frontend Engineer', startDate: '2023-11-15', endDate: '', staff: { name: '鈴木 一郎' } }
      ]
    });
    setStaffList([
      { id: 1, name: '山田 太郎' }, { id: 2, name: '鈴木 一郎' }, { id: 3, name: '佐藤 花子' }
    ]);
    setIsLoading(false);
  };

  useEffect(() => { if (id) fetchData(); }, [id]);

  const handleSave = async () => {
    // APIコール（シミュレーション）
    alert('プロジェクト情報を保存しました');
  };

  const handleDelete = async () => {
    if (!confirm('このプロジェクトを削除しますか？\nこの操作は取り消せません。')) return;
    router.push('/projects');
  };

  const handleAddAssignment = async () => {
    if (!assignForm.staffId || !assignForm.startDate) { alert('スタッフと開始日は必須です'); return; }
    // APIコール（シミュレーション）
    console.log('Assigning:', assignForm);
    alert('メンバーを追加しました');
    setAssignForm({ staffId: '', role: '', startDate: '', endDate: '' });
  };

  const handleRemoveAssignment = async (aid: number) => {
    if (!confirm('このメンバーをプロジェクトから外しますか？')) return;
    // APIコール（シミュレーション）
    console.log('Removing assignment:', aid);
    alert('メンバーを解除しました');
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Briefcase size={20} className="text-indigo-600/50" />
          </div>
        </div>
        <p className="text-slate-400 font-black tracking-[0.2em] text-xs uppercase animate-pulse">Loading Intelligence...</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 animate-in fade-in pb-20 relative min-h-screen font-sans text-slate-800 bg-slate-50/50">
        
        {/* 背景装飾: テクニカル・ドットパターン */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {/* --- Sticky Command Header --- */}
        <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] px-6 py-4 mx-4 md:mx-auto max-w-7xl transition-all ring-1 ring-slate-900/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            <div className="flex items-center gap-5 w-full md:w-auto">
              <button onClick={() => router.back()} className="p-3 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-slate-100 group active:scale-95">
                <ArrowLeft size={20} className="text-slate-400 group-hover:text-slate-700"/>
              </button>
              
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-slate-900/20 ring-4 ring-white">
                  <Briefcase size={24} className="text-indigo-400"/>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none truncate max-w-[300px] md:max-w-md">
                    {project.name || 'Untitled Project'}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Building2 size={10} /> {project.client?.companyName || 'No Client'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                      project.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      project.status === 'planning' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {project.status === 'active' ? <CheckCircle2 size={10}/> : project.status === 'planning' ? <Clock size={10}/> : <AlertCircle size={10}/>}
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button 
                onClick={handleDelete} 
                className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs uppercase tracking-wide flex items-center gap-2 group active:scale-95"
              >
                <Trash2 size={16} className="group-hover:scale-110 transition-transform" /> 
                <span className="hidden md:inline">削除</span>
              </button>
              <div className="h-8 w-px bg-slate-200 hidden md:block opacity-50"></div>
              <button 
                onClick={handleSave} 
                className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-widest active:scale-95 group"
              >
                <Save size={16} className="group-hover:scale-110 transition-transform" /> 保存する
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full space-y-6 relative z-10 px-4 md:px-0 mt-4">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-0 pl-4">
            <button 
              onClick={() => setActiveTab('basic')} 
              className={`px-8 py-4 rounded-t-2xl font-bold flex items-center gap-2.5 transition-all text-sm relative top-[1px] border-x border-t ${
                activeTab === 'basic' 
                  ? 'bg-white text-indigo-600 border-slate-200 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]' 
                  : 'bg-transparent text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50/50'
              }`}
            >
              <AlignLeft size={18} /> プロジェクト詳細
            </button>
            <button 
              onClick={() => setActiveTab('team')} 
              className={`px-8 py-4 rounded-t-2xl font-bold flex items-center gap-2.5 transition-all text-sm relative top-[1px] border-x border-t ${
                activeTab === 'team' 
                  ? 'bg-white text-indigo-600 border-slate-200 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]' 
                  : 'bg-transparent text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50/50'
              }`}
            >
              <Users size={18} /> チーム編成 
              <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === 'team' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                {project.assignments?.length || 0}
              </span>
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-b-[32px] rounded-tr-[32px] shadow-xl shadow-slate-200/50 border border-slate-200 min-h-[600px] p-8 md:p-12 relative overflow-hidden">
            
            {/* Tab: Basic Info */}
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Project Identity */}
                <div className="space-y-10">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><AlignLeft size={20} /></div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Project Overview</h3>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 mb-2 block">プロジェクト名</label>
                      <input 
                        value={project.name} 
                        onChange={e => setProject({...project, name: e.target.value})} 
                        className="w-full text-lg p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300" 
                        placeholder="プロジェクト名を入力"
                      />
                    </div>
                    
                    <div className="group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 mb-2 block">ステータス</label>
                      <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          {project.status === 'active' ? <CheckCircle2 size={20} className="text-emerald-500"/> : 
                           project.status === 'planning' ? <Clock size={20} className="text-amber-500"/> : 
                           <AlertCircle size={20} className="text-slate-400"/>}
                        </div>
                        <select 
                          value={project.status} 
                          onChange={e => setProject({...project, status: e.target.value})} 
                          className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                        >
                          <option value="planning">Planning (計画中)</option>
                          <option value="active">Active (稼働中)</option>
                          <option value="completed">Completed (完了)</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none border-t-[6px] border-t-slate-400 border-x-[5px] border-x-transparent"></div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 mb-2 block">詳細説明</label>
                      <textarea 
                        value={project.description || ''} 
                        onChange={e => setProject({...project, description: e.target.value})} 
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-slate-700 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300 h-48 resize-none leading-relaxed" 
                        placeholder="プロジェクトの目的、スコープ、技術スタックなどを入力..."
                      />
                    </div>
                  </div>
                </div>

                {/* Financial & Timeline */}
                <div className="space-y-10">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Calendar size={20} /></div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Timeline & Budget</h3>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 mb-2 block">開始日</label>
                        <input 
                          type="date" 
                          value={project.startDate} 
                          onChange={e => setProject({...project, startDate: e.target.value})} 
                          className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                        />
                      </div>
                      <div className="group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 mb-2 block">終了予定日</label>
                        <input 
                          type="date" 
                          value={project.endDate || ''} 
                          onChange={e => setProject({...project, endDate: e.target.value})} 
                          className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 mb-2 block">予算割り当て</label>
                      <div className="relative">
                        <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20}/>
                        <input 
                          type="number" 
                          value={project.budget} 
                          onChange={e => setProject({...project, budget: e.target.value})} 
                          className="w-full pl-14 pr-12 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300 tabular-nums text-lg" 
                          placeholder="0"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">JPY</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Team Assignment */}
            {activeTab === 'team' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Assignment Form (Sticky Left) */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 sticky top-28 shadow-inner">
                    <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl"><UserPlus size={20}/></div>
                      メンバー追加
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">スタッフ</label>
                        <div className="relative">
                            <select 
                            value={assignForm.staffId} 
                            onChange={e => setAssignForm({...assignForm, staffId: e.target.value})} 
                            className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                            >
                            <option value="">選択してください...</option>
                            {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-t-[5px] border-t-slate-400 border-x-[4px] border-x-transparent"></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">役割 (Role)</label>
                        <input 
                          value={assignForm.role} 
                          onChange={e => setAssignForm({...assignForm, role: e.target.value})} 
                          className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                          placeholder="例: Tech Lead" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">開始日</label>
                          <input 
                            type="date" 
                            value={assignForm.startDate} 
                            onChange={e => setAssignForm({...assignForm, startDate: e.target.value})} 
                            className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-xs text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">終了日 (任意)</label>
                          <input 
                            type="date" 
                            value={assignForm.endDate} 
                            onChange={e => setAssignForm({...assignForm, endDate: e.target.value})} 
                            className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-xs text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                          />
                        </div>
                      </div>

                      <button 
                        onClick={handleAddAssignment} 
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-600 hover:shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-widest mt-4"
                      >
                        <Plus size={16} strokeWidth={3} /> チームに追加
                      </button>
                    </div>
                  </div>
                </div>

                {/* Assignment List */}
                <div className="lg:col-span-2 space-y-5">
                  {project.assignments?.length > 0 ? (
                    project.assignments.map((assign: any) => (
                      <div key={assign.id} className="group bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex justify-between items-center ring-1 ring-transparent hover:ring-indigo-100">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 via-white to-white border border-indigo-100 rounded-2xl flex items-center justify-center font-black text-2xl text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                            {assign.staff?.name.substring(0, 1)}
                          </div>
                          <div>
                            <h4 className="font-black text-xl text-slate-800 flex items-center gap-3 mb-1">
                              {assign.staff?.name}
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-lg uppercase border border-slate-200 tracking-wide font-black group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                                {assign.role || 'Member'}
                              </span>
                            </h4>
                            <p className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-1.5">
                              <Calendar size={14}/> 
                              <span>
                                {new Date(assign.startDate).toLocaleDateString()} 
                                <span className="mx-2 text-slate-300">→</span> 
                                {assign.endDate ? new Date(assign.endDate).toLocaleDateString() : '継続中'}
                              </span>
                            </p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveAssignment(assign.id)} 
                          className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95"
                          title="チームから外す"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50 py-24">
                      <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                        <Users size={32} className="text-slate-300" />
                      </div>
                      <p className="font-bold text-slate-500">メンバーがまだ割り当てられていません</p>
                      <p className="text-xs mt-1 text-slate-400">左側のフォームからスタッフを追加してチームを編成してください。</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}