'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Building2, User, Phone, Plus, Search, ChevronRight, MapPin, Briefcase, Mail } from 'lucide-react';

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ companyName: '', contactPerson: '', email: '', phone: '', address: '' });

  const fetchClients = async () => {
    try {
      const res = await fetch('http://localhost:3000/clients');
      if (res.ok) setClients(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleCreate = async () => {
    if (!newClient.companyName) return;
    await fetch('http://localhost:3000/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newClient) });
    setNewClient({ companyName: '', contactPerson: '', email: '', phone: '', address: '' });
    setIsModalOpen(false);
    fetchClients();
  };

  const filteredClients = clients.filter(c => c.companyName.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">CLIENT<span className="text-indigo-600">LIST</span></h2>
            <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">取引先企業一覧</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all">
            <Plus size={18} /> 新規登録
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 font-bold outline-none focus:ring-2 ring-indigo-500/20" placeholder="企業名、担当者名で検索..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <div 
              key={client.id} 
              onClick={() => router.push(`/clients/${client.id}`)}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center font-bold border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Building2 size={24} />
                </div>
                <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-wide group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  Active
                </div>
              </div>
              
              <h4 className="font-black text-xl text-slate-800 mb-2 line-clamp-1">{client.companyName}</h4>
              
              <div className="space-y-2 mb-6 flex-1">
                <p className="text-xs text-slate-500 font-bold flex items-center gap-2">
                  <User size={14} className="text-slate-300"/> {client.contactPerson || '担当者未設定'}
                </p>
                <p className="text-xs text-slate-500 font-bold flex items-center gap-2">
                  <Phone size={14} className="text-slate-300"/> {client.phone || '-'}
                </p>
                <p className="text-xs text-slate-500 font-bold flex items-center gap-2 line-clamp-1">
                  <MapPin size={14} className="text-slate-300"/> {client.address || '-'}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                   <Briefcase size={14} className="text-indigo-600"/>
                   <span className="text-xs font-black text-slate-700">{client.projects?.length || 0} Projects</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-[2rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95">
              <h3 className="text-xl font-black mb-6">新規取引先登録</h3>
              <div className="space-y-3">
                <input value={newClient.companyName} onChange={e => setNewClient({...newClient, companyName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100" placeholder="会社名" />
                <input value={newClient.contactPerson} onChange={e => setNewClient({...newClient, contactPerson: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100" placeholder="担当者名" />
                <input value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100" placeholder="電話番号" />
                <input value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100" placeholder="メールアドレス" />
                <input value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100" placeholder="住所" />
                <div className="flex gap-2 pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50">キャンセル</button>
                  <button onClick={handleCreate} className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg">登録する</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}