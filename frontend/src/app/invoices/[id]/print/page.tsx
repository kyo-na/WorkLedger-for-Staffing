'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Printer, FileText } from 'lucide-react';

export default function InvoicePrintPage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    // APIからデータを取得する代わりにダミーデータを設定
    const fetchDummyData = async () => {
      // 実際には fetch(`http://localhost:3000/invoices/${params.id}`) のような処理が入る
      await new Promise(resolve => setTimeout(resolve, 800)); // ローディング演出
      
      const dummyInvoice = {
        id: 1001,
        issueDate: '2023-11-25',
        client: { companyName: '株式会社ダミー1' },
        subject: '2023年11月分 システム開発委託料',
        totalAmount: 1650000,
        subtotal: 1500000,
        tax: 150000,
        dueDate: '2023-12-31',
        note: 'いつも大変お世話になっております。\nご不明な点がございましたら、担当者までご連絡ください。',
        items: [
          { id: 1, description: '基本設計・詳細設計業務 (160h)', quantity: 1, unitPrice: 800000, amount: 800000 },
          { id: 2, description: '実装・単体テスト (140h)', quantity: 1, unitPrice: 700000, amount: 700000 },
        ]
      };
      
      setInvoice(dummyInvoice);
      
      // データ描画後にプリントダイアログを開く
      setTimeout(() => {
        setIsPrinting(true);
        window.print();
        setIsPrinting(false);
      }, 800);
    };
    
    if (params.id) fetchDummyData();
  }, [params.id]);

  if (!invoice) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FileText size={20} className="text-indigo-600" />
        </div>
      </div>
      <p className="text-slate-500 font-bold text-sm tracking-widest animate-pulse">GENERATING INVOICE...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-10 print:bg-white print:p-0 print:h-auto font-sans text-slate-900">
      
      {/* 画面表示時の背景装飾（印刷時は非表示） */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4] print:hidden" 
           style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* 印刷アクションボタン（画面表示時のみ） */}
      <div className="fixed bottom-8 right-8 z-50 print:hidden animate-in slide-in-from-bottom-4">
        <button 
          onClick={() => window.print()}
          className="bg-slate-900 text-white px-6 py-4 rounded-full font-bold shadow-2xl hover:bg-indigo-600 hover:scale-105 transition-all flex items-center gap-3"
        >
          <Printer size={20} /> Print Invoice
        </button>
      </div>

      {/* 印刷用スタイル定義 */}
      <style jsx global>{`
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; background-color: white; }
          .no-print { display: none !important; }
          /* 印刷時のシャドウ除去と余白調整 */
          .print-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
        }
      `}</style>

      {/* A4用紙コンテナ */}
      <div className="print-container bg-white text-slate-900 font-serif w-[210mm] min-h-[297mm] p-[20mm] shadow-2xl mx-auto relative z-10">
        
        {/* ヘッダーエリア */}
        <div className="flex justify-between items-end border-b-2 border-slate-900 pb-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-[0.2em] text-slate-900">御請求書</h1>
            <p className="text-[10px] font-sans text-slate-500 mt-1 uppercase tracking-widest">INVOICE STATEMENT</p>
          </div>
          <div className="text-right text-sm font-sans leading-relaxed">
            <p>No. <span className="font-bold text-lg">{String(invoice.id).padStart(6, '0')}</span></p>
            <p>発行日: {new Date(invoice.issueDate).toLocaleDateString('ja-JP')}</p>
          </div>
        </div>

        {/* 宛名と自社情報 */}
        <div className="flex justify-between items-start mb-16 gap-8">
          <div className="flex-1">
            <h2 className="text-xl font-bold border-b border-slate-400 pb-2 mb-3 inline-block min-w-[100%] leading-relaxed">
              {invoice.client.companyName} <span className="text-base ml-2">御中</span>
            </h2>
            <div className="text-sm space-y-1 pl-1">
              <p>件名: <span className="font-bold">{invoice.subject}</span></p>
              {/* 将来的に担当者名などが入る余地 */}
            </div>
          </div>

          <div className="w-[85mm] text-sm bg-slate-50/50 p-4 rounded-lg border border-slate-100 print:border-none print:bg-transparent print:p-0 relative">
            <p className="font-bold text-lg mb-1">株式会社ダミー3</p>
            <div className="text-xs leading-relaxed space-y-0.5 text-slate-700">
              <p>〒100-0001</p>
              <p>東京都千代田区千代田1-1-1 Nexus Tower 24F</p>
              <p>TEL: 03-1234-5678 / FAX: 03-1234-5679</p>
              <p>担当: 管理者 太郎</p>
              <p>登録番号: T1234567890123</p>
            </div>
            
            {/* 角印（デジタル風） */}
            <div className="absolute right-0 top-10 w-20 h-20 border-2 border-red-500 rounded-xl text-red-500 text-[10px] flex flex-col items-center justify-center font-serif font-bold opacity-70 rotate-12 print:opacity-100 mix-blend-multiply pointer-events-none">
              <span>株式会社</span>
              <span>ダミー3</span>
              <span>之印</span>
            </div>
          </div>
        </div>

        {/* 合計金額エリア */}
        <div className="mb-10 bg-slate-50 print:bg-slate-50/30 border-y-2 border-slate-800 py-4 px-6">
          <div className="flex justify-between items-end">
            <span className="font-bold text-sm text-slate-600">御請求金額 (税込)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-medium">¥</span>
              <span className="text-4xl font-bold tracking-tight">{invoice.totalAmount.toLocaleString()}</span>
              <span className="text-xl font-medium">-</span>
            </div>
          </div>
          <div className="text-right text-xs mt-1 text-slate-500 font-sans">
            (税抜価格: ¥{invoice.subtotal.toLocaleString()} / 消費税等: ¥{invoice.tax.toLocaleString()})
          </div>
        </div>

        {/* 明細テーブル */}
        <table className="w-full mb-12 border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 print:bg-slate-100 border-t border-b border-slate-400">
              <th className="p-3 text-left font-bold w-1/2">摘要</th>
              <th className="p-3 text-center font-bold">数量</th>
              <th className="p-3 text-right font-bold">単価</th>
              <th className="p-3 text-right font-bold">金額</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: any, idx: number) => (
              <tr key={item.id} className="border-b border-slate-200">
                <td className="p-3 text-slate-800">{item.description}</td>
                <td className="p-3 text-center text-slate-600">{Number(item.quantity)}</td>
                <td className="p-3 text-right text-slate-600">¥{item.unitPrice.toLocaleString()}</td>
                <td className="p-3 text-right font-bold text-slate-900">¥{item.amount.toLocaleString()}</td>
              </tr>
            ))}
            {/* 空行埋め（レイアウト調整） */}
            {Array.from({ length: Math.max(0, 6 - invoice.items.length) }).map((_, i) => (
              <tr key={`empty-${i}`} className="border-b border-slate-100 h-10 print:h-10">
                <td colSpan={4}></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* フッター情報（振込先・備考） */}
        <div className="flex flex-col md:flex-row gap-8 text-sm">
          
          {/* 備考欄 */}
          <div className="flex-1">
            <h3 className="font-bold mb-2 text-xs text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1">Note / 備考</h3>
            <div className="min-h-[100px] text-slate-700 whitespace-pre-wrap leading-relaxed">
              {invoice.note || '※ 特になし'}
            </div>
          </div>

          {/* 振込先情報 */}
          <div className="flex-1 bg-slate-50 print:bg-transparent p-4 rounded-lg border border-slate-200 print:border-slate-800/20">
            <h3 className="font-bold mb-2 text-xs text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1">Bank Account / お振込先</h3>
            <div className="space-y-1 font-medium text-slate-800">
              <div className="flex justify-between"><span>銀行名:</span> <span>楽天銀行 (0036)</span></div>
              <div className="flex justify-between"><span>支店名:</span> <span>第一営業支店 (201)</span></div>
              <div className="flex justify-between"><span>口座種別:</span> <span>普通 1234567</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-1 mt-1">
                <span>口座名義:</span> <span>カ）ダミーサン</span>
              </div>
            </div>
            
            <div className="mt-4 pt-2 border-t border-slate-300">
              <div className="flex justify-between font-bold text-slate-900">
                <span>お支払期限:</span>
                <span>{new Date(invoice.dueDate).toLocaleDateString('ja-JP')}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 text-right">※ 振込手数料は貴社にてご負担願います。</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-[10mm] left-0 right-0 text-center">
          <p className="text-[9px] text-slate-400 print:text-black font-sans">
            株式会社ダミー3 | 労働者派遣事業許可番号: 派13-000000 | Human Resources Intelligence System
          </p>
        </footer>

      </div>
    </div>
  );
}