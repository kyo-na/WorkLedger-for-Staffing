'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Printer, Wallet, Building2, Calendar, User } from 'lucide-react';

export default function PayrollPrintPage() {
  const params = useParams();
  const [payroll, setPayroll] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    // APIからデータを取得する代わりにダミーデータを設定
    const fetchDummyData = async () => {
      // 実際には fetch(`http://localhost:3000/payrolls/${params.id}`) のような処理が入る
      await new Promise(resolve => setTimeout(resolve, 800)); // ローディング演出
      
      const dummyPayroll = {
        year: 2023,
        month: 11,
        staff: { id: 101, name: '山田 太郎' },
        baseAmount: 300000,
        allowance: 10000, // その他手当
        transportation: 15000,
        overtimeAmount: 45000,
        totalPayment: 370000,
        tax: 12000,
        socialInsurance: 48000,
        totalDeduction: 60000,
        netAmount: 310000,
        attendance: {
            days: 20,
            paidLeave: 1,
            absence: 0,
            overtime: 10.5
        }
      };
      
      setPayroll(dummyPayroll);
      
      // データ取得後に少し待ってから自動で印刷ダイアログを開く
      setTimeout(() => {
        setIsPrinting(true);
        window.print();
        setIsPrinting(false);
      }, 800);
    };
    
    if (params.id) fetchDummyData();
  }, [params.id]);

  if (!payroll) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 font-sans">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
        <div className="w-20 h-20 border-4 border-white border-t-indigo-500 rounded-full animate-spin relative z-10 shadow-sm"></div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Wallet size={24} className="text-indigo-600 animate-pulse" />
        </div>
      </div>
      <p className="text-indigo-900/60 font-bold text-sm tracking-[0.2em] animate-pulse">GENERATING PAYSLIP...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-12 print:bg-white print:p-0 print:h-auto font-sans text-slate-800">
      
      {/* 画面表示時の背景装飾（印刷時は非表示） */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.6] print:hidden" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #e0e7ff 0%, transparent 50%), radial-gradient(circle at 100% 0%, #f0fdf4 0%, transparent 50%)' }}>
      </div>

      {/* 印刷アクションボタン（画面表示時のみ） */}
      <div className="fixed bottom-10 right-10 z-50 print:hidden animate-in slide-in-from-bottom-4">
        <button 
          onClick={() => window.print()}
          className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 hover:shadow-indigo-300 transition-all flex items-center gap-3 active:scale-95"
        >
          <Printer size={20} /> Print Payslip
        </button>
      </div>

      {/* 印刷用スタイル定義 */}
      <style jsx global>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; background-color: white; }
          .no-print { display: none !important; }
          .print-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: none !important; height: auto !important; min-height: 100vh; }
        }
      `}</style>

      {/* A4用紙コンテナ */}
      <div className="print-container bg-white text-slate-900 font-sans w-[210mm] min-h-[297mm] p-[20mm] shadow-2xl mx-auto relative z-10 print:overflow-visible">
        
        {/* ヘッダーエリア */}
        <div className="flex justify-between items-end border-b-2 border-indigo-900 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-widest text-indigo-900">給与明細書</h1>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-[0.3em]">Payslip Statement</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-2xl font-black text-slate-800">
               <span className="text-lg text-slate-400 font-bold">{payroll.year}年</span>
               <span>{String(payroll.month).padStart(2, '0')}月分</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Issue Date: {new Date().toLocaleDateString('ja-JP')}</p>
          </div>
        </div>

        {/* 社員情報 */}
        <div className="flex justify-between items-center mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100 print:border-slate-300">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm print:hidden">
                <User size={24}/>
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Employee Name</p>
               <h2 className="text-xl font-black text-slate-800">{payroll.staff.name} <span className="text-sm font-medium ml-1 text-slate-500">様</span></h2>
             </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Employee ID</p>
            <p className="text-xl font-mono font-bold text-slate-700">{String(payroll.staff.id).padStart(6, '0')}</p>
          </div>
        </div>

        {/* 明細メインエリア (Grid Layout) */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          
          {/* 支給の部 */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden print:border-slate-400">
            <div className="bg-indigo-50/50 print:bg-slate-100 p-3 text-center font-bold text-sm border-b border-indigo-100 print:border-slate-300 text-indigo-900 print:text-black">支給 (Payment)</div>
            <div className="p-6 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 border-dashed pb-2">
                  <span className="font-medium text-slate-600">基本給</span>
                  <span className="font-mono font-bold text-slate-800">{payroll.baseAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 border-dashed pb-2">
                  <span className="font-medium text-slate-600">役職手当</span>
                  <span className="font-mono font-bold text-slate-400">0</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 border-dashed pb-2">
                  <span className="font-medium text-slate-600">残業手当</span>
                  <span className="font-mono font-bold text-slate-800">{payroll.overtimeAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 border-dashed pb-2">
                  <span className="font-medium text-slate-600">通勤手当</span>
                  <span className="font-mono font-bold text-slate-800">{payroll.transportation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 border-dashed pb-2">
                  <span className="font-medium text-slate-600">その他</span>
                  <span className="font-mono font-bold text-slate-800">{payroll.allowance.toLocaleString()}</span>
              </div>
              
              <div className="pt-4 mt-2 border-t-2 border-indigo-100 print:border-slate-400 flex justify-between items-end">
                <span className="font-bold text-xs text-indigo-900 print:text-black uppercase tracking-wider">Total Payment</span>
                <span className="font-black text-xl text-indigo-600 print:text-black">¥{payroll.totalPayment.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 控除の部 */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden print:border-slate-400">
            <div className="bg-rose-50/50 print:bg-slate-100 p-3 text-center font-bold text-sm border-b border-rose-100 print:border-slate-300 text-rose-900 print:text-black">控除 (Deduction)</div>
            <div className="p-6 space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 border-dashed pb-2">
                  <span className="font-medium text-slate-600">健康保険料</span>
                  <span className="font-mono font-bold text-slate-400">0</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 border-dashed pb-2">
                  <span className="font-medium text-slate-600">厚生年金</span>
                  <span className="font-mono font-bold text-slate-400">0</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 border-dashed pb-2">
                  <span className="font-medium text-slate-600">雇用保険料</span>
                  <span className="font-mono font-bold text-slate-400">0</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 border-dashed pb-2">
                  <span className="font-medium text-slate-600">所得税</span>
                  <span className="font-mono font-bold text-slate-800">{payroll.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 border-dashed pb-2">
                  <span className="font-medium text-slate-600">住民税</span>
                  <span className="font-mono font-bold text-slate-400">0</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 border-dashed pb-2">
                  <span className="font-medium text-slate-600">社会保険</span>
                  <span className="font-mono font-bold text-slate-800">{payroll.socialInsurance.toLocaleString()}</span>
              </div>
              
              <div className="pt-4 mt-2 border-t-2 border-rose-100 print:border-slate-400 flex justify-between items-end">
                <span className="font-bold text-xs text-rose-900 print:text-black uppercase tracking-wider">Total Deduction</span>
                <span className="font-black text-xl text-rose-500 print:text-black">-¥{payroll.totalDeduction.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 勤怠情報 (簡易表示) */}
        <div className="mb-10 border border-slate-200 rounded-2xl p-5 bg-white print:border-slate-400">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Calendar size={14}/> Attendance Summary
           </h3>
           <div className="flex justify-between px-4">
             <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold mb-1">出勤日数</p>
                <p className="font-black text-lg text-slate-700">{payroll.attendance?.days || 20}<span className="text-xs font-medium ml-1 text-slate-400">日</span></p>
             </div>
             <div className="w-px h-10 bg-slate-100"></div>
             <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold mb-1">有給休暇</p>
                <p className="font-black text-lg text-slate-700">{payroll.attendance?.paidLeave || 0}<span className="text-xs font-medium ml-1 text-slate-400">日</span></p>
             </div>
             <div className="w-px h-10 bg-slate-100"></div>
             <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold mb-1">欠勤日数</p>
                <p className="font-black text-lg text-slate-700">{payroll.attendance?.absence || 0}<span className="text-xs font-medium ml-1 text-slate-400">日</span></p>
             </div>
             <div className="w-px h-10 bg-slate-100"></div>
             <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold mb-1">残業時間</p>
                <p className="font-black text-lg text-slate-700">{payroll.attendance?.overtime || 0}<span className="text-xs font-medium ml-1 text-slate-400">h</span></p>
             </div>
           </div>
        </div>

        {/* 差引支給額 */}
        <div className="border-2 border-indigo-900 bg-indigo-50/30 print:bg-white p-8 rounded-3xl flex justify-between items-center shadow-sm mb-12 print:border-slate-800">
          <div>
            <span className="block text-sm font-black text-indigo-300 print:text-slate-400 uppercase tracking-[0.2em] mb-1">Net Pay</span>
            <span className="block text-2xl font-black text-indigo-900 print:text-black">差引支給額 (振込額)</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-indigo-400 print:text-black">¥</span>
            <span className="text-6xl font-black tracking-tighter text-indigo-900 print:text-black">{payroll.netAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-auto pt-8 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-end print:border-slate-400">
          <div>
            <p className="font-black text-slate-700 text-sm mb-2 flex items-center gap-2">
                <Building2 size={14}/> 株式会社ダミー2
            </p>
            <p>〒100-0001 東京都千代田区千代田1-1-1 Nexus Tower 24F</p>
            <p>TEL: 03-1234-5678</p>
          </div>
          <p>※ 本明細書に関するお問い合わせは管理部 (admin@workledger.com) まで。</p>
        </div>

      </div>
    </div>
  );
}