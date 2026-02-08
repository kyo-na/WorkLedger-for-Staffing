'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Search, CheckCircle, XCircle, Trash2, Receipt, Calendar, DollarSign, User, Briefcase } from 'lucide-react';

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
    category: 'transport', // transport, lodging, supplies, other
    amount: '',
    description: ''
  });

  // データ取得
  const fetchData = async () => {
    try {
      const query = new URLSearchParams();
      if (filterStaffId) query.append('staffId', filterStaffId);
      if (filterMonth) query.append('month', filterMonth);

      const [resExpenses, resStaff, resProjects] = await Promise.all([
        fetch(`http://localhost:3000/expenses?${query}`),
        fetch('http://localhost:3000/staff'),
        fetch('http://localhost:3000/projects')
      ]);

      if (resExpenses.ok) setExpenses(await resExpenses.json());
      if (resStaff.ok) setStaffList(await resStaff.json());
      if (resProjects.ok) setProjectList(await resProjects.json());

    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, [filterStaffId, filterMonth]);

  // 新規申請
  const handleSubmit = async () => {
    if (!formData.staffId || !formData.amount || !formData.date) {
      alert('スタッフ、日付、金額は必須です');
      return;
    }
    await fetch('http://localhost:3000/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setIsModalOpen(false);
    setFormData({ ...formData, amount: '', description: '' });
    fetchData();
  };

  // ステータス更新
  const handleStatus = async (id: number, status: string) => {
    await fetch(`http://localhost:3000/expenses/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  // 削除
  const handleDelete = async (id: number) => {
    if (!confirm('削除しますか？')) return;
    await fetch(`http://localhost:3000/expenses/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // 合計金額
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in pb-20">
        
        {/* ヘッダー */}
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">EXPENSE<span className="text-indigo-600">MANAGER</span></h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">経費精算・承認</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all">
            <Plus size={18} /> 経費申請
          </button>
        </div>

        {/* フィルター & 集計 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 bg-white p-4 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-3 text-slate-400" size={16}/>
              <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="pl-10 pr-4 py-2 bg-slate-50 rounded-xl font-bold outline-none w-full" />
            </div>
            <div className="relative flex-1">
              <User className="absolute left-3 top-3 text-slate-400" size={16}/>
              <select value={filterStaffId} onChange={e => setFilterStaffId(e.target.value)} className="pl-10 pr-4 py-2 bg-slate-50 rounded-xl font-bold outline-none w-full">
                <option value="">全スタッフ</option>
                {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <button onClick={fetchData} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100"><Search size={18}/></button>
          </div>

          <div className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-lg flex flex-col justify-center">
            <p className="text-xs font-bold opacity-70 uppercase mb-1">今月の承認待ち合計</p>
            <h3 className="text-3xl font-black tracking-tight">¥{totalAmount.toLocaleString()}</h3>
          </div>
        </div>

        {/* 経費リスト */}
        <div className="space-y-3">
          {expenses.map(exp => (
            <div key={exp.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* 左側: 情報 */}
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold 
                  ${exp.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : exp.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-100 text-amber-600'}`}>
                  {exp.status === 'approved' ? <CheckCircle /> : exp.status === 'rejected' ? <XCircle /> : <Receipt />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-slate-800 text-lg">{exp.staff.name}</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{exp.category}</span>
                    {exp.project && (
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-500 px-2 py-0.5 rounded flex items-center gap-1">
                        <Briefcase size={10} /> {exp.project.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(exp.date).toLocaleDateString()}</span>
                    <span>{exp.description}</span>
                  </p>
                </div>
              </div>

              {/* 右側: 金額とアクション */}
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <span className="text-2xl font-black text-slate-800">¥{exp.amount.toLocaleString()}</span>
                
                {/* ステータス操作ボタン */}
                <div className="flex items-center gap-2">
                  {exp.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatus(exp.id, 'approved')} className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-xs hover:bg-emerald-600 shadow-md">承認</button>
                      <button onClick={() => handleStatus(exp.id, 'rejected')} className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs hover:bg-red-100">却下</button>
                    </>
                  )}
                  {exp.status !== 'pending' && (
                    <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${exp.status === 'approved' ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                      {exp.status.toUpperCase()}
                    </span>
                  )}
                  <button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg"><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          ))}

          {expenses.length === 0 && (
            <div className="text-center p-10 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-[2rem]">
              申請データはありません
            </div>
          )}
        </div>

        {/* 申請モーダル */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white p-8 rounded-[2rem] w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-black mb-6">新規経費申請</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">STAFF</label>
                    <select value={formData.staffId} onChange={e => setFormData({...formData, staffId: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none">
                      <option value="">スタッフ選択...</option>
                      {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">DATE</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none text-slate-600"/>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">PROJECT (任意)</label>
                  <select value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none">
                    <option value="">プロジェクトなし（一般経費）</option>
                    {projectList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">CATEGORY</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none">
                      <option value="交通費">交通費</option>
                      <option value="宿泊費">宿泊費</option>
                      <option value="交際費">交際費</option>
                      <option value="消耗品">消耗品</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">AMOUNT</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 text-slate-400" size={14}/>
                      <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full pl-8 p-3 bg-slate-50 rounded-xl font-bold outline-none" placeholder="0"/>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">DESCRIPTION</label>
                  <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none" placeholder="例: 新宿〜東京 往復"/>
                </div>

                <div className="flex gap-2 pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">キャンセル</button>
                  <button onClick={handleSubmit} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800">申請する</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}