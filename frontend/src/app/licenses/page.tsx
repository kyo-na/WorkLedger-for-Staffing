'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ScrollText, Plus, Trash2, Search } from 'lucide-react';

export default function LicenseMasterPage() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [search, setSearch] = useState('');

  const fetchLicenses = async () => {
    try {
      const res = await fetch('http://localhost:3000/staff/master/licenses');
      if (res.ok) setLicenses(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchLicenses(); }, []);

  const handleAdd = async () => {
    if (!newName) return;
    await fetch('http://localhost:3000/staff/master/licenses', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    setNewName(''); fetchLicenses();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？\n※この資格を持つ全スタッフのデータからも消えます')) return;
    await fetch(`http://localhost:3000/staff/master/licenses/${id}`, { method: 'DELETE' });
    fetchLicenses();
  };

  const filteredLicenses = licenses.filter(lic => lic.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
        <div>
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">LICENSE<span className="text-emerald-600">MASTER</span></h2>
          <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">登録済み: {licenses.length} 件</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左：登録フォーム */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-fit sticky top-8">
            <h3 className="font-black text-lg mb-6 flex items-center gap-2"><Plus className="text-emerald-600"/> 新規マスタ登録</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">LICENSE NAME</label>
                <input 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none placeholder:text-slate-300 mt-1 focus:ring-2 ring-emerald-600/20" 
                  placeholder="例：基本情報技術者" 
                />
              </div>
              <button onClick={handleAdd} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 hover:scale-[1.02] transition-all">マスタへ保存</button>
            </div>
          </div>

          {/* 右：一覧 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <Search className="absolute left-5 top-4 text-slate-400" size={20}/>
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-14 p-4 bg-white rounded-full shadow-sm border border-slate-100 font-bold outline-none focus:ring-2 ring-emerald-600/20" placeholder="資格検索..." />
            </div>
            <div className="space-y-4">
              {filteredLicenses.map((lic) => (
                <div key={lic.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-5">
                    {/* アイコンボックス（大） */}
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                      <ScrollText size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-slate-800">{lic.name}</h4>
                      <p className="text-xs text-slate-400 font-bold mt-1">ID: {lic.id}</p>
                    </div>
                  </div>
                  {/* 削除ボタン */}
                  <button onClick={() => handleDelete(lic.id)} className="p-4 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {filteredLicenses.length === 0 && (
                <div className="text-center p-20 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                  <p className="text-slate-400 font-bold">該当なし</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}