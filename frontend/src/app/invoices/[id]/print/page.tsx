'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function InvoicePrintPage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    // 1. データ取得
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/invoices/${params.id}`);
        if (res.ok) {
          setInvoice(await res.json());
          // 2. データ取得後に少し待ってから自動で印刷ダイアログを開く
          setTimeout(() => {
            window.print();
          }, 500);
        }
      } catch (e) { console.error(e); }
    };
    if (params.id) fetchData();
  }, [params.id]);

  if (!invoice) return <div className="p-10 text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-serif p-8 md:p-16 max-w-[210mm] mx-auto">
      
      {/* 印刷用スタイル: 画面上では影をつけるが、印刷時は消す */}
      <style jsx global>{`
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none; }
        }
      `}</style>

      {/* ヘッダー */}
      <div className="flex justify-between items-end border-b-2 border-slate-800 pb-4 mb-8">
        <h1 className="text-3xl font-bold tracking-widest">御請求書</h1>
        <div className="text-right text-sm">
          <p>請求書番号: <span className="font-bold">{String(invoice.id).padStart(6, '0')}</span></p>
          <p>発行日: {new Date(invoice.issueDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* 宛名と自社情報 */}
      <div className="flex justify-between items-start mb-12">
        <div className="w-1/2">
          <h2 className="text-xl font-bold border-b border-slate-400 pb-2 mb-2 inline-block min-w-[300px]">
            {invoice.client.companyName} 御中
          </h2>
          <p className="text-sm mt-2">件名: {invoice.subject}</p>
        </div>

        <div className="w-1/3 text-sm bg-slate-50 p-4 rounded-lg print:bg-transparent">
          <p className="font-bold text-lg mb-1">株式会社HR NEXUS</p>
          <p>〒100-0001</p>
          <p>東京都千代田区千代田1-1-1</p>
          <p>TEL: 03-1234-5678</p>
          <p>担当: 管理者 太郎</p>
          {/* ハンコ画像などを置くならここ */}
          <div className="absolute right-16 top-40 w-16 h-16 border-2 border-red-500 rounded-full text-red-500 text-[10px] flex items-center justify-center font-bold opacity-50 rotate-12 print:opacity-100">
            社印
          </div>
        </div>
      </div>

      {/* 合計金額 */}
      <div className="mb-8 border-b-2 border-slate-800 pb-2">
        <div className="flex justify-between items-end">
          <span className="font-bold text-sm">御請求金額 (税込)</span>
          <span className="text-3xl font-bold">¥{invoice.totalAmount.toLocaleString()} -</span>
        </div>
        <div className="text-right text-xs mt-1">
          (税抜金額: ¥{invoice.subtotal.toLocaleString()} / 消費税: ¥{invoice.tax.toLocaleString()})
        </div>
      </div>

      {/* 明細テーブル */}
      <table className="w-full mb-12 border-collapse">
        <thead>
          <tr className="bg-slate-100 print:bg-slate-100 border-b border-slate-300">
            <th className="p-2 text-left text-sm font-bold w-1/2">摘要</th>
            <th className="p-2 text-center text-sm font-bold">数量</th>
            <th className="p-2 text-right text-sm font-bold">単価</th>
            <th className="p-2 text-right text-sm font-bold">金額</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item: any) => (
            <tr key={item.id} className="border-b border-slate-200">
              <td className="p-3 text-sm">{item.description}</td>
              <td className="p-3 text-center text-sm">{Number(item.quantity)}</td>
              <td className="p-3 text-right text-sm">¥{item.unitPrice.toLocaleString()}</td>
              <td className="p-3 text-right text-sm font-bold">¥{item.amount.toLocaleString()}</td>
            </tr>
          ))}
          {/* 空行埋め (レイアウト調整用) */}
          {Array.from({ length: Math.max(0, 5 - invoice.items.length) }).map((_, i) => (
            <tr key={`empty-${i}`} className="border-b border-slate-100 h-10">
              <td></td><td></td><td></td><td></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 振込先・備考 */}
      <div className="flex justify-between gap-8">
        <div className="flex-1 border border-slate-300 p-4 rounded text-sm">
          <h3 className="font-bold mb-2 border-b border-slate-200 pb-1">備考</h3>
          <p className="whitespace-pre-wrap text-slate-600">{invoice.note || '特になし'}</p>
        </div>

        <div className="flex-1 border border-slate-300 p-4 rounded text-sm">
          <h3 className="font-bold mb-2 border-b border-slate-200 pb-1">お振込先</h3>
          <div className="space-y-1">
            <p>楽天銀行 (0036)</p>
            <p>第一営業支店 (201)</p>
            <p>普通 1234567</p>
            <p>カ）エイチアールネクサス</p>
          </div>
          <p className="text-xs text-slate-500 mt-2">※ 振込手数料は貴社にてご負担願います。</p>
          <p className="font-bold mt-2">お支払期限: {new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

    </div>
  );
}