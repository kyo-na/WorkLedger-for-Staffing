'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Building2, User, Phone, Plus, Search, ChevronRight, 
  MapPin, Mail, Globe, MoreHorizontal, Briefcase, CheckCircle2 
} from 'lucide-react';

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ companyName: '', contactPerson: '', email: '', phone: '', address: '' });

  const fetchClients = async () => {
    // ダミーデータ
    setClients([
        { id: '1', companyName: '株式会社ダミー1', contactPerson: '田中 太郎', email: 'tanaka@dummy1.co.jp', phone: '03-1234-5678', address: 'ダミー3', projects: [{},{}] },
        { id: '2', companyName: 'ダミー2商事', contactPerson: '鈴木 一郎', email: 'suzuki@dummy2.co.jp', phone: '06-8765-4321', address: '大阪府大阪市...', projects: [{}] },
    ]);
  };

  useEffect(() => { fetchClients(); }, []);

  const handleCreate = async () => {
    if (!newClient.companyName) return;
    // APIコールシミュレーション
    console.log("Create:", newClient);
    setNewClient({ companyName: '', contactPerson: '', email: '', phone: '', address: '' });
    setIsModalOpen(false);
    fetchClients();
  };

  const filteredClients = clients.filter(c => c.companyName.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 animate-in fade-in pb-20 relative font-sans text-slate-800 bg-slate-50/50">
        
        {/* 背景装飾: テクニカル・ドットパターン */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {/* --- Header Control Panel --- */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] p-5 flex flex-col lg:flex-row items-center justify-between gap-5 transition-all ring-1 ring-slate-900/5">
          <div className="flex items-center gap-5 w-full lg:w-auto">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
              <Building2 size={28} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                取引先パートナー
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">
                Strategic Business Relationships
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto flex-1 justify-end">
            <div className="relative group w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18}/>
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 shadow-sm" 
                placeholder="企業名や担当者名で検索..." 
              />
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all whitespace-nowrap text-xs uppercase tracking-wide active:scale-95"
            >
              <Plus size={18} strokeWidth={3} /> 新規登録
            </button>
          </div>
        </div>

        {/* --- Clients Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
          {filteredClients.map(client => (
            <div 
              key={client.id} 
              onClick={() => router.push(`/clients/${client.id}`)}
              className="group relative bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full ring-1 ring-slate-900/5"
            >
              {/* Card Header Gradient */}
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-50/80 via-slate-50/20 to-transparent pointer-events-none"></div>
              
              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-700 shadow-sm group-hover:border-indigo-200 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300 relative">
                    {client.companyName.charAt(0)}
                    <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active
                      </span>
                      <button className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-black text-xl text-slate-800 mb-2 line-clamp-1 group-hover:text-indigo-700 transition-colors tracking-tight">{client.companyName}</h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Globe size={12} />
                    <span className="truncate">Partner ID: #{String(client.id).padStart(4, '0')}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <div className="p-2.5 bg-white rounded-xl text-indigo-400 shadow-sm border border-slate-50"><User size={16}/></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Contact Person</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{client.contactPerson || '未設定'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2.5 px-3 py-2 bg-white rounded-xl border border-slate-100">
                         <Phone size={14} className="text-slate-400 shrink-0"/> 
                         <span className="text-xs font-bold text-slate-600 truncate">{client.phone || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2.5 px-3 py-2 bg-white rounded-xl border border-slate-100">
                         <MapPin size={14} className="text-slate-400 shrink-0"/> 
                         <span className="text-xs font-bold text-slate-600 truncate">{client.address || '-'}</span>
                      </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between group-hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                         {[1,2,3].map(i => (
                           <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400">
                              <Briefcase size={10} />
                           </div>
                         ))}
                      </div>
                      <span className="text-xs font-bold text-slate-400 pl-1">
                        <span className="text-slate-800 text-sm mr-1">{client.projects?.length || 0}</span>Projects
                      </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm">
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Card (Empty State) */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative rounded-[32px] border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30 flex flex-col items-center justify-center gap-4 transition-all duration-300 min-h-[400px] active:scale-[0.98]"
          >
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:scale-110 shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-500/20 transition-all duration-300">
               <Plus size={40} strokeWidth={2.5} />
             </div>
             <div className="text-center">
                <p className="text-base font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest transition-colors">Register New Client</p>
                <p className="text-xs text-slate-400 mt-1 font-bold">新規パートナー企業の登録</p>
             </div>
          </button>
        </div>

        {/* --- Modal --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white p-0 rounded-[32px] w-full max-w-lg shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300 relative overflow-hidden">
              
              {/* Modal Header */}
              <div className="bg-slate-900 p-8 flex justify-between items-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none"><Building2 size={120} /></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl shadow-lg backdrop-blur-sm"><Plus size={24} className="text-indigo-200"/></div>
                    <div>
                        <span className="block text-[10px] font-bold text-indigo-300 uppercase tracking-widest">New Entry</span>
                        <span className="block font-black text-xl tracking-tight">新規クライアント登録</span>
                    </div>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">会社名 <span className="text-rose-500">*</span></label>
                  <input 
                    value={newClient.companyName} 
                    onChange={e => setNewClient({...newClient, companyName: e.target.value})} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all placeholder:text-slate-300" 
                    placeholder="例: 株式会社サンプル" 
                    autoFocus
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1"><User size={10}/> 担当者名</label>
                    <input 
                      value={newClient.contactPerson} 
                      onChange={e => setNewClient({...newClient, contactPerson: e.target.value})} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all placeholder:text-slate-300" 
                      placeholder="担当者名" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1"><Phone size={10}/> 電話番号</label>
                    <input 
                      value={newClient.phone} 
                      onChange={e => setNewClient({...newClient, phone: e.target.value})} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all placeholder:text-slate-300" 
                      placeholder="03-xxxx-xxxx" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1"><Mail size={10}/> メールアドレス</label>
                  <input 
                    value={newClient.email} 
                    onChange={e => setNewClient({...newClient, email: e.target.value})} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all placeholder:text-slate-300" 
                    placeholder="info@example.com" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1"><MapPin size={10}/> 住所</label>
                  <input 
                    value={newClient.address} 
                    onChange={e => setNewClient({...newClient, address: e.target.value})} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all placeholder:text-slate-300" 
                    placeholder="東京都港区..." 
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs border border-transparent hover:border-slate-200"
                  >
                    キャンセル
                  </button>
                  <button 
                    onClick={handleCreate} 
                    className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black shadow-xl shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} /> 登録する
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