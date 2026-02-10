'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ScrollText, Plus, Trash2, Search, ShieldCheck, Database, ArrowRight } from 'lucide-react';

export default function LicenseMasterPage() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [search, setSearch] = useState('');

  const fetchLicenses = async () => {
    try {
      // ダミーデータ（APIの代わり）
      await new Promise(resolve => setTimeout(resolve, 500));
      const dummyLicenses = [
        { id: 1, name: '基本情報技術者' },
        { id: 2, name: '応用情報技術者' },
        { id: 3, name: 'AWS Certified Solutions Architect - Associate' },
        { id: 4, name: 'Google Cloud Professional Cloud Architect' },
        { id: 5, name: 'PMP (Project Management Professional)' },
      ];
      setLicenses(dummyLicenses);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchLicenses(); }, []);

  const handleAdd = async () => {
    if (!newName) return;
    // APIコール（シミュレーション）
    console.log('Adding license:', newName);
    setNewName(''); 
    fetchLicenses();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？\n※この資格を持つ全スタッフのデータからも消えます')) return;
    // APIコール（シミュレーション）
    console.log('Deleting license:', id);
    fetchLicenses();
  };

  const filteredLicenses = licenses.filter(lic => lic.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 animate-in fade-in pb-24 relative min-h-screen font-sans text-slate-800 bg-slate-50/50">
        
        {/* 背景装飾 */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        {/* --- Master Header --- */}
        <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden ring-1 ring-slate-900/5 mt-4 mx-4 md:mx-0">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
              <ShieldCheck size={32} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                資格マスター管理
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                <Database size={10}/> Master Data Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-100 relative z-10 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered</p>
              <p className="text-2xl font-black text-slate-800 tabular-nums leading-none">{licenses.length}</p>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ScrollText size={18} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 px-4 md:px-0">
          
          {/* --- Left: Registration Panel (Sticky) --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-6 ring-1 ring-slate-900/5">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                  <Plus size={20} strokeWidth={3} />
                </div>
                <h3 className="font-black text-lg text-slate-800">新規資格登録</h3>
              </div>
              
              <div className="space-y-5">
                <div className="group">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block group-focus-within:text-emerald-600 transition-colors">資格名称</label>
                  <input 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300 shadow-inner" 
                    placeholder="例: ITパスポート" 
                  />
                </div>
                <button 
                  onClick={handleAdd} 
                  disabled={!newName}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-emerald-600 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn active:scale-95"
                >
                  <span>マスターに登録</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  ※ ここで登録した資格は、スタッフのプロフィール編集画面で選択可能になります。データの整合性を保つため、正確な名称で登録してください。
                </p>
              </div>
            </div>
          </div>

          {/* --- Right: List View --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search size={20} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all shadow-sm" 
                placeholder="資格名で検索..." 
              />
            </div>

            {/* List Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredLicenses.map((lic) => (
                <div 
                  key={lic.id} 
                  className="group relative bg-white p-1 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
                >
                  <div className="bg-white rounded-[1.8rem] p-5 flex justify-between items-center h-full relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-bold text-xl border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all duration-300 shrink-0">
                        <ScrollText size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-slate-800 group-hover:text-emerald-700 transition-colors">{lic.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded inline-block mt-1 border border-slate-200">ID: {String(lic.id).padStart(4, '0')}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(lic.id)} 
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95"
                      title="マスターから削除"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}

              {filteredLicenses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 text-slate-400">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                    <Search size={32} className="text-slate-300" />
                  </div>
                  <p className="font-bold text-slate-500">該当する資格が見つかりません</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}