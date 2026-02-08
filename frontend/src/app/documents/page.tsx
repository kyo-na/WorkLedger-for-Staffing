'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FileText, Printer, Briefcase, User, Calendar } from 'lucide-react';

export default function DocumentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/assignments');
        if (res.ok) setAssignments(await res.json());
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in pb-20">
        
        {/* ヘッダー */}
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">LEGAL<span className="text-indigo-600">DOCS</span></h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">契約書・帳票作成</p>
          </div>
        </div>

        {/* 契約一覧リスト */}
        <div className="grid grid-cols-1 gap-4">
          {assignments.map((assign) => (
            <div key={assign.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-6 hover:shadow-md transition-all">
              
              <div className="flex items-center gap-6 w-full lg:w-1/3">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">{assign.project.name}</h3>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                    <Briefcase size={12}/> {assign.project.client.companyName}
                  </p>
                </div>
              </div>

              <div className="flex-1 text-sm text-slate-600">
                <div className="flex items-center gap-2 mb-1">
                  <User size={14} className="text-slate-400"/> 
                  <span className="font-bold">{assign.staff.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400"/>
                  <span>{new Date(assign.startDate).toLocaleDateString()} 〜 {new Date(assign.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2 w-full lg:w-auto">
                <button 
                  onClick={() => window.open(`/documents/labor/${assign.id}/print`, '_blank')}
                  className="flex-1 lg:flex-none px-4 py-3 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-100"
                >
                  <Printer size={16}/> 労働条件通知書
                </button>
                <button 
                  onClick={() => window.open(`/documents/contract/${assign.id}/print`, '_blank')}
                  className="flex-1 lg:flex-none px-4 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-100"
                >
                  <Printer size={16}/> 派遣契約書
                </button>
              </div>

            </div>
          ))}

          {assignments.length === 0 && (
             <div className="text-center p-12 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-[2rem]">
               現在、契約中のアサイン情報はありません。<br/>プロジェクト管理画面からスタッフをアサインしてください。
             </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}