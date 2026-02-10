'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Calculator, Printer, Trash2, User, ArrowRight, 
  Wallet, Calendar, TrendingUp, CheckCircle, AlertCircle, Loader2 
} from 'lucide-react';

export default function PayrollsPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [isCalculating, setIsCalculating] = useState(false);

  const fetchData = async () => {
    try {
      // ダミーデータ（APIの代わり）
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dummyPayrolls = [
        {
          id: 1,
          staff: { id: 101, name: '山田 太郎' },
          baseAmount: 300000,
          transportation: 15000,
          overtimeAmount: 45000,
          totalPayment: 360000,
          tax: 12000,
          socialInsurance: 48000,
          totalDeduction: 60000,
          netAmount: 300000
        },
        {
          id: 2,
          staff: { id: 102, name: '鈴木 一郎' },
          baseAmount: 450000,
          transportation: 10000,
          overtimeAmount: 0,
          totalPayment: 460000,
          tax: 25000,
          socialInsurance: 65000,
          totalDeduction: 90000,
          netAmount: 370000
        }
      ];
      setPayrolls(dummyPayrolls);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, [year, month]);

  // 給与計算実行
  const handleCalculate = async () => {
    if (!confirm(`${year}年${month}月分の給与計算を実行しますか？\n(既存の計算結果は上書きされます)`)) return;
    
    setIsCalculating(true);
    try {
      // APIコール（シミュレーション）
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Calculating payroll for:', year, month);
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
    // APIコール（シミュレーション）
    console.log('Deleting payroll:', id);
    fetchData();
  };

  // 合計支給額
  const totalPayout = payrolls.reduce((sum, p) => sum + p.netAmount, 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 animate-in fade-in pb-20 relative min-h-screen font-sans text-slate-800 bg-slate-50/50">
        
        {/* 背景装飾 */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        {/* --- Financial Command Header (Sticky) --- */}
        <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] px-6 py-4 mx-4 md:mx-auto max-w-7xl transition-all ring-1 ring-slate-900/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                  <Wallet size={24} className="text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                    給与計算マネージャー
                  </h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Salary Computation Engine</p>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-200 hidden md:block opacity-50"></div>

              {/* Date Selector */}
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <div className="relative group px-2">
                  <input 
                    type="number" 
                    value={year} 
                    onChange={e => setYear(Number(e.target.value))} 
                    className="w-16 bg-transparent font-black text-center text-slate-700 outline-none focus:text-indigo-600 transition-colors"
                  />
                  <span className="text-[10px] font-bold text-slate-400 absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-1">YEAR</span>
                </div>
                <div className="text-slate-300 font-light text-xl pb-1">/</div>
                <div className="relative group px-2">
                  <select 
                    value={month} 
                    onChange={e => setMonth(Number(e.target.value))} 
                    className="bg-transparent font-black text-slate-700 outline-none cursor-pointer appearance-none pr-4 focus:text-indigo-600 transition-colors text-center min-w-[3rem]"
                  >
                    {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                    ))}
                  </select>
                  <span className="text-[10px] font-bold text-slate-400 absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-1">MONTH</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCalculate} 
              disabled={isCalculating}
              className="w-full md:w-auto bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-400 text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-widest group active:scale-95"
            >
              {isCalculating ? <Loader2 size={18} className="animate-spin"/> : <Calculator size={18} className="group-hover:scale-110 transition-transform"/>}
              {isCalculating ? '計算中...' : '給与計算を実行'}
            </button>
          </div>
        </div>

        {/* --- Summary Card --- */}
        <div className="relative w-full max-w-7xl mx-auto z-10 px-4 md:px-0">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-8 rounded-[32px] shadow-2xl shadow-indigo-900/30 relative overflow-hidden flex flex-col md:flex-row justify-between items-end md:items-center gap-6 border border-white/10 group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/30 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <TrendingUp size={16} />
                <p className="text-xs font-bold uppercase tracking-widest">支給総額 (差引支給額)</p>
              </div>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter tabular-nums leading-none">
                ¥{totalPayout.toLocaleString()}
              </h3>
            </div>

            <div className="text-right relative z-10 flex flex-col items-end gap-2">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-sm font-bold flex items-center gap-2 shadow-sm">
                <User size={14} />
                <span>対象人数: {payrolls.length} 名</span>
              </div>
              <p className="text-[10px] opacity-70 font-bold uppercase tracking-wide mt-1">
                支払予定日: {year}年{month}月25日
              </p>
            </div>
          </div>
        </div>

        {/* --- Payroll List Grid --- */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 gap-4 relative z-10 px-4 md:px-0 mt-4">
          {payrolls.length > 0 ? (
            payrolls.map((payroll) => (
              <div 
                key={payroll.id} 
                className="group relative bg-white rounded-[32px] p-1 shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 ring-1 ring-transparent hover:ring-indigo-100"
              >
                <div className="bg-white rounded-[28px] p-6 flex flex-col lg:flex-row items-center gap-6 lg:gap-8 h-full relative z-10">
                  
                  {/* Staff Info */}
                  <div className="flex items-center gap-5 w-full lg:w-[25%]">
                    <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-bold border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors shrink-0 shadow-inner">
                      <User size={28} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-slate-900 truncate group-hover:text-indigo-700 transition-colors tracking-tight">
                        {payroll.staff.name}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-50 px-2 py-0.5 rounded-md inline-block mt-1 border border-slate-100">
                        ID: {String(payroll.staff.id).padStart(4, '0')}
                      </p>
                    </div>
                  </div>

                  {/* Breakdown Visualizer */}
                  <div className="flex-1 w-full lg:border-l lg:border-r border-slate-100 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    
                    {/* Payment (Income) */}
                    <div className="relative group/income">
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> 支給計</p>
                        <p className="text-lg font-black text-slate-700 tabular-nums">¥{payroll.totalPayment.toLocaleString()}</p>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 w-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]"></div>
                      </div>
                      <div className="mt-3 space-y-1.5 pl-2 border-l-2 border-slate-100">
                        <div className="flex justify-between text-[10px] font-medium text-slate-500">
                          <span>基本給</span>
                          <span className="tabular-nums font-bold">¥{payroll.baseAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-medium text-slate-500">
                          <span>交通費</span>
                          <span className="tabular-nums font-bold">¥{payroll.transportation.toLocaleString()}</span>
                        </div>
                        {payroll.overtimeAmount > 0 && (
                          <div className="flex justify-between text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            <span>残業代</span>
                            <span className="tabular-nums">¥{payroll.overtimeAmount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow Indicator (Desktop) */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full items-center justify-center text-slate-300 z-10 border border-slate-100 shadow-sm">
                      <ArrowRight size={14} />
                    </div>

                    {/* Deduction (Expense) */}
                    <div className="relative group/deduction">
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"></span> 控除計</p>
                        <p className="text-lg font-black text-rose-500 tabular-nums">-¥{payroll.totalDeduction.toLocaleString()}</p>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-rose-400 to-rose-500 w-[40%] rounded-full opacity-80 shadow-[0_0_10px_rgba(251,113,133,0.4)]"></div> {/* Dummy width for visual */}
                      </div>
                      <div className="mt-3 space-y-1.5 pl-2 border-l-2 border-slate-100">
                        <div className="flex justify-between text-[10px] font-medium text-slate-500">
                          <span>所得税</span>
                          <span className="tabular-nums font-bold">¥{payroll.tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-medium text-slate-500">
                          <span>社会保険</span>
                          <span className="tabular-nums font-bold">¥{payroll.socialInsurance.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Net Amount & Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-100 pt-6 lg:pt-0">
                    <div className="text-right min-w-[140px]">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">差引支給額</p>
                      <p className="text-3xl font-black text-indigo-600 tabular-nums tracking-tighter drop-shadow-sm">
                        ¥{payroll.netAmount.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => window.open(`/payrolls/${payroll.id}/print`, '_blank')}
                        className="p-3.5 bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-200 hover:border-indigo-100 group/btn shadow-sm active:scale-95"
                        title="明細書を印刷"
                      >
                        <Printer size={20} className="group-hover/btn:scale-110 transition-transform"/>
                      </button>
                      <button 
                        onClick={() => handleDelete(payroll.id)} 
                        className="p-3.5 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100 opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95"
                        title="レコードを削除"
                      >
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-300 rounded-[2.5rem] bg-slate-50/50 text-slate-400">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-slate-100">
                <Calculator size={32} className="text-slate-300"/>
              </div>
              <p className="font-bold text-lg text-slate-600">給与データがありません</p>
              <p className="text-sm opacity-70 mt-1">対象年月を選択し、計算を実行してください。</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}