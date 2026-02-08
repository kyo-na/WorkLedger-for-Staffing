'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Printer, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ 
    clientId: '', 
    issueDate: new Date().toISOString().split('T')[0] 
  });

  const fetchData = async () => {
    try {
      const [resInv, resCli] = await Promise.all([
        fetch('http://localhost:3000/invoices'),
        fetch('http://localhost:3000/clients')
      ]);
      
      if (resInv.ok) {
        const data = await resInv.json();
        setInvoices(Array.isArray(data) ? data : []);
      }
      if (resCli.ok) {
        const data = await resCli.json();
        setClients(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error(error);
      setInvoices([]);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!formData.clientId) {
      alert('請求先クライアントを選択してください');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: Number(formData.clientId),
          issueDate: formData.issueDate
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ ...formData, clientId: '' });
        fetchData();
        alert('請求書を作成しました');
      } else {
        alert('作成に失敗しました。');
      }
    } catch (e) {
      console.error(e);
      alert('エラーが発生しました');
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('本当に削除しますか？')) return;
    await fetch(`http://localhost:3000/invoices/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in pb-20">
        
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">INVOICE<span className="text-indigo-600">SYSTEM</span></h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">請求書発行・管理</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus size={20}/> 請求書作成 (自動集計)
          </button>
        </div>

        {/* 請求書リスト */}
        <div className="space-y-4">
          {invoices.length > 0 ? (
            invoices.map((inv) => (
              <div key={inv.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex flex-col items-center justify-center font-bold border border-slate-100 shrink-0">
                    <span className="text-[10px] uppercase">DOC</span>
                    <span className="text-xl text-slate-800">{inv.id}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      {inv.client?.companyName || '顧客不明'}
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase">{inv.status || 'DRAFT'}</span>
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 flex flex-col md:flex-row gap-1 md:gap-4">
                      <span>📅 発行: {new Date(inv.issueDate).toLocaleDateString()}</span>
                      <span>Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">TOTAL AMOUNT</p>
                    <p className="text-2xl font-black text-slate-900">¥{Number(inv.totalAmount || 0).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* ★修正: 背景色を削除してシンプルに。クリックで印刷ページへ */}
                    <button 
                      onClick={() => router.push(`/invoices/${inv.id}/print`)}
                      className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      title="印刷プレビュー"
                    >
                      <Printer size={20}/>
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(inv.id)} 
                      className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="削除"
                    >
                      <Trash2 size={20}/>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-bold opacity-50">
              請求書データはありません
            </div>
          )}
        </div>

        {/* 作成モーダル */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">新規請求書作成</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">請求先クライアント</label>
                  <select 
                    value={formData.clientId} 
                    onChange={e => setFormData({...formData, clientId: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100 focus:ring-2 ring-indigo-600/20"
                  >
                    <option value="">選択してください...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                  </select>
                  <p className="text-[10px] text-indigo-500 font-bold mt-2 ml-2">※ 「完了」ステータスの案件を自動集計します</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">発行日</label>
                  <input 
                    type="date" 
                    value={formData.issueDate}
                    onChange={e => setFormData({...formData, issueDate: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">キャンセル</button>
                  <button onClick={handleCreate} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700">作成 & 集計</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}