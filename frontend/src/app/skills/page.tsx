'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Search, Trash2, Plus, Code2, Layers, Cpu, Database, ArrowRight } from 'lucide-react';

export default function SkillMasterPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [search, setSearch] = useState('');

  const fetchSkills = async () => {
    try {
      // ダミーデータ（APIの代わり）
      await new Promise(resolve => setTimeout(resolve, 500));
      const dummySkills = [
        { id: 1, name: 'React' },
        { id: 2, name: 'TypeScript' },
        { id: 3, name: 'Next.js' },
        { id: 4, name: 'Node.js' },
        { id: 5, name: 'Python' },
        { id: 6, name: 'AWS' },
        { id: 7, name: 'Docker' },
        { id: 8, name: 'Kubernetes' },
      ];
      setSkills(dummySkills);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleCreate = async () => {
    if (!newSkillName) {
      alert('スキル名を入力してください');
      return;
    }
    
    try {
      // APIコール（シミュレーション）
      console.log('Creating skill:', newSkillName);
      // 実際にはここで再取得
      setNewSkillName('');
      fetchSkills();
    } catch (e) {
      console.error(e);
      alert('登録できませんでした。サーバーが起動しているか確認してください。');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当にこのマスタを削除しますか？\n※紐付いているスタッフデータにも影響する可能性があります')) return;
    
    try {
      // APIコール（シミュレーション）
      console.log('Deleting skill:', id);
      fetchSkills();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredSkills = skills.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 animate-in fade-in pb-24 relative min-h-screen font-sans text-slate-800 bg-slate-50/50">
        
        {/* 背景装飾: テック感のある回路図パターン */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        {/* --- Master Header --- */}
        <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden ring-1 ring-slate-900/5 mt-4 mx-4 md:mx-0">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none blur-3xl"></div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
              <Cpu size={32} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                スキルマスター管理
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                <Layers size={10}/> Technical Stack Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-100 relative z-10 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Defined Skills</p>
              <p className="text-3xl font-black text-slate-800 tabular-nums leading-none">{skills.length}</p>
            </div>
            <div className="w-px h-10 bg-slate-100"></div>
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Code2 size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 px-4 md:px-0">
          
          {/* --- Left: Registration Panel (Sticky) --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-6 ring-1 ring-slate-900/5">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-sm">
                  <Plus size={24} strokeWidth={3} />
                </div>
                <div>
                    <h3 className="font-black text-xl text-slate-900 tracking-tight">新規スキル登録</h3>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">Add New Tech Stack</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block group-focus-within:text-blue-600 transition-colors tracking-wider">Skill Name</label>
                  <input 
                    value={newSkillName} 
                    onChange={(e) => setNewSkillName(e.target.value)} 
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300 shadow-inner text-lg" 
                    placeholder="例: React, Python, AWS" 
                  />
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block group-focus-within:text-blue-600 transition-colors tracking-wider">Description (Optional)</label>
                  <textarea 
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300 h-32 resize-none leading-relaxed shadow-inner" 
                    placeholder="このスキルに関する補足説明..."
                  />
                </div>

                <button 
                  onClick={handleCreate} 
                  disabled={!newSkillName}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group/btn text-sm uppercase tracking-widest active:scale-95"
                >
                  <span>Register Skill</span>
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform"/>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  ※ ここで登録したスキルは、スタッフのプロフィール編集画面で選択可能になります。データの整合性を保つため、正確な名称で登録してください。
                </p>
              </div>
            </div>
          </div>

          {/* --- Right: List View --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search size={22} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full pl-16 pr-6 py-6 bg-white border border-slate-200 rounded-[28px] font-bold text-lg text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 transition-all shadow-sm" 
                placeholder="スキル名で検索..." 
              />
            </div>

            {/* List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredSkills.map((skill) => (
                <div 
                  key={skill.id} 
                  className="group relative bg-white p-1 rounded-[28px] shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300 ring-1 ring-transparent hover:ring-blue-100"
                >
                  <div className="bg-white rounded-[24px] p-6 flex justify-between items-center h-full relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black text-2xl border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all duration-300 shrink-0 uppercase shadow-inner">
                        {skill.name.substring(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-xl text-slate-800 group-hover:text-blue-700 transition-colors truncate tracking-tight">{skill.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg inline-block mt-1.5 border border-slate-100">ID: {String(skill.id).padStart(4, '0')}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(skill.id)} 
                      className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95"
                      title="マスターから削除"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}

              {filteredSkills.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50 text-slate-400">
                  <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                    <Search size={48} className="text-slate-200" />
                  </div>
                  <p className="font-black text-xl text-slate-300">No skills found</p>
                  <p className="text-xs font-bold opacity-60 mt-1">Try a different keyword or add a new skill.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}