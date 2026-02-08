'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Search, Trash2, Plus } from 'lucide-react';

export default function SkillMasterPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [search, setSearch] = useState('');

  const fetchSkills = async () => {
    try {
      const res = await fetch('http://localhost:3000/skills');
      if (res.ok) setSkills(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleCreate = async () => {
    if (!newSkillName) {
      alert('スキル名を入力してください');
      return;
    }
    
    try {
      const res = await fetch('http://localhost:3000/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSkillName }) // APIに合わせてオブジェクトで送信
      });
      
      if (!res.ok) throw new Error('登録に失敗しました');
      
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
      await fetch(`http://localhost:3000/skills/${id}`, { method: 'DELETE' });
      fetchSkills();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredSkills = skills.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="flex flex-col xl:flex-row gap-8 animate-in fade-in pb-10">
        
        {/* 左側：登録フォーム */}
        <div className="w-full xl:w-1/3 bg-white p-8 rounded-[2.5rem] shadow-xl h-fit border border-slate-100 sticky top-4">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <span className="italic">SKILL</span><span className="text-indigo-600">MASTER</span>
          </h2>
          <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">
            登録済み: {skills.length} 件
          </p>
          
          <div className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Plus className="text-indigo-600"/> 新規マスタ登録
              </h3>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">SKILL NAME</label>
                <input 
                  value={newSkillName} 
                  onChange={e => setNewSkillName(e.target.value)} 
                  className="w-full p-4 bg-white rounded-xl font-bold outline-none border border-slate-200 focus:ring-2 ring-indigo-500/20" 
                  placeholder="例 : Java, AWS, 簿記..." 
                />
                
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 mt-2 block">DESCRIPTION (任意)</label>
                <textarea 
                  className="w-full p-4 bg-white rounded-xl font-bold outline-none border border-slate-200 h-24 resize-none" 
                  placeholder="詳細説明..."
                />

                <button 
                  onClick={handleCreate}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all mt-2"
                >
                  マスタへ保存
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 右側：一覧リスト */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 sticky top-4 z-10">
            <Search className="ml-4 text-slate-300" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="flex-1 p-2 bg-transparent font-bold outline-none text-lg" placeholder="スキル検索..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map(skill => (
              <div key={skill.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">
                    {skill.name.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-800">{skill.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">ID: {skill.id}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(skill.id)} className="p-3 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            {filteredSkills.length === 0 && (
              <div className="col-span-2 p-10 text-center border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-bold">
                該当するスキルが見つかりません
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}