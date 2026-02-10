'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// ↓ Calendar, CheckSquare を追加しました
import { Loader2, Printer, FileCheck, ShieldCheck, ArrowLeft, Download, Building, MapPin, CalendarDays, Briefcase, Clock, CircleDollarSign, CheckSquare, AlertCircle, ScrollText, Calendar } from 'lucide-react';

export default function LaborNoticePrintPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    // APIからデータを取得する代わりにダミーデータを設定
    const fetchDummyData = async () => {
      // 実際には fetch(`http://localhost:3000/assignments/${params.id}`) のような処理が入る
      await new Promise(resolve => setTimeout(resolve, 800)); // ローディング演出
      
      setData({
        id: 101,
        staff: { name: '山田 太郎' },
        project: { 
          name: '次世代ECプラットフォーム構築', 
          client: { 
            companyName: '株式会社ダミー1', 
            address: 'ダミー3'
          } 
        },
        startDate: '2023-11-01',
        endDate: '2024-03-31',
        chargeRate: 3500, // 時給換算
      });
      
      // データ描画後にプリントダイアログを開く
      setTimeout(() => {
        setIsPrinting(true);
        window.print();
        setIsPrinting(false);
      }, 800);
    };
    
    if (params.id) fetchDummyData();
  }, [params.id]);

  // ローディング画面（インテリジェンス・ボード風）
  if (!data) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 font-sans">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
        <div className="w-20 h-20 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin relative z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <FileCheck size={24} className="text-indigo-600 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-slate-800 font-black text-base tracking-widest animate-pulse">GENERATING DOCUMENT</p>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Secure Protocol Active</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center py-12 relative overflow-hidden print:bg-white print:p-0 print:h-auto print:overflow-visible font-sans text-slate-800">
      
      {/* --- Screen-Only: Intelligence Board Backdrop --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] print:hidden" 
           style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* --- Screen-Only: Header & Actions --- */}
      <div className="fixed top-0 left-0 right-0 z-40 px-8 py-4 flex justify-between items-start pointer-events-none print:hidden">
        <div className="flex flex-col gap-1 pointer-events-auto">
           <button onClick={() => window.history.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200">
             <ArrowLeft size={16}/> Back
           </button>
        </div>
        
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
           <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2">
             <ShieldCheck size={12} className="text-emerald-400"/>
             Confidential Document
           </div>
        </div>
      </div>

      {/* --- Screen-Only: Floating Print Action --- */}
      <div className="fixed bottom-8 right-8 z-50 print:hidden animate-in slide-in-from-bottom-4 flex gap-3">
        <button 
          onClick={() => window.print()}
          className="bg-slate-900 text-white pl-6 pr-8 py-4 rounded-full font-bold shadow-[0_20px_50px_-12px_rgba(15,23,42,0.5)] hover:bg-indigo-600 hover:scale-105 hover:shadow-indigo-500/30 transition-all flex items-center gap-3 group active:scale-95"
        >
          <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
            <Printer size={20} />
          </div>
          <span className="tracking-wide text-sm">Print Document</span>
        </button>
      </div>

      {/* --- A4 Paper Container --- */}
      <div className="bg-white text-black font-serif w-[210mm] min-h-[297mm] p-[25mm] shadow-2xl mx-auto relative z-10 print:shadow-none print:w-full print:h-full print:mx-0 print:p-0 print:m-0 print:block">
        
        {/* Document Header */}
        <header className="mb-12 text-center relative border-b-2 border-black pb-6">
          <div className="absolute top-0 left-0">
             <p className="text-[10px] font-sans text-slate-500 border border-slate-300 px-2 py-0.5 inline-block print:text-black print:border-black">社外秘</p>
          </div>
          <h1 className="text-3xl font-bold tracking-widest text-black mt-4">労働条件通知書<span className="text-lg font-medium ml-4">兼 就業条件明示書</span></h1>
          <div className="absolute bottom-2 right-0 text-[10px] text-right font-sans text-slate-600 leading-tight print:text-black">
            <p>発行日: {new Date().toLocaleDateString('ja-JP')}</p>
            <p className="font-mono">Doc ID: {String(data.id).padStart(12, '0')}</p>
          </div>
        </header>

        {/* Recipient */}
        <section className="mb-10">
          <div className="flex justify-between items-end border-b border-dotted border-gray-400 pb-2">
            <h2 className="text-xl font-bold font-sans">{data.staff.name} <span className="text-base font-normal ml-2">殿</span></h2>
          </div>
          <p className="text-sm mt-4 leading-relaxed text-justify">
            労働基準法第15条及び労働者派遣法第26条に基づき、貴殿の労働条件及び就業条件を以下の通り明示致します。内容をご確認の上、ご署名をお願い致します。
          </p>
        </section>

        {/* 1. Employer Info */}
        <section className="mb-8">
          <h3 className="text-sm font-bold mb-2 bg-gray-100 px-2 py-1 border-l-4 border-black print:bg-gray-100 font-sans">1. 雇用主 (派遣元)</h3>
          <div className="border border-black p-4 text-sm font-sans">
            <div className="grid grid-cols-[80px_1fr] gap-y-2">
              <span className="font-bold text-gray-600 print:text-black">名称</span>
              <span>株式会社ダミー2</span>
              
              <span className="font-bold text-gray-600 print:text-black">代表者</span>
              <span>代表取締役  管理者 太郎</span>
              
              <span className="font-bold text-gray-600 print:text-black">所在地</span>
              <span>〒100-0001 東京都千代田区千代田1-1-1 Nexus Tower 24F</span>
              
              <span className="font-bold text-gray-600 print:text-black">連絡先</span>
              <span>03-1234-5678 (管理部)</span>
            </div>
          </div>
        </section>

        {/* 2. Working Conditions Table */}
        <section className="mb-10">
          <h3 className="text-sm font-bold mb-2 bg-gray-100 px-2 py-1 border-l-4 border-black print:bg-gray-100 font-sans">2. 労働条件・就業条件詳細</h3>
          <table className="w-full border-collapse border border-black text-sm font-sans">
            <tbody>
              <tr className="break-inside-avoid">
                <th className="border border-black bg-gray-50 print:bg-gray-100 p-2.5 text-left w-[30%] font-bold align-middle text-gray-800 print:text-black flex items-center gap-2">
                   <CalendarDays size={16} className="print:hidden" /> 契約期間
                </th>
                <td className="border border-black p-2.5 font-medium">
                  {new Date(data.startDate).toLocaleDateString('ja-JP')} 〜 {new Date(data.endDate).toLocaleDateString('ja-JP')}
                  <br/><span className="text-[10px]">(更新の有無: 業務量・勤務成績により判断する)</span>
                </td>
              </tr>
              <tr className="break-inside-avoid">
                <th className="border border-black bg-gray-50 print:bg-gray-100 p-2.5 text-left font-bold align-middle text-gray-800 print:text-black flex items-center gap-2">
                   <MapPin size={16} className="print:hidden" /> 就業場所 (派遣先)
                </th>
                <td className="border border-black p-2.5">
                  <div className="font-bold text-base mb-1">{data.project.client.companyName}</div>
                  <div className="text-xs">{data.project.client.address}</div>
                </td>
              </tr>
              <tr className="break-inside-avoid">
                <th className="border border-black bg-gray-50 print:bg-gray-100 p-2.5 text-left font-bold align-middle text-gray-800 print:text-black flex items-center gap-2">
                   <Briefcase size={16} className="print:hidden" /> 従事すべき業務の内容
                </th>
                <td className="border border-black p-2.5">
                  <span className="font-bold">{data.project.name}</span>
                  <div className="text-xs mt-1 text-gray-600 print:text-black">※システムエンジニアリング、技術支援及び付帯業務</div>
                </td>
              </tr>
              <tr className="break-inside-avoid">
                <th className="border border-black bg-gray-50 print:bg-gray-100 p-2.5 text-left font-bold align-middle text-gray-800 print:text-black flex items-center gap-2">
                   <Clock size={16} className="print:hidden" /> 就業時間・休憩
                </th>
                <td className="border border-black p-2.5">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <span>始業時刻: <span className="font-mono">09:00</span></span>
                    <span>終業時刻: <span className="font-mono">18:00</span></span>
                    <span className="col-span-2">休憩時間: <span className="font-mono">12:00〜13:00</span> (60分)</span>
                    <span className="col-span-2 text-xs">※業務の都合により時間の変更・残業を命じることがある</span>
                  </div>
                </td>
              </tr>
              <tr className="break-inside-avoid">
                <th className="border border-black bg-gray-50 print:bg-gray-100 p-2.5 text-left font-bold align-middle text-gray-800 print:text-black flex items-center gap-2">
                   <Calendar size={16} className="print:hidden" /> 休日・休暇
                </th>
                <td className="border border-black p-2.5">
                  土曜日、日曜日、国民の祝日、年末年始<br/>
                  <span className="text-xs">その他派遣先カレンダーまたは会社が定める日 (年間休日120日以上)</span>
                </td>
              </tr>
              <tr className="break-inside-avoid">
                <th className="border border-black bg-gray-50 print:bg-gray-100 p-2.5 text-left font-bold align-middle text-gray-800 print:text-black flex items-center gap-2">
                   <CircleDollarSign size={16} className="print:hidden" /> 賃金 (給与)
                </th>
                <td className="border border-black p-2.5">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-bold">基本時給:</span>
                    <span className="font-mono font-bold text-lg">¥{Number(data.chargeRate).toLocaleString()}</span>
                  </div>
                  <div className="text-xs border-t border-dotted border-gray-400 pt-1 text-gray-600 print:text-black">
                    ・割増賃金: 法定超(25%)、休日(35%)、深夜(25%)<br/>
                    ・賃金締切日: 毎月末日 / 支払日: 翌月25日 (銀行振込)
                  </div>
                </td>
              </tr>
              <tr className="break-inside-avoid">
                <th className="border border-black bg-gray-50 print:bg-gray-100 p-2.5 text-left font-bold align-middle text-gray-800 print:text-black flex items-center gap-2">
                   <ShieldCheck size={16} className="print:hidden" /> 加入保険
                </th>
                <td className="border border-black p-2.5">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-1"><CheckSquare size={14} className="text-black"/> 健康保険</label>
                    <label className="flex items-center gap-1"><CheckSquare size={14} className="text-black"/> 厚生年金</label>
                    <label className="flex items-center gap-1"><CheckSquare size={14} className="text-black"/> 雇用保険</label>
                    <label className="flex items-center gap-1"><CheckSquare size={14} className="text-black"/> 労災保険</label>
                  </div>
                </td>
              </tr>
              <tr className="break-inside-avoid">
                <th className="border border-black bg-gray-50 print:bg-gray-100 p-2.5 text-left font-bold align-middle text-gray-800 print:text-black flex items-center gap-2">
                   <AlertCircle size={16} className="print:hidden" /> 派遣法に基づく通知
                </th>
                <td className="border border-black p-2.5">
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                    <span className="font-bold text-xs bg-gray-100 px-1 border border-gray-300 print:border-black">抵触日</span>
                    <span>事業所抵触日: 2029年3月31日</span>
                    <span className="font-bold text-xs bg-gray-100 px-1 border border-gray-300 print:border-black">苦情処理</span>
                    <span>申出先: 弊社管理部 (03-1234-5678)</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Signature Area */}
        <section className="mt-auto pt-8 border-t-2 border-black break-inside-avoid">
          <p className="text-sm mb-12 font-bold text-justify">
            上記労働条件及び就業条件を確認し、内容について同意・承諾致しました。<br/>
            <span className="text-xs font-normal">※ 本書は2通作成し、甲乙それぞれが保有するものとする。</span>
          </p>
          
          <div className="flex justify-end pr-8">
            <div className="w-[300px]">
              <div className="flex justify-between items-end border-b border-black pb-1 mb-10">
                <span className="font-bold text-sm">署名日</span>
                <span className="text-sm">　　　年　　　月　　　日</span>
              </div>
              <div className="flex justify-between items-end border-b border-black pb-1">
                <span className="font-bold text-sm">氏名</span>
                <span className="text-xs text-right mb-1 text-gray-500 print:text-black">(自署) ________________________ 印</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="absolute bottom-[10mm] left-0 right-0 text-center">
          <p className="text-[9px] text-slate-400 print:text-black font-sans">
            株式会社HR NEXUS | 労働者派遣事業許可番号: 派13-000000 | Human Resources Intelligence System
          </p>
        </footer>

      </div>
    </div>
  );
}