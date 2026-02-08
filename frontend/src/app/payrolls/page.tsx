'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Calculator, Printer, Trash2, User, ArrowRight } from 'lucide-react';

export default function PayrollsPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [isCalculating, setIsCalculating] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/payrolls?year=${year}&month=${month}`);
      if (res.ok) setPayrolls(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, [year, month]);

  // 給与計算実行
  const handleCalculate = async () => {
    if (!confirm(`${year}年${month}月分の給与計算を実行しますか？\n(既存の計算結果は上書きされます)`)) return;
    
    setIsCalculating(true);
    try {
      await fetch('http://localhost:3000/payrolls/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month })
      });
      fetchData();
    } catch (e) {
      console.error(e);
      alert('計算に失敗しました');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('削除しますか？')) return;
    await fetch(`http://localhost:3000/payrolls/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // 合計支給額
  const totalPayout = payrolls.reduce((sum, p) => sum + p.netAmount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in pb-20">
        
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">PAYROLL<span className="text-indigo-600">MANAGER</span></h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">給与計算・明細発行</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
             <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
               <input 
                 type="number" value={year} onChange={e => setYear(Number(e.target.value))} 
                 className="w-20 bg-transparent font-bold text-center outline-none"
               />
               <span className="text-slate-400 font-bold">/</span>
               <select value={month} onChange={e => setMonth(Number(e.target.value))} className="bg-transparent font-bold outline-none cursor-pointer">
                 {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                   <option key={m} value={m}>{m}月</option>
                 ))}
               </select>
             </div>

             <button 
               onClick={handleCalculate} 
               disabled={isCalculating}
               className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
             >
               <Calculator size={18} /> {isCalculating ? '計算中...' : '給与計算実行'}
             </button>
          </div>
        </div>

        {/* サマリー */}
        <div className="bg-indigo-600 text-white p-8 rounded-[2rem] shadow-lg flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div>
            <p className="text-xs font-bold opacity-70 uppercase mb-1">今月の支給総額 (振込予定額)</p>
            <h3 className="text-4xl font-black tracking-tight">¥{totalPayout.toLocaleString()}</h3>
          </div>
          <div className="text-right mt-4 md:mt-0 relative z-10">
            <p className="text-sm font-bold opacity-80">対象人数: {payrolls.length}名</p>
            <p className="text-xs opacity-50">振込日: 毎月25日</p>
          </div>
        </div>

        {/* 給与明細リスト */}
        <div className="grid grid-cols-1 gap-4">
          {payrolls.map((payroll) => (
            <div key={payroll.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group">
              
              {/* 左: スタッフ情報 */}
              <div className="flex items-center gap-6 w-full lg:w-1/4">
                <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">{payroll.staff.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Staff ID: {String(payroll.staff.id).padStart(4, '0')}</p>
                </div>
              </div>

              {/* 中央: 内訳 (支給・控除) ★ここを強化しました */}
              <div className="flex-1 w-full flex flex-col md:flex-row gap-4 md:gap-8 px-0 md:px-8 border-t md:border-t-0 md:border-l border-slate-100 py-4 md:py-0">
                
                {/* 支給 */}
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">支給合計</p>
                  <p className="text-xl font-bold text-slate-700 mb-1">¥{payroll.totalPayment.toLocaleString()}</p>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <div className="flex justify-between"><span>基本給:</span> <span>¥{payroll.baseAmount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>交通費:</span> <span>¥{payroll.transportation.toLocaleString()}</span></div>
                    {payroll.overtimeAmount > 0 && <div className="flex justify-between"><span>残業代:</span> <span>¥{payroll.overtimeAmount.toLocaleString()}</span></div>}
                  </div>
                </div>

                {/* 控除 */}
                <div className="flex-1 relative">
                   {/* 簡易的な矢印アイコン */}
                   <div className="absolute -left-5 top-1/2 -translate-y-1/2 text-slate-200 hidden md:block"><ArrowRight size={16}/></div>
                   
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">控除合計</p>
                  <p className="text-xl font-bold text-red-400 mb-1">-¥{payroll.totalDeduction.toLocaleString()}</p>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <div className="flex justify-between"><span>税金:</span> <span>¥{payroll.tax.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>保険料:</span> <span>¥{payroll.socialInsurance.toLocaleString()}</span></div>
                  </div>
                </div>

              </div>

              {/* 右: 差引支給額 & アクション */}
              <div className="flex items-center gap-8 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                <div className="text-right min-w-[120px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">差引支給額</p>
                  <p className="text-2xl font-black text-indigo-600">¥{payroll.netAmount.toLocaleString()}</p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(`/payrolls/${payroll.id}/print`, '_blank')}
                    className="p-3 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors" 
                    title="明細書印刷"
                  >
                    <Printer size={20}/>
                  </button>
                  <button onClick={() => handleDelete(payroll.id)} className="p-3 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={20}/>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {payrolls.length === 0 && (
             <div className="text-center p-12 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-[2rem]">
               給与データがありません。「給与計算実行」ボタンを押してください。
             </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}