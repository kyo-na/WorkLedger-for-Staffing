'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function PayrollPrintPage() {
  const params = useParams();
  const [payroll, setPayroll] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/payrolls/${params.id}`);
        if (res.ok) {
          setPayroll(await res.json());
          setTimeout(() => window.print(), 500);
        }
      } catch (e) { console.error(e); }
    };
    if (params.id) fetchData();
  }, [params.id]);

  if (!payroll) return <div className="p-10 text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-8 md:p-12 max-w-[210mm] mx-auto">
      <style jsx global>{`
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none; }
        }
      `}</style>

      {/* 明細ヘッダー */}
      <div className="border-b-2 border-slate-800 pb-4 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-widest">給与明細書</h1>
          <p className="text-sm mt-1">{payroll.year}年 {payroll.month}月分</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">{payroll.staff.name} 様</h2>
          <p className="text-xs text-slate-500">社員ID: {String(payroll.staff.id).padStart(6, '0')}</p>
        </div>
      </div>

      {/* 3カラムレイアウト: 支給・控除・合計 */}
      <div className="grid grid-cols-2 gap-0 border border-slate-800 mb-8">
        
        {/* 左: 支給 */}
        <div className="border-r border-slate-800">
          <div className="bg-slate-100 p-2 text-center font-bold border-b border-slate-800 text-sm">支給の部</div>
          <div className="p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>基本給</span><span>{payroll.baseAmount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>役職手当</span><span>0</span></div>
            <div className="flex justify-between"><span>残業手当</span><span>{payroll.overtimeAmount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>交通費</span><span>{payroll.transportation.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>その他</span><span>{payroll.allowance.toLocaleString()}</span></div>
            <div className="border-t border-slate-300 my-2 pt-2 font-bold flex justify-between">
              <span>支給合計</span><span>{payroll.totalPayment.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 右: 控除 */}
        <div>
          <div className="bg-slate-100 p-2 text-center font-bold border-b border-slate-800 text-sm">控除の部</div>
          <div className="p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>健康保険</span><span>0</span></div>
            <div className="flex justify-between"><span>厚生年金</span><span>0</span></div>
            <div className="flex justify-between"><span>雇用保険</span><span>0</span></div>
            <div className="flex justify-between"><span>所得税</span><span>{payroll.tax.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>住民税</span><span>0</span></div>
            <div className="border-t border-slate-300 my-2 pt-2 font-bold flex justify-between">
              <span>控除合計</span><span>{payroll.totalDeduction.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 差引支給額 (大きく) */}
      <div className="border border-slate-800 p-6 flex justify-between items-center bg-slate-50">
        <span className="font-bold text-lg">差引支給額 (振込金額)</span>
        <span className="text-3xl font-black">¥{payroll.netAmount.toLocaleString()}</span>
      </div>

      {/* フッター */}
      <div className="mt-12 text-sm text-slate-500">
        <p className="font-bold">株式会社HR NEXUS</p>
        <p>〒100-0001 東京都千代田区千代田1-1-1</p>
        <p>※ 本明細書に関するお問い合わせは管理部まで。</p>
      </div>

    </div>
  );
}