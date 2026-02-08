'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, FileText, CheckCircle, Clock, AlertCircle, Printer, Send, Trash2 } from 'lucide-react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 生成用フォーム
  const [generateForm, setGenerateForm] = useState({
    clientId: '',
    month: new Date().toISOString().slice(0, 7) // YYYY-MM
  });

  const fetchData = async () => {
    try {
      const [resInvoices, resClients] = await Promise.all([
        fetch('http://localhost:3000/invoices'),
        fetch('http://localhost:3000/clients')
      ]);
      if (resInvoices.ok) setInvoices(await resInvoices.json());
      if (resClients.ok) setClients(await resClients.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleGenerate = async () => {
    if (!generateForm.clientId) return alert('取引先を選択してください');
    
    const [y, m] = generateForm.month.split('-');
    
    await fetch('http://localhost:3000/invoices/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: generateForm.clientId,
        year: y,
        month: m
      })
    });
    
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当にこの請求書を削除しますか？')) return;
    await fetch(`http://localhost:3000/invoices/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1"><CheckCircle size={12}/> PAID</span>;
      case 'sent': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1"><Send size={12}/> SENT</span>;
      case 'overdue': return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1"><AlertCircle size={12}/> OVERDUE</span>;
      default: return <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1"><Clock size={12}/> DRAFT</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in pb-20">
        
        {/* ヘッダー */}
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">INVOICE<span className="text-indigo-600">SYSTEM</span></h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">請求書発行・管理</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all">
            <Plus size={18} /> 請求書作成
          </button>
        </div>

        {/* 請求書リスト */}
        <div className="grid grid-cols-1 gap-4">
          {invoices.map((inv) => (
            <div key={inv.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group">
              
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex flex-col items-center justify-center font-bold border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <span className="text-xs">DOC</span>
                  <span className="text-xl">{inv.id}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black text-slate-800">{inv.client.companyName}</h3>
                    {getStatusBadge(inv.status)}
                  </div>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                    <FileText size={12}/> {inv.subject}
                    <span className="text-slate-300">|</span>
                    Due: {new Date(inv.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Amount</p>
                  <p className="text-2xl font-black text-slate-900">¥{inv.totalAmount.toLocaleString()}</p>
                </div>
                
                <div className="flex gap-2">
                  {/* ★修正: 赤色のプリンターボタン */}
                  <button 
                    onClick={() => window.open(`/invoices/${inv.id}/print`, '_blank')} 
                    className="p-3 hover:bg-red-50 rounded-xl text-red-500 hover:text-red-600 transition-colors" 
                    title="印刷プレビュー"
                  >
                    <Printer size={20}/>
                  </button>
                  
                  {/* 削除ボタン */}
                  <button onClick={() => handleDelete(inv.id)} className="p-3 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-colors" title="削除">
                    <Trash2 size={20}/>
                  </button>
                </div>
              </div>

            </div>
          ))}

          {invoices.length === 0 && (
             <div className="text-center p-12 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-[2rem]">
               請求書データはありません
             </div>
          )}
        </div>

        {/* 生成モーダル */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <FileText className="text-indigo-600"/> 請求書自動生成
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">取引先</label>
                  <select 
                    value={generateForm.clientId} 
                    onChange={e => setGenerateForm({...generateForm, clientId: e.target.value})}
                    className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border border-transparent focus:border-indigo-500"
                  >
                    <option value="">選択してください</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">対象月</label>
                  <input 
                    type="month" 
                    value={generateForm.month} 
                    onChange={e => setGenerateForm({...generateForm, month: e.target.value})}
                    className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border border-transparent focus:border-indigo-500"
                  />
                </div>

                <div className="bg-indigo-50 p-4 rounded-xl text-xs font-bold text-indigo-800 leading-relaxed">
                  ※ 選択した月の「勤怠データ」と「承認済み経費」を集計し、請求書をドラフト作成します。
                </div>

                <div className="flex gap-2 pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">キャンセル</button>
                  <button onClick={handleGenerate} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700">生成する</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}