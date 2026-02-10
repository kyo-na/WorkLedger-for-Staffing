'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Printer, Trash2, X, FileText, CheckCircle2, AlertCircle, Building2, Calendar, DollarSign, Send, Clock } from 'lucide-react';

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
      // ダミーデータ（APIの代わり）
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dummyInvoices = [
        { id: 1001, status: 'sent', issueDate: '2023-11-25', dueDate: '2023-12-31', totalAmount: 1500000, client: { companyName: '株式会社ダミー1' } },
        { id: 1002, status: 'paid', issueDate: '2023-10-31', dueDate: '2023-11-30', totalAmount: 800000, client: { companyName: 'ダミー2商事' } },
        { id: 1003, status: 'overdue', issueDate: '2023-10-01', dueDate: '2023-10-31', totalAmount: 1200000, client: { companyName: '株式会社ダミー1' } },
        { id: 1004, status: 'draft', issueDate: '2023-12-01', dueDate: '2024-01-31', totalAmount: 0, client: { companyName: 'ダミー2商事' } },
      ];
      const dummyClients = [
        { id: '1', companyName: '株式会社ダミー1' },
        { id: '2', companyName: 'ダミー2商事' },
      ];

      setInvoices(dummyInvoices);
      setClients(dummyClients);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleGenerate = async () => {
    if (!generateForm.clientId) return alert('取引先を選択してください');
    
    // APIコール（シミュレーション）
    console.log('Generating invoice for:', generateForm);
    
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当にこの請求書を削除しますか？')) return;
    // APIコール（シミュレーション）
    console.log('Deleting invoice:', id);
    fetchData();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide flex items-center gap-1"><CheckCircle2 size={12}/> PAID</span>;
      case 'sent': return <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide flex items-center gap-1"><Send size={12}/> SENT</span>;
      case 'overdue': return <span className="bg-red-50 text-red-600 border border-red-100 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide flex items-center gap-1"><AlertCircle size={12}/> OVERDUE</span>;
      default: return <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide flex items-center gap-1"><Clock size={12}/> DRAFT</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 animate-in fade-in pb-24 relative min-h-screen font-sans text-slate-800 bg-slate-50/50">
        
        {/* 背景装飾 */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        {/* --- Sticky Billing Command Bar --- */}
        <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] px-6 py-4 mx-4 md:mx-auto max-w-7xl transition-all ring-1 ring-slate-900/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                <FileText size={24} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  請求書管理システム
                </h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Billing & Revenue Management</p>
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-widest whitespace-nowrap active:scale-95"
            >
              <Plus size={18} strokeWidth={3}/> 自動請求書作成
            </button>
          </div>
        </div>

        {/* --- Invoices Grid --- */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 gap-4 relative z-10 px-4 md:px-0 mt-4">
          {invoices.length > 0 ? (
            invoices.map((inv) => (
              <div 
                key={inv.id} 
                className="group relative bg-white rounded-[24px] p-1 shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 ring-1 ring-transparent hover:ring-indigo-100"
              >
                <div className="bg-white rounded-[20px] p-6 flex flex-col md:flex-row items-center gap-6 relative z-10">
                  
                  {/* ID & Type Identifier */}
                  <div className="flex items-center gap-5 w-full md:w-[35%]">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors shrink-0">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider group-hover:text-indigo-400">INV</span>
                      <span className="text-xl font-black text-slate-700 group-hover:text-indigo-700 tabular-nums">#{inv.id}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(inv.status)}
                      </div>
                      <h3 className="text-lg font-black text-slate-800 truncate group-hover:text-indigo-700 transition-colors leading-tight">
                        {inv.client?.companyName || 'Unknown Client'}
                      </h3>
                    </div>
                  </div>

                  {/* Dates & Meta */}
                  <div className="flex-1 w-full md:w-auto grid grid-cols-2 gap-4 border-l border-r border-slate-100 px-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">発行日 (Issued)</p>
                      <div className="flex items-center gap-2 font-bold text-slate-600 text-sm">
                        <Calendar size={14} className="text-slate-400"/>
                        {new Date(inv.issueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">支払期限 (Due)</p>
                      <div className={`flex items-center gap-2 font-bold text-sm ${inv.status === 'overdue' ? 'text-red-500' : 'text-slate-600'}`}>
                        <AlertCircle size={14} className={inv.status === 'overdue' ? 'text-red-400' : 'text-slate-400'}/>
                        {new Date(inv.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex items-center justify-between gap-6 w-full md:w-auto pl-2">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">請求金額 (Total)</p>
                      <p className="text-2xl font-black text-slate-900 tabular-nums tracking-tight">
                        ¥{Number(inv.totalAmount || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        className="p-3 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100 hover:border-indigo-100 group/btn"
                        title="Print Preview"
                      >
                        <Printer size={20} className="group-hover/btn:scale-110 transition-transform"/>
                      </button>
                      <button 
                        onClick={() => handleDelete(inv.id)} 
                        className="p-3 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95"
                        title="Delete Invoice"
                      >
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-300 rounded-[32px] bg-slate-50/50 text-slate-400">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-slate-100">
                <FileText size={32} className="text-slate-300"/>
              </div>
              <p className="font-bold text-lg text-slate-600">No Invoices Found</p>
              <p className="text-sm opacity-70 mt-1">Create a new invoice to get started.</p>
            </div>
          )}
        </div>

        {/* --- Creation Modal --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white p-0 rounded-[32px] w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 relative overflow-hidden">
              
              {/* Modal Header */}
              <div className="bg-slate-900 p-8 flex justify-between items-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none"><FileText size={120} /></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl shadow-lg backdrop-blur-sm"><DollarSign size={24} className="text-indigo-200"/></div>
                    <div>
                        <span className="block text-[10px] font-bold text-indigo-300 uppercase tracking-widest">New Invoice</span>
                        <span className="block font-black text-xl tracking-tight">新規請求書作成</span>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors relative z-10"><X size={20}/></button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2">
                    <Building2 size={12}/> 取引先 (Client)
                  </label>
                  <div className="relative">
                    <select 
                      value={generateForm.clientId} 
                      onChange={e => setGenerateForm({...generateForm, clientId: e.target.value})}
                      className="w-full pl-4 pr-10 py-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">選択してください...</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-t-[6px] border-t-slate-400 border-x-[5px] border-x-transparent"></div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 rounded-xl text-[10px] font-bold text-indigo-600 border border-indigo-100/50">
                    <CheckCircle2 size={12}/>
                    <span>対象月の勤怠・経費データを自動集計します</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-2">
                    <Calendar size={12}/> 対象月 (Target Month)
                  </label>
                  <input 
                    type="month" 
                    value={generateForm.month}
                    onChange={e => setGenerateForm({...generateForm, month: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-slate-600 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-4 rounded-xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs border border-transparent hover:border-slate-200"
                  >
                    キャンセル
                  </button>
                  <button 
                    onClick={handleGenerate} 
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95"
                  >
                    作成・集計実行
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