'use client';

import { useState, useEffect, Fragment } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  ChevronLeft, ChevronRight, UserPlus, X, Plus, Filter, 
  Star, Trash2, MessageSquare, Briefcase, 
  Search, Zap, Target, CalendarDays, Users, LayoutGrid,
  Clock, CheckCircle2, AlertCircle, ShieldAlert, History,
  ArrowRightLeft, AlertTriangle, Download, Activity
} from 'lucide-react';

// --- Types (Added for New Features) ---
type AuditLog = {
  id: string;
  timestamp: string;
  actor: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT';
  target: string;
  importId?: string;
  diff?: { field: string; before: string; after: string }[];
};

type ExceptionAlert = {
  id: string;
  type: 'WARNING' | 'ERROR';
  staffId: number;
  staffName: string;
  message: string;
  detail: string;
  suggestion: string;
  importId: string;
};

export default function AssignmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [staffList, setStaffList] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  // Existing Modal States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  // New Modal States (Added)
  const [isRiskDetailModalOpen, setIsRiskDetailModalOpen] = useState(false);
  
  // Panel States (Added)
  const [showAuditPanel, setShowAuditPanel] = useState(false);
  const [showExceptionPanel, setShowExceptionPanel] = useState(false);

  // Selection States
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [selectedRisk, setSelectedRisk] = useState<ExceptionAlert | null>(null); // Added
  
  // Forms
  const [assignForm, setAssignForm] = useState({ staffId: '', projectId: '', role: '', startDate: '', endDate: '' });
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });
  
  // Filters
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // --- Mock Data for New Features (Added) ---
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { 
      id: 'L-1023', timestamp: '2026-02-10 14:30', actor: '管理者 太郎', action: 'UPDATE', target: '山本 大介', importId: 'IMP-20260210-001',
      diff: [{ field: 'Project', before: '待機', after: 'ダミー2 (案件A)' }]
    },
    { 
      id: 'L-1022', timestamp: '2026-02-09 09:15', actor: 'システム自動取込', action: 'IMPORT', target: '一括更新 (5件)', importId: 'IMP-20260209-BATCH', diff: []
    },
  ]);

  const [exceptions, setExceptions] = useState<ExceptionAlert[]>([
    { 
      id: 'E-001', type: 'WARNING', staffId: 2, staffName: '佐藤 健一', 
      message: '36協定超過リスク (45h超)', 
      detail: '今月の予測残業時間が48時間に達しています。プロジェクト「ダミー2」の工数過多が原因です。',
      suggestion: 'タスクの再配分または、来週の休暇取得を推奨します。',
      importId: 'IMP-20260210-001' 
    },
    { 
      id: 'E-002', type: 'ERROR', staffId: 3, staffName: '鈴木 マリア', 
      message: '契約期間とアサイン期間の不整合', 
      detail: '契約終了日(2026/03/31)を超えたアサイン(2026/04/15まで)が存在します。',
      suggestion: '契約延長の申請を行うか、アサイン期間を短縮してください。',
      importId: 'IMP-20260205-002' 
    },
  ]);

  // Data Fetching (Mocking for Demo)
  const fetchData = async () => {
    // Demo Data
    setStaffList([
      { id: 1, name: '山本 大介', assignments: [{ id: 101, startDate: '2026-02-01', endDate: '2026-04-30', project: { id: 1, name: '基幹刷新', status: 'active' }, role: 'PM' }] },
      { id: 2, name: '佐藤 健一', assignments: [{ id: 102, startDate: '2026-02-10', endDate: '2026-03-20', project: { id: 2, name: 'アプリ開発', status: 'active' }, role: 'Dev' }] },
      { id: 3, name: '鈴木 マリア', assignments: [] },
      { id: 4, name: '田中 宏', assignments: [] },
    ]);
    setProjects([{ id: 1, name: '基幹刷新' }, { id: 2, name: 'アプリ開発' }]);
  };

  useEffect(() => { fetchData(); }, []);

  // Date Logic
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  // Grid Styles
  const gridColsStyle = { gridTemplateColumns: `260px repeat(${daysInMonth}, minmax(48px, 1fr))` };

  // Bar Position Calculation
  const getBarStyle = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    if (endDate < monthStart || startDate > monthEnd) return null;
    
    const viewStart = startDate < monthStart ? monthStart : startDate;
    const viewEnd = endDate > monthEnd ? monthEnd : endDate;
    
    const startDay = viewStart.getDate();
    const duration = viewEnd.getDate() - startDay + 1;
    
    const gridColumnStart = startDay + 1; 
    const gridColumnEnd = gridColumnStart + duration;

    return { gridColumnStart, gridColumnEnd };
  };

  // Modal Handlers
  const openAssignModal = (staff: any = null) => {
    setSelectedStaff(staff);
    setAssignForm({ staffId: staff ? staff.id : '', projectId: '', role: '', startDate: '', endDate: '' });
    setIsAssignModalOpen(true);
  };

  const openManageModal = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsManageModalOpen(true);
  };

  // Actions
  const handleAssign = async () => {
    // Mock Action
    setIsAssignModalOpen(false); 
    // Add Audit Log
    setAuditLogs(prev => [{
      id: `L-${Math.floor(Math.random()*10000)}`, timestamp: new Date().toLocaleString(), actor: '管理者 太郎', action: 'CREATE', target: selectedStaff?.name || 'Staff', importId: 'MANUAL', diff: []
    }, ...prev]);
  };

  const handleDelete = async () => {
    if (!selectedAssignment || !confirm('このアサインを解除してもよろしいですか？')) return;
    setIsManageModalOpen(false);
    // Add Audit Log
    setAuditLogs(prev => [{
      id: `L-${Math.floor(Math.random()*10000)}`, timestamp: new Date().toLocaleString(), actor: '管理者 太郎', action: 'DELETE', target: selectedAssignment.project.name, importId: 'MANUAL', diff: []
    }, ...prev]);
  };

  const submitFeedback = async () => {
    setIsFeedbackModalOpen(false);
    setIsManageModalOpen(false);
    setFeedbackForm({ rating: 5, comment: '' });
  };

  // New Handlers (Added)
  const handleOpenRiskDetail = (risk: ExceptionAlert) => {
    setSelectedRisk(risk);
    setIsRiskDetailModalOpen(true);
  };

  const handleResolveRisk = () => {
    if (!selectedRisk) return;
    setExceptions(prev => prev.filter(e => e.id !== selectedRisk.id));
    setIsRiskDetailModalOpen(false);
    setAuditLogs(prev => [{
      id: `L-${Math.floor(Math.random()*10000)}`, timestamp: new Date().toLocaleString(), actor: '管理者 太郎', action: 'UPDATE', target: selectedRisk.staffName, importId: 'MANUAL-FIX', diff: [{ field: 'Risk Status', before: 'Active', after: 'Resolved' }]
    }, ...prev]);
  };

  // Filter Logic
  const visibleStaffList = staffList.filter(staff => {
    const hasValidProject = staff.assignments?.some((a: any) => a.project && a.project.status !== 'completed');
    return showActiveOnly ? hasValidProject : true;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 overflow-hidden relative font-sans text-slate-800 bg-slate-50/50">
        
        {/* --- Background: Technical Grid Pattern --- */}
        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {/* --- Header: Command Console --- */}
        <div className="flex-none bg-white/80 backdrop-blur-xl border border-white/60 rounded-[20px] p-5 shadow-sm z-20 flex flex-col lg:flex-row items-center justify-between gap-4 ring-1 ring-slate-900/5">
          <div className="flex items-center gap-5 w-full lg:w-auto">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
              <LayoutGrid size={28} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                リソース・アサインボード
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Target size={10} /> Resource Allocation Intelligence
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
            {/* Added: Intelligence Toggles */}
            <div className="flex items-center bg-slate-100/50 p-1 rounded-xl border border-slate-200/60 order-2 sm:order-1">
              <button 
                onClick={() => { setShowExceptionPanel(!showExceptionPanel); setShowAuditPanel(false); }}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${showExceptionPanel ? 'bg-white text-rose-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-500 hover:bg-white/60'}`}
              >
                <Zap size={14} className={showExceptionPanel ? 'fill-rose-600' : ''}/>
                リスク検知
                {exceptions.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>}
              </button>
              <button 
                onClick={() => { setShowAuditPanel(!showAuditPanel); setShowExceptionPanel(false); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${showAuditPanel ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100' : 'text-slate-500 hover:bg-white/60'}`}
              >
                <Activity size={14} />
                監査ログ
              </button>
            </div>

            <div className="h-8 w-px bg-slate-300 hidden sm:block opacity-50 order-2"></div>

            {/* Date Navigator */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto order-3">
              <button onClick={prevMonth} className="p-3 hover:bg-slate-50 rounded-lg transition-all text-slate-400 hover:text-indigo-600 active:scale-95">
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
              <div className="px-6 text-center border-x border-slate-100 min-w-[140px]">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">対象期間</span>
                <span className="block text-base font-black text-slate-800 tabular-nums tracking-tight leading-none">
                  {currentDate.getFullYear()}年 <span className="text-indigo-600">{currentDate.getMonth() + 1}月</span>
                </span>
              </div>
              <button onClick={nextMonth} className="p-3 hover:bg-slate-50 rounded-lg transition-all text-slate-400 hover:text-indigo-600 active:scale-95">
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto order-4">
               <button 
                 onClick={() => setShowActiveOnly(!showActiveOnly)}
                 className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all border ${
                   showActiveOnly 
                     ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-inner' 
                     : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm'
                 }`}
               >
                 <Filter size={14} />
                 {showActiveOnly ? '稼働中のみ' : '全員表示'}
               </button>

               <button 
                 onClick={() => openAssignModal(null)} 
                 className="flex-1 sm:flex-none bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all text-xs tracking-wide active:scale-95 group"
               >
                 <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform"/> 
                 新規アサイン
               </button>
            </div>
          </div>
        </div>

        {/* --- Main Content Area (Split View) --- */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          
          {/* Main Timeline Grid */}
          <div className="flex-1 bg-white border border-slate-200 rounded-[20px] shadow-xl overflow-hidden relative flex flex-col z-10 ring-1 ring-slate-900/5 transition-all">
            
            {/* Scrollable Container */}
            <div className="flex-1 overflow-auto custom-scrollbar relative">
              
              {/* The Grid System */}
              <div className="grid min-w-max" style={gridColsStyle}>
                
                {/* --- Header Row (Dates) --- */}
                <div className="sticky top-0 left-0 z-40 bg-slate-50/95 backdrop-blur-md border-b border-r border-slate-200 h-16 flex items-center justify-between px-5 shadow-[4px_0_12px_rgba(0,0,0,0.03)]">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Users size={12} /> 要員リスト
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <CalendarDays size={12} /> スケジュール
                  </span>
                </div>
                
                {days.map(d => {
                  const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
                  const isToday = d === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                  return (
                    <div key={d} className={`sticky top-0 z-30 h-16 border-b border-r border-slate-100 flex flex-col items-center justify-center group ${isToday ? 'bg-indigo-50/90' : 'bg-slate-50/95'} backdrop-blur-md`}>
                      <span className={`text-[9px] font-black uppercase leading-none mb-1 ${isToday ? 'text-indigo-600' : isWeekend ? 'text-rose-400' : 'text-slate-400'}`}>
                        {dateObj.toLocaleDateString('ja-JP', { weekday: 'short' })}
                      </span>
                      <span className={`text-sm font-bold tabular-nums leading-none ${isToday ? 'text-indigo-600' : 'text-slate-700'}`}>
                        {d}
                      </span>
                      {isToday && (
                          <div className="absolute top-full bottom-[-100vh] w-[2px] bg-indigo-500/30 z-0 pointer-events-none shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full shadow-sm"></div>
                          </div>
                      )}
                    </div>
                  );
                })}

                {/* --- Data Rows --- */}
                {visibleStaffList.map((staff, rowIndex) => {
                   const activeAssignments = staff.assignments?.filter((a: any) => a.project && a.project.status !== 'completed') || [];
                   const isActive = activeAssignments.some((a: any) => a.project?.status === 'active');
                   const gridRow = rowIndex + 2; 
                   // Added: Check for Risk
                   const hasRisk = exceptions.find(e => e.staffId === staff.id);

                   return (
                    <Fragment key={staff.id}>
                      {/* Sticky Left Column (Staff Info) */}
                      <div className={`sticky left-0 z-20 bg-white border-b border-r border-slate-100 p-4 flex items-center justify-between group h-20 transition-colors shadow-[4px_0_12px_rgba(0,0,0,0.03)] ${hasRisk ? 'bg-rose-50/30' : 'hover:bg-slate-50/50'}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border shadow-sm ${hasRisk ? 'bg-rose-100 border-rose-200 text-rose-500' : isActive ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                              {staff.name.charAt(0)}
                            </div>
                            {isActive && !hasRisk && <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>}
                          </div>
                          <div className="min-w-0 flex flex-col justify-center">
                            <p className="text-xs font-bold text-slate-800 truncate flex items-center gap-2">
                              {staff.name}
                              {hasRisk && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-bold shadow-sm animate-pulse">
                                  <AlertTriangle size={8} /> Risk
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                  {isActive ? '稼働中' : '待機中'}
                                </span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => openAssignModal(staff)} className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all active:scale-90 shadow-sm">
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Timeline Cells */}
                      {days.map(d => {
                          const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
                          const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                          const isToday = d === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                          return (
                              <div key={`${staff.id}-${d}`} 
                                   className={`border-b border-r border-slate-50 h-20 relative transition-colors 
                                   ${isToday ? 'bg-indigo-50/10' : isWeekend ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}
                              ></div>
                          )
                      })}

                      {/* Render Assignment Bars */}
                      {activeAssignments.map((assign: any) => {
                        const style = getBarStyle(assign.startDate, assign.endDate);
                        if (!style) return null;

                        const isPast = assign.endDate && new Date(assign.endDate) < new Date();
                        
                        return (
                          <div 
                            key={assign.id}
                            onClick={() => openManageModal(assign)}
                            className={`
                              relative mx-0.5 h-12 self-center rounded-lg cursor-pointer group/bar transition-all duration-300 hover:scale-[1.02] hover:z-30 hover:shadow-xl overflow-hidden border
                              ${isPast 
                                  ? 'bg-slate-100 border-slate-200 opacity-70 grayscale' 
                                  : 'bg-gradient-to-br from-indigo-500 to-violet-600 border-white/10 shadow-lg shadow-indigo-500/20'}
                            `}
                            style={{
                              gridColumnStart: style.gridColumnStart,
                              gridColumnEnd: style.gridColumnEnd,
                              gridRowStart: gridRow,
                              gridRowEnd: gridRow + 1
                            }}
                          >
                              {/* Bar Content */}
                              <div className="h-full w-full px-3 flex flex-col justify-center relative z-10">
                                <div className={`flex items-center gap-1.5 ${isPast ? 'text-slate-500' : 'text-white'}`}>
                                  <Briefcase size={10} strokeWidth={2.5} className="opacity-80 shrink-0" />
                                  <span className="text-[10px] font-black truncate leading-none tracking-tight">
                                    {assign.project.name}
                                  </span>
                                </div>
                                <div className={`text-[9px] font-bold truncate mt-1 flex items-center gap-1 ${isPast ? 'text-slate-400' : 'text-indigo-100'}`}>
                                  <span className="w-1 h-1 rounded-full bg-current opacity-60"></span>
                                  {assign.role || 'メンバー'}
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/bar:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"></div>
                          </div>
                        );
                      })}
                    </Fragment>
                   );
                })}
              </div>
              
              {visibleStaffList.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                  <div className="p-5 bg-white rounded-full mb-4 shadow-sm border border-slate-100">
                      <Search size={32} className="text-slate-300" />
                  </div>
                  <p className="font-bold text-sm text-slate-500">該当するアサイン情報がありません</p>
                  <p className="text-xs text-slate-400 mt-1">検索条件を変更するか、新規アサインを作成してください</p>
                </div>
              )}
            </div>
          </div>

          {/* Added: Sliding Panel (Intelligence & Audit) */}
          {(showAuditPanel || showExceptionPanel) && (
            <div className="w-[360px] bg-white rounded-[20px] border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-500 relative z-40 ring-1 ring-slate-900/5">
              <div className={`p-5 border-b sticky top-0 z-10 backdrop-blur-md ${showExceptionPanel ? 'bg-rose-50/50 border-rose-100' : 'bg-indigo-50/50 border-indigo-100'}`}>
                 <div className="flex justify-between items-center mb-4">
                   <h3 className={`font-black text-lg flex items-center gap-2 tracking-tight ${showExceptionPanel ? 'text-rose-700' : 'text-indigo-700'}`}>
                     {showExceptionPanel ? <><ShieldAlert size={20}/> リスク検知</> : <><History size={20}/> 監査ログ</>}
                   </h3>
                   <button onClick={() => { setShowAuditPanel(false); setShowExceptionPanel(false); }} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                     <X size={18} className="text-slate-500"/>
                   </button>
                 </div>
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                   <input placeholder="ID検索 / フィルタ..." className="w-full pl-9 pr-4 py-2.5 bg-white/60 border-none rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder:text-slate-400 shadow-sm" />
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/50">
                {/* Exception Mode */}
                {showExceptionPanel && exceptions.map(exc => (
                  <div key={exc.id} className="p-4 rounded-2xl bg-white border border-rose-100 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-rose-200 transition-all">
                     <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                     <div className="flex justify-between items-start mb-2 pl-2">
                       <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${exc.type === 'ERROR' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                         {exc.type}
                       </span>
                       <span className="text-[9px] font-mono text-slate-300">ID: {exc.id}</span>
                     </div>
                     <h4 className="font-bold text-sm text-slate-800 mb-1 pl-2">{exc.message}</h4>
                     <p className="text-xs text-slate-500 mb-4 pl-2">対象: <span className="font-bold text-slate-700">{exc.staffName}</span></p>
                     <div className="pl-2 flex gap-2">
                       <button onClick={() => handleOpenRiskDetail(exc)} className="flex-1 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">詳細を確認</button>
                     </div>
                  </div>
                ))}

                {/* Audit Mode */}
                {showAuditPanel && auditLogs.map(log => (
                  <div key={log.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                     <div className="flex justify-between items-start mb-3">
                       <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">{log.id}</span>
                       <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1"><Clock size={10}/> {log.timestamp.split(' ')[1]}</span>
                     </div>
                     <div className="flex items-center gap-3 mb-3">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 border border-white shadow-sm">
                         {log.actor.charAt(0)}
                       </div>
                       <div>
                         <p className="text-xs font-bold text-slate-700">{log.actor}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{log.action}</p>
                       </div>
                     </div>
                     {log.diff && log.diff.length > 0 && (
                       <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100/50">
                         {log.diff.map((d, i) => (
                           <div key={i} className="text-[10px]">
                              <div className="font-bold text-slate-400 mb-1 uppercase tracking-wider text-[9px]">{d.field}</div>
                              <div className="flex items-center gap-2 flex-wrap font-mono">
                                <span className="line-through text-rose-400 decoration-rose-200 decoration-2 opacity-60">{d.before}</span>
                                <ArrowRightLeft size={10} className="text-slate-300"/>
                                <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{d.after}</span>
                              </div>
                           </div>
                         ))}
                       </div>
                     )}
                     <div className="mt-3 pt-2 border-t border-slate-50 flex items-center gap-1 text-[9px] text-indigo-400 font-mono">
                       <Zap size={10}/> {log.importId || 'MANUAL'}
                     </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                 <button className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold text-xs hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 shadow-sm">
                   <Download size={14}/> ログ出力 (CSV)
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* --- Modals (Global Overlay) --- */}
        {(isAssignModalOpen || isManageModalOpen || isFeedbackModalOpen || isRiskDetailModalOpen) && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
            
            {/* 1. Assign Modal */}
            {isAssignModalOpen && (
              <div className="bg-white rounded-[24px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-slate-900/5">
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><UserPlus size={120} /></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl shadow-lg backdrop-blur-sm"><UserPlus size={24} className="text-indigo-200"/></div>
                    <div>
                        <span className="block text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Action</span>
                        <span className="block font-black text-lg tracking-tight">新規アサイン登録</span>
                    </div>
                  </div>
                  <button onClick={() => setIsAssignModalOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors relative z-10"><X size={18}/></button>
                </div>
                
                <div className="p-8 space-y-6">
                  {!selectedStaff && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Search size={12}/> 対象スタッフ</label>
                      <div className="relative">
                        <select value={assignForm.staffId} onChange={e => setAssignForm({...assignForm, staffId: e.target.value})} className="w-full p-3.5 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 border border-slate-200 appearance-none hover:border-indigo-300 transition-colors">
                            <option value="">スタッフを選択...</option>
                            {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronLeft className="-rotate-90" size={16}/></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Briefcase size={12}/> プロジェクト</label>
                    <div className="relative">
                        <select value={assignForm.projectId} onChange={e => setAssignForm({...assignForm, projectId: e.target.value})} className="w-full p-3.5 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 border border-slate-200 appearance-none hover:border-indigo-300 transition-colors">
                        <option value="">プロジェクトを選択...</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronLeft className="-rotate-90" size={16}/></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Target size={12}/> 役割・ポジション</label>
                    <input value={assignForm.role} onChange={e => setAssignForm({...assignForm, role: e.target.value})} className="w-full p-3.5 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 border border-slate-200 hover:border-indigo-300 transition-colors" placeholder="例: PM, リーダー, メンバー..." />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><CalendarDays size={12}/> 開始日</label>
                      <input type="date" value={assignForm.startDate} onChange={e => setAssignForm({...assignForm, startDate: e.target.value})} className="w-full p-3.5 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 border border-slate-200 hover:border-indigo-300 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><CalendarDays size={12}/> 終了日</label>
                      <input type="date" value={assignForm.endDate} onChange={e => setAssignForm({...assignForm, endDate: e.target.value})} className="w-full p-3.5 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 border border-slate-200 hover:border-indigo-300 transition-colors" />
                    </div>
                  </div>

                  <button onClick={handleAssign} className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 transition-all mt-4 active:scale-95 text-xs tracking-wider uppercase flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> アサインを確定する
                  </button>
                </div>
              </div>
            )}

            {/* 2. Manage Modal */}
            {isManageModalOpen && !isFeedbackModalOpen && selectedAssignment && (
              <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200 border border-slate-100 relative overflow-hidden ring-1 ring-slate-900/5">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none"></div>
                <div className="w-16 h-16 bg-white text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-indigo-500/10 relative z-10 border border-indigo-50">
                  <Briefcase size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-1 tracking-tight">{selectedAssignment.project.name}</h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">
                    Assignment Control
                </div>
                
                <div className="space-y-3">
                  <button onClick={() => setIsFeedbackModalOpen(true)} className="w-full py-3.5 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm">
                    <Star size={16} fill="currentColor" /> 評価・フィードバック
                  </button>
                  <button onClick={handleDelete} className="w-full py-3.5 bg-white text-rose-500 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-sm">
                    <Trash2 size={16} /> アサイン解除・削除
                  </button>
                  <button onClick={() => setIsManageModalOpen(false)} className="w-full py-3.5 text-slate-400 font-bold hover:text-slate-600 transition-colors text-xs">
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            {/* 3. Feedback Modal */}
            {isFeedbackModalOpen && (
              <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95 duration-200 border border-slate-100 ring-1 ring-slate-900/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shadow-lg shadow-amber-100/50"><MessageSquare size={24}/></div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">評価・フィードバック</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quality Assurance</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-center gap-3 bg-slate-50 py-6 rounded-2xl border border-slate-100">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setFeedbackForm({...feedbackForm, rating: star})} className={`transition-all hover:scale-110 active:scale-90 ${star <= feedbackForm.rating ? 'text-amber-400 drop-shadow-sm' : 'text-slate-200'}`}>
                        <Star size={32} fill="currentColor" />
                      </button>
                    ))}
                  </div>
                  
                  <textarea 
                    value={feedbackForm.comment} 
                    onChange={e => setFeedbackForm({...feedbackForm, comment: e.target.value})}
                    placeholder="パフォーマンスに関する評価コメントを入力..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 min-h-[120px] resize-none hover:border-slate-300 transition-colors"
                  />

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setIsFeedbackModalOpen(false)} className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-colors text-xs">
                      戻る
                    </button>
                    <button onClick={submitFeedback} className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-black shadow-lg shadow-slate-900/10 transition-all active:scale-95 text-xs">
                      送信する
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Added: 4. Risk Detail Modal */}
            {isRiskDetailModalOpen && selectedRisk && (
                <div className="bg-white p-0 rounded-[32px] w-full max-w-lg shadow-2xl ring-1 ring-rose-100 overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="bg-rose-50 p-6 border-b border-rose-100">
                        <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg text-rose-500 shadow-sm"><AlertTriangle size={24}/></div>
                            <div>
                            <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">{selectedRisk.type}</p>
                            <h3 className="text-lg font-bold text-slate-800">{selectedRisk.message}</h3>
                            </div>
                        </div>
                        <button onClick={() => setIsRiskDetailModalOpen(false)} className="p-2 hover:bg-white/50 rounded-full text-rose-400"><X size={20}/></button>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">検知された問題 (Detail)</h4>
                        <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedRisk.detail}</p>
                        </div>
                        <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">AIによる推奨アクション (Suggestion)</h4>
                        <div className="flex gap-3 items-start p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <Zap size={18} className="text-emerald-500 shrink-0 mt-0.5"/>
                            <p className="text-emerald-800 font-bold text-sm">{selectedRisk.suggestion}</p>
                        </div>
                        </div>
                        <div className="pt-4 flex gap-3">
                        <button onClick={() => setIsRiskDetailModalOpen(false)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50">保留する</button>
                        <button onClick={handleResolveRisk} className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 flex items-center justify-center gap-2">
                            <CheckCircle2 size={18}/> 対応完了としてマーク
                        </button>
                        </div>
                    </div>
                </div>
            )}

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}