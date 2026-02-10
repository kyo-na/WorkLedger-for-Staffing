'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Plus, Search, CheckCircle, XCircle, Trash2, Receipt, 
  Calendar, DollarSign, User, Briefcase, Wallet, 
  Filter, CreditCard, ArrowRight, X
} from 'lucide-react';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [projectList, setProjectList] = useState<any[]>([]);
  
  // フィルター
  const [filterStaffId, setFilterStaffId] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  
  // モーダル
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    staffId: '',
    projectId: '',
    date: new Date().toISOString().slice(0, 10),
    category: 'transport',
    amount: '',
    description: ''
  });

  // データ取得
  const fetchData = async () => {
    try {
      // ダミーデータ（APIの代わり）
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dummyExpenses = [
        { id: 1, staff: { name: '山田 太郎' }, project: { name: '次世代ECプラットフォーム構築' }, date: '2023-11-15', category: 'transport', amount: 1500, description: 'クライアント訪問（ダミー3）往復', status: 'pending' },
        { id: 2, staff: { name: '鈴木 一郎' }, project: { name: 'AIチャットボット導入' }, date: '2023-11-12', category: 'supplies', amount: 5000, description: '検証用参考書籍購入', status: 'approved' },
        { id: 3, staff: { name: '佐藤 花子' }, project: null, date: '2023-11-10', category: 'lodging', amount: 12000, description: '大阪出張宿泊費', status: 'rejected' },
      ];
      const dummyStaff = [{ id: '1', name: '山田 太郎' }, { id: '2', name: '鈴木 一郎' }, { id: '3', name: '佐藤 花子' }];
      const dummyProjects = [{ id: '1', name: '次世代ECプラットフォーム構築' }, { id: '2', name: 'AIチャットボット導入' }];

      setExpenses(dummyExpenses);
      setStaffList(dummyStaff);
      setProjectList(dummyProjects);

    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, [filterStaffId, filterMonth]);

  // 新規申請
  const handleSubmit = async () => {
    if (!formData.staffId || !formData.amount || !formData.date) {
      alert('スタッフ、日付、金額は必須です');
      return;
    }
    // APIコール（シミュレーション）
    console.log('Submitting:', formData);
    setIsModalOpen(false);
    setFormData({ ...formData, amount: '', description: '' });
    fetchData();
  };

  // ステータス更新
  const handleStatus = async (id: number, status: string) => {
    // APIコール（シミュレーション）
    console.log('Update status:', id, status);
    fetchData();
  };

  // 削除
  const handleDelete = async (id: number) => {
    if (!confirm('この経費申請を削除しますか？')) return;
    // APIコール（シミュレーション）
    console.log('Delete:', id);
    fetchData();
  };

  // 合計金額
  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 animate-in fade-in pb-24 relative min-h-screen font-sans text-slate-800 bg-slate-50/50">
        
        {/* 背景装飾 */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        {/* --- Sticky Financial Command Bar --- */}
        <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] px-6 py-4 mx-4 md:mx-auto max-w-7xl transition-all ring-1 ring-slate-900/5">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
            
            {/* Title & Total */}
            <div className="flex items-center gap-6 w-full xl:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                  <Wallet size={24} className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                    経費管理レッジャー
                  </h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Financial Control</p>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-200 hidden sm:block opacity-50"></div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Total</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 tabular-nums tracking-tight">
                    ¥{totalAmount.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400">JPY</span>
                </div>
              </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto pb-1 xl:pb-0 justify-end">
              <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                  <input 
                    type="month" 
                    value={filterMonth} 
                    onChange={e => setFilterMonth(e.target.value)} 
                    className="pl-9 pr-3 py-2 bg-transparent font-bold text-sm text-slate-600 outline-none w-36 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors" 
                  />
                </div>
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                  <select 
                    value={filterStaffId} 
                    onChange={e => setFilterStaffId(e.target.value)} 
                    className="pl-9 pr-8 py-2 bg-transparent font-bold text-sm text-slate-600 outline-none cursor-pointer appearance-none min-w-[140px] hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <option value="">全スタッフ表示</option>
                    {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12}/>
                </div>
              </div>

              <button 
                onClick={fetchData} 
                className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-95"
              >
                <Search size={18}/>
              </button>

              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-widest whitespace-nowrap active:scale-95"
              >
                <Plus size={16} strokeWidth={3} /> 新規申請
              </button>
            </div>
          </div>
        </div>

        {/* --- Expense List Grid --- */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 gap-4 relative z-10 px-4 md:px-0 mt-4">
          {expenses.map(exp => (
            <div 
              key={exp.id} 
              className="group relative bg-white rounded-[24px] p-1 shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 ring-1 ring-transparent hover:ring-indigo-100"
            >
              <div className="bg-white rounded-[20px] p-5 flex flex-col md:flex-row items-center gap-6 h-full relative z-10">
                
                {/* Status Indicator */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 transition-colors duration-300 shadow-sm
                  ${exp.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                    exp.status === 'rejected' ? 'bg-rose-50 text-rose-500 border border-rose-100' : 
                    'bg-amber-50 text-amber-500 border border-amber-100'}`}>
                  {exp.status === 'approved' ? <CheckCircle size={24} /> : 
                   exp.status === 'rejected' ? <XCircle size={24} /> : 
                   <Receipt size={24} />}
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0 w-full text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1.5">
                    <span className="font-black text-slate-800 text-lg leading-tight">{exp.staff.name}</span>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded border border-slate-200 uppercase tracking-wide">
                        {exp.category}
                      </span>
                      {exp.project && (
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded flex items-center gap-1 border border-indigo-100 truncate max-w-[200px]">
                          <Briefcase size={10} /> {exp.project.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar size={12}/> {new Date(exp.date).toLocaleDateString()}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-slate-600 truncate font-medium">{exp.description}</span>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                  <div className="text-right">
                    <span className="block text-2xl font-black text-slate-900 tabular-nums tracking-tight">
                      ¥{Number(exp.amount).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {exp.status === 'pending' ? (
                      <>
                        <button 
                          onClick={() => handleStatus(exp.id, 'approved')} 
                          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <CheckCircle size={14}/> Approve
                        </button>
                        <button 
                          onClick={() => handleStatus(exp.id, 'rejected')} 
                          className="px-4 py-2.5 bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <XCircle size={14}/> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                        exp.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'
                      }`}>
                        {exp.status.toUpperCase()}
                      </span>
                    )}
                    
                    <button 
                      onClick={() => handleDelete(exp.id)} 
                      className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {expenses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50 text-slate-400">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100">
                <Receipt size={32} className="text-slate-300"/>
              </div>
              <p className="font-bold text-lg text-slate-500">No expenses found</p>
              <p className="text-sm opacity-70 mt-1">Adjust filters or create a new request.</p>
            </div>
          )}
        </div>

        {/* --- Application Modal --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white p-0 rounded-[32px] w-full max-w-lg shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300 relative overflow-hidden">
              
              <div className="bg-slate-900 p-8 flex justify-between items-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none"><Wallet size={120} /></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl shadow-lg backdrop-blur-sm"><CreditCard size={24} className="text-indigo-200"/></div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">New Expense</h3>
                    <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-0.5">Submit for Approval</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors relative z-10"><X size={20}/></button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Staff</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16}/>
                      <select value={formData.staffId} onChange={e => setFormData({...formData, staffId: e.target.value})} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer">
                        <option value="">Select Staff...</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Date</label>
                    <div className="relative group">
                      <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all"/>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Project (Optional)</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16}/>
                    <select value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer">
                      <option value="">General Expense (No Project)</option>
                      {projectList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer">
                      <option value="transport">交通費</option>
                      <option value="lodging">宿泊費</option>
                      <option value="supplies">消耗品</option>
                      <option value="other">その他</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Amount</label>
                    <div className="relative group">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={16}/>
                      <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-700 outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all" placeholder="0"/>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Description</label>
                  <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300" placeholder="用途、訪問先などを入力..."/>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs border border-transparent hover:border-slate-200">Cancel</button>
                  <button onClick={handleSubmit} className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black shadow-xl shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95">
                    Submit Request <ArrowRight size={14}/>
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