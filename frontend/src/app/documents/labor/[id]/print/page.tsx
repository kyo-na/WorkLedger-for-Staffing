'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function LaborNoticePrintPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/assignments/${params.id}`);
        if (res.ok) {
          setData(await res.json());
          setTimeout(() => window.print(), 500);
        }
      } catch (e) { console.error(e); }
    };
    if (params.id) fetchData();
  }, [params.id]);

  if (!data) return <div className="p-10 text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-serif p-8 md:p-12 max-w-[210mm] mx-auto text-sm leading-relaxed">
      <style jsx global>{`
        @media print {
          @page { margin: 10mm; }
          body { -webkit-print-color-adjust: exact; }
        }
        table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
        th, td { border: 1px solid #000; padding: 6px 10px; vertical-align: top; }
        th { background-color: #f0f0f0; width: 25%; text-align: left; }
      `}</style>

      <h1 className="text-xl font-bold text-center mb-2 border-b-2 border-black pb-2">労働条件通知書 兼 就業条件明示書</h1>
      <p className="text-right text-xs mb-8">発行日: {new Date().toLocaleDateString()}</p>

      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2 underline">{data.staff.name} 様</h2>
        <p>以下の通り、労働条件及び就業条件を通知・明示致します。</p>
      </div>

      <div className="mb-8">
        <p className="mb-1 font-bold">1. 雇用主 (派遣元)</p>
        <div className="border border-black p-4">
          <p>名称: 株式会社HR NEXUS</p>
          <p>住所: 東京都千代田区千代田1-1-1</p>
          <p>代表者: 代表取締役 管理者 太郎</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-1 font-bold">2. 労働条件・就業条件</p>
        <table>
          <tbody>
            <tr>
              <th>契約期間</th>
              <td>{new Date(data.startDate).toLocaleDateString()} 〜 {new Date(data.endDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <th>就業場所 (派遣先)</th>
              <td>
                {data.project.client.companyName}<br/>
                ({data.project.client.address})
              </td>
            </tr>
            <tr>
              <th>業務内容</th>
              <td>{data.project.name} (技術支援業務)</td>
            </tr>
            <tr>
              <th>始業・終業の時刻</th>
              <td>09:00 〜 18:00 (休憩 12:00〜13:00 / 60分)</td>
            </tr>
            <tr>
              <th>所定労働時間</th>
              <td>1日 8時間</td>
            </tr>
            <tr>
              <th>休日・休暇</th>
              <td>土曜日、日曜日、国民の祝日、その他会社が定める日</td>
            </tr>
            <tr>
              <th>賃金 (給与)</th>
              <td>
                基本給 (時給): {data.chargeRate.toLocaleString()}円<br/>
                締切日: 毎月末日 / 支払日: 翌月25日 (銀行振込)
              </td>
            </tr>
            <tr>
              <th>社会保険の加入</th>
              <td>□ 健康保険　□ 厚生年金　□ 雇用保険　□ 労災保険</td>
            </tr>
            <tr>
              <th>抵触日</th>
              <td>事業所抵触日: 2029年3月31日 (通知済み)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-8 border-t border-black">
        <p className="text-xs mb-4">
          上記内容を確認し、承諾致しました。
        </p>
        <div className="flex justify-between items-end mt-12 px-8">
          <span>署名日: _______年____月____日</span>
          <span>氏名: ________________________ (印)</span>
        </div>
      </div>

    </div>
  );
}