'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  FileText, Printer, Briefcase, User, Calendar, 
  FileCheck, ScrollText, ShieldCheck, Search, ChevronRight, 
  Building2, Hash
} from 'lucide-react';

export default function DocumentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // ダミーデータ
    const dummyAssignments = [
        {
            id: 101,
            project: { name: '次世代ECプラットフォーム構築', client: { companyName: '株式会社ダミー1' } },
            staff: { name: '山田 太郎' },
            startDate: '2023-11-01',
            endDate: '2024-03-31'
        },
        {
            id: 102,
            project: { name: 'AIチャットボット導入', client: { companyName: 'ダミー2商事' } },
            staff: { name: '鈴木 一郎' },
            startDate: '2023-12-01',
            endDate: '2024-05-31'
        }
    ];
    setAssignments(dummyAssignments);
  }, []);

  const filteredAssignments = assignments.filter(a => 
    a.project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.staff.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 animate-in fade-in pb-20 relative min-h-screen font-sans text-slate-800 bg-slate-50/50">
        
        {/* 背景装飾: リーガル・グリッド */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* --- Command Header --- */}
        <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] px-6 py-5 mx-4 md:mx-auto max-w-7xl transition-all ring-1 ring-slate-900/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                <ScrollText size={28} className="text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  契約・帳票管理センター
                </h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                  <ShieldCheck size={10} className="text-indigo-500"/> Legal Compliance & Documentation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto flex-1 md:justify-end">
              {/* Intelligent Search */}
              <div className="relative group w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18}/>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="プロジェクト名、またはスタッフ名で検索..." 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-inner placeholder:text-slate-400"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-400">
                   <Hash size={10}/>
                   <span>FILTER</span>
                </div>
              </div>
              
              {/* Counter Badge */}
              <div className="hidden md:flex flex-col items-end px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Active Contracts</span>
                <span className="text-lg font-black text-slate-800 tabular-nums leading-none">{filteredAssignments.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Document List Grid --- */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-0 relative z-10 space-y-4">
          {filteredAssignments.map((assign) => (
            <div 
              key={assign.id} 
              className="group relative bg-white rounded-[24px] border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden ring-1 ring-transparent hover:ring-indigo-100"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-indigo-500 transition-colors"></div>

              <div className="p-6 md:p-8 flex flex-col xl:flex-row items-center gap-8">
                
                {/* 1. Context: Project & Client */}
                <div className="flex items-start gap-5 w-full xl:w-[35%]">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all shrink-0">
                    <Briefcase size={24} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 group-hover:text-indigo-500 group-hover:border-indigo-100 transition-colors">
                        ID: {String(assign.id).padStart(6, '0')}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                        Active
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 truncate leading-tight group-hover:text-indigo-700 transition-colors">
                      {assign.project.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-1.5 truncate">
                      <Building2 size={12} /> {assign.project.client.companyName}
                    </p>
                  </div>
                </div>

                {/* 2. Personnel: Staff & Period */}
                <div className="w-full xl:w-[30%] flex flex-col gap-3 pl-0 xl:pl-8 border-l-0 xl:border-l border-slate-100 border-dashed">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shrink-0">
                      <User size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Assigned Staff</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{assign.staff.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                      <Calendar size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Contract Term</p>
                      <p className="text-sm font-bold text-slate-600 tabular-nums flex items-center gap-1">
                        {new Date(assign.startDate).toLocaleDateString()} 
                        <ChevronRight size={12} className="text-slate-300"/> 
                        {new Date(assign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Actions: Output Buttons */}
                <div className="w-full xl:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                  
                  {/* Button: Labor Conditions (Internal) */}
                  <button 
                    onClick={() => window.open(`/documents/labor/${assign.id}/print`, '_blank')}
                    className="group/btn relative overflow-hidden rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 p-4 transition-all active:scale-[0.98] flex flex-col items-start gap-3 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-200"
                  >
                    <div className="flex items-center justify-between w-full">
                       <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm border border-indigo-50">
                         <FileText size={18} />
                       </div>
                       <Printer size={16} className="text-indigo-300 group-hover/btn:text-indigo-500 transition-colors"/>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-indigo-900">労働条件通知書</span>
                      <span className="block text-[10px] font-medium text-indigo-400 mt-0.5">For Staff (Internal)</span>
                    </div>
                  </button>

                  {/* Button: Dispatch Contract (External) */}
                  <button 
                    onClick={() => window.open(`/documents/contract/${assign.id}/print`, '_blank')}
                    className="group/btn relative overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 p-4 transition-all active:scale-[0.98] flex flex-col items-start gap-3 hover:shadow-lg hover:shadow-emerald-500/10"
                  >
                    <div className="flex items-center justify-between w-full">
                       <div className="p-2 bg-slate-900 rounded-lg text-emerald-400 shadow-md">
                         <FileCheck size={18} />
                       </div>
                       <Printer size={16} className="text-slate-300 group-hover/btn:text-emerald-600 transition-colors"/>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-800 group-hover/btn:text-emerald-900 transition-colors">派遣契約書</span>
                      <span className="block text-[10px] font-medium text-slate-400 group-hover/btn:text-emerald-600 transition-colors mt-0.5">For Client (Legal)</span>
                    </div>
                  </button>

                </div>
              </div>
            </div>
          ))}

          {filteredAssignments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50">
              <div className="p-6 bg-white rounded-full shadow-sm mb-6 border border-slate-100">
                <Search size={40} className="text-slate-300" />
              </div>
              <p className="text-slate-600 font-bold text-lg">No documents found matching your search.</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting the search filters or check project assignments.</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}