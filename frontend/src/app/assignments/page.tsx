'use client';

import { useState, useEffect, Fragment } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  ChevronLeft, ChevronRight, UserPlus, X, Plus, Filter, 
  Info, Star, Trash2, MessageSquare, Briefcase, Calendar, 
  Search, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';

export default function AssignmentsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [staffList, setStaffList] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [assignForm, setAssignForm] = useState({ staffId: '', projectId: '', role: '', startDate: '', endDate: '' });
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' });
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const fetchData = async () => {
    try {
      const [resStaff, resProj] = await Promise.all([
        fetch('http://localhost:3000/staff'),
        fetch('http://localhost:3000/projects')
      ]);
      if (resStaff.ok) setStaffList(await resStaff.json());
      if (resProj.ok) setProjects(await resProj.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const gridColsStyle = { gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` };

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
    return {
      left: `${((startDay - 1) / daysInMonth) * 100}%`,
      width: `${(duration / daysInMonth) * 100}%`,
    };
  };

  const openAssignModal = (staff: any = null) => {
    setSelectedStaff(staff);
    setAssignForm({ staffId: staff ? staff.id : '', projectId: '', role: '', startDate: '', endDate: '' });
    setIsAssignModalOpen(true);
  };

  const openManageModal = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsManageModalOpen(true);
  };

  const handleAssign = async () => {
    const targetStaffId = selectedStaff ? selectedStaff.id : assignForm.staffId;
    if (!assignForm.projectId || !assignForm.startDate || !targetStaffId) return;
    await fetch(`http://localhost:3000/projects/${assignForm.projectId}/assignments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...assignForm, staffId: targetStaffId }),
    });
    setIsAssignModalOpen(false); 
    fetchData();
  };

  const handleDelete = async () => {
    if (!selectedAssignment || !confirm('アサインを削除しますか？')) return;
    await fetch(`http://localhost:3000/assignments/${selectedAssignment.id}`, { method: 'DELETE' });
    setIsManageModalOpen(false);
    fetchData();
  };

  const submitFeedback = async () => {
    if (!selectedAssignment) return;
    await fetch('http://localhost:3000/feedbacks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignmentId: selectedAssignment.id, rating: feedbackForm.rating, comment: feedbackForm.comment })
    });
    setIsFeedbackModalOpen(false);
    setIsManageModalOpen(false);
    setFeedbackForm({ rating: 5, comment: '' });
  };

  const visibleStaffList = staffList.filter(staff => {
    const hasValidProject = staff.assignments?.some((a: any) => a.project && a.project.status !== 'completed');
    return showActiveOnly ? hasValidProject : true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in h-[calc(100vh-10rem)] flex flex-col selection:bg-indigo-100">
        
        {/* --- Upper Control: Glass & Gradient --- */}
        <div className="flex flex-col lg:flex-row justify-between items-center bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-sm border border-white/60 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
              <Calendar size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic flex items-center gap-2">
                RESOURCE<span className="text-indigo-600">TIMELINE</span>
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Resource allocation & Tracking</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <button 
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`group flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-black transition-all border ${
                showActiveOnly ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Filter size={16} className={showActiveOnly ? 'animate-pulse' : ''} /> 
              {showActiveOnly ? 'Active Personnel Only' : 'Show All Personnel'}
            </button>

            <div className="flex items-center gap-2 bg-slate-900 text-white p-2 rounded-2xl shadow-xl">
              <button onClick={prevMonth} className="p-3 hover:bg-white/10 rounded-xl transition-colors"><ChevronLeft size={20}/></button>
              <span className="font-black text-sm w-36 text-center tracking-widest uppercase">
                {currentDate.getFullYear()} . {currentDate.getMonth() + 1}
              </span>
              <button onClick={nextMonth} className="p-3 hover:bg-white/10 rounded-xl transition-colors"><ChevronRight size={20}/></button>
            </div>

            <button onClick={() => openAssignModal(null)} className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all text-sm">
              <UserPlus size={18} strokeWidth={3} /> NEW ASSIGNMENT
            </button>
          </div>
        </div>

        {/* --- Main Chart: Ultra Precision Grid --- */}
        <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-2xl shadow-slate-200/50 flex-1 overflow-hidden flex flex-col relative group">
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <div className="grid grid-cols-[18rem_1fr] min-w-[1000px]">

              {/* Sticky Header Row */}
              <div className="sticky top-0 z-30 bg-slate-900 p-5 font-black text-[10px] text-indigo-300 uppercase tracking-[0.2em] border-r border-slate-800 flex items-center shadow-lg">
                Staff Member / Role
              </div>
              <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 grid shadow-lg" style={gridColsStyle}>
                {days.map(d => (
                  <div key={d} className={`border-r border-slate-800 text-[10px] font-black text-center py-5 transition-colors ${
                    new Date().getDate() === d && currentDate.getMonth() === new Date().getMonth() ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500'
                  }`}>
                    {d < 10 ? `0${d}` : d}
                  </div>
                ))}
              </div>

              {/* Personnel Rows */}
              {visibleStaffList.map(staff => {
                const activeAssignments = staff.assignments?.filter((a: any) => a.project && a.project.status !== 'completed') || [];
                const isTrulyWorking = activeAssignments.some((a: any) => a.project?.status === 'active');
                
                return (
                  <Fragment key={staff.id}>
                    {/* Left Info Column */}
                    <div className="sticky left-0 z-10 border-b border-r border-slate-100 p-4 bg-white flex items-center justify-between group/row hover:bg-slate-50 transition-all h-24 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-transform group-hover/row:scale-110 ${
                          isTrulyWorking ? 'bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {staff.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-sm text-slate-800 truncate tracking-tight">{staff.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${isTrulyWorking ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${isTrulyWorking ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {isTrulyWorking ? 'On Duty' : 'Available'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => openAssignModal(staff)} className="p-2.5 text-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all opacity-0 group-hover/row:opacity-100">
                        <Plus size={20} strokeWidth={3} />
                      </button>
                    </div>

                    {/* Timeline Column */}
                    <div className="border-b border-slate-100 relative group/cell hover:bg-indigo-50/10 transition-colors h-24">
                      {/* Sub-grid lines */}
                      <div className="absolute inset-0 grid h-full pointer-events-none" style={gridColsStyle}>
                        {days.map(d => <div key={d} className="border-r border-slate-50/50 h-full"></div>)}
                      </div>
                      
                      {/* Current Day Highlighter */}
                      {currentDate.getMonth() === new Date().getMonth() && (
                        <div 
                          className="absolute h-full w-px bg-indigo-500/30 z-[5] pointer-events-none shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                          style={{ left: `${((new Date().getDate() - 1) / daysInMonth) * 100}%` }}
                        >
                          <div className="absolute top-0 -left-1 w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                        </div>
                      )}

                      <div className="relative h-full w-full py-4 px-1">
                        {activeAssignments.map((assign: any) => {
                          const style = getBarStyle(assign.startDate, assign.endDate);
                          if (!style) return null;

                          const isProjectActive = assign.project?.status === 'active';
                          const isPast = assign.endDate && new Date(assign.endDate) < new Date();

                          return (
                            <div 
                              key={assign.id} 
                              style={style} 
                              onClick={() => openManageModal(assign)}
                              className={`absolute top-1/2 -translate-y-1/2 h-12 rounded-2xl shadow-lg flex items-center px-4 text-[11px] font-black text-white whitespace-nowrap border-4 border-white transition-all hover:scale-[1.02] hover:z-20 cursor-pointer z-10 group/bar overflow-hidden ${
                                isPast ? 'bg-slate-400 grayscale' : isProjectActive ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : 'bg-gradient-to-r from-amber-400 to-orange-400'
                              }`} 
                            >
                              <div className="flex items-center gap-2 drop-shadow-md truncate">
                                <Briefcase size={12} strokeWidth={3} />
                                <span className="uppercase tracking-tighter">{assign.project.name}</span>
                              </div>
                              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/bar:translate-y-0 transition-transform duration-300"></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- Unified Glass Modal Container --- */}
        {/* (モーダル部分は背景の強力なブラーと丸みの強い角で統一) */}
        {(isAssignModalOpen || isManageModalOpen || isFeedbackModalOpen) && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
            
            {/* 1. Assign Modal */}
            {isAssignModalOpen && (
              <div className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden border border-white">
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl rotate-6"><UserPlus size={24}/></div>
                    <h3 className="text-2xl font-black tracking-tight italic">NEW<span className="text-indigo-400 tracking-tighter uppercase ml-1">Assign</span></h3>
                  </div>
                  <button onClick={() => setIsAssignModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X/></button>
                </div>
                <div className="p-10 space-y-6">
                  {!selectedStaff && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Staff</label>
                      <select value={assignForm.staffId} onChange={e => setAssignForm({...assignForm, staffId: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-700 outline-none focus:ring-4 ring-indigo-500/10">
                        <option value="">Choose Personnel...</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Project</label>
                      <select value={assignForm.projectId} onChange={e => setAssignForm({...assignForm, projectId: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-700 outline-none focus:ring-4 ring-indigo-500/10">
                        <option value="">Select Project...</option>
                        {projects.filter(p => p.status !== 'completed').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Assign Role</label>
                      <input value={assignForm.role} onChange={e => setAssignForm({...assignForm, role: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-700 outline-none focus:ring-4 ring-indigo-500/10" placeholder="e.g. Lead Designer" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Start Date</label>
                      <input type="date" value={assignForm.startDate} onChange={e => setAssignForm({...assignForm, startDate: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-700 outline-none focus:ring-4 ring-indigo-500/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">End Date</label>
                      <input type="date" value={assignForm.endDate} onChange={e => setAssignForm({...assignForm, endDate: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-700 outline-none focus:ring-4 ring-indigo-500/10" />
                    </div>
                  </div>
                  <button onClick={handleAssign} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all uppercase tracking-widest text-sm mt-4">Confirm Assignment</button>
                </div>
              </div>
            )}

            {/* 2. Management & 3. Feedback Modals (Simplified for brevity) */}
            {isManageModalOpen && !isFeedbackModalOpen && selectedAssignment && (
              <div className="bg-white p-12 rounded-[4rem] w-full max-w-md shadow-2xl text-center border border-slate-100">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase size={36} strokeWidth={2.5}/>
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight">{selectedAssignment.project.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-10 italic">Assignment Settings</p>
                <div className="space-y-4">
                  <button onClick={() => setIsFeedbackModalOpen(true)} className="w-full py-5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all border border-amber-100">
                    <Star size={20} fill="currentColor" /> Input Client Feedback
                  </button>
                  <button onClick={handleDelete} className="w-full py-5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all border border-rose-100 text-sm uppercase tracking-widest">
                    <Trash2 size={20} /> Release Personnel
                  </button>
                  <button onClick={() => setIsManageModalOpen(false)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-900 transition-colors">Dismiss</button>
                </div>
              </div>
            )}

            {isFeedbackModalOpen && (
              <div className="bg-white p-12 rounded-[4rem] w-full max-w-lg shadow-2xl border border-slate-100">
                <h3 className="text-3xl font-black mb-10 flex items-center gap-4 tracking-tighter">
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl shadow-sm"><MessageSquare size={28}/></div>
                  Client <span className="text-indigo-600">Satisfaction</span>
                </h3>
                <div className="space-y-10">
                  <div className="flex justify-between items-center bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                        className={`transition-all hover:scale-125 ${star <= feedbackForm.rating ? 'text-amber-400 drop-shadow-md' : 'text-slate-200'}`}
                      >
                        <Star size={40} fill="currentColor" strokeWidth={0} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={feedbackForm.comment} onChange={e => setFeedbackForm({...feedbackForm, comment: e.target.value})}
                    placeholder="Describe client satisfaction and work quality..."
                    className="w-full p-8 bg-slate-50 border-none rounded-[2rem] font-medium text-slate-700 outline-none focus:ring-8 ring-indigo-500/5 min-h-[160px] text-lg italic shadow-inner"
                  />
                  <div className="flex gap-4">
                    <button onClick={() => setIsFeedbackModalOpen(false)} className="flex-1 py-5 rounded-2xl font-black text-slate-400 hover:bg-slate-50 uppercase tracking-widest text-xs">Back</button>
                    <button onClick={submitFeedback} className="flex-1 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-xl shadow-slate-200 hover:bg-black transition-all uppercase tracking-widest text-xs">Record Insight</button>
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