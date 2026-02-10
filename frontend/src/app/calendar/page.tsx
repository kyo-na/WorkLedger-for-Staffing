'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  ChevronLeft, ChevronRight, Plus, X, User, 
  Calendar as CalendarIcon, Briefcase, Clock, MapPin, AlignLeft, 
  Trash2, Layers, CheckCircle2 
} from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    color: '#3b82f6',
    staffId: '',
    description: ''
  });

  const fetchData = async () => {
    try {
      const [resEvents, resStaff] = await Promise.all([
        fetch('http://localhost:3000/calendar'),
        fetch('http://localhost:3000/staff')
      ]);
      if (resEvents.ok) setEvents(await resEvents.json());
      if (resStaff.ok) setStaffList(await resStaff.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const calendarCells = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleCreate = async () => {
    if (!newEvent.title || !newEvent.start) { alert('タイトルと開始日は必須です'); return; }
    await fetch('http://localhost:3000/calendar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    });
    setNewEvent({ title: '', start: '', end: '', color: '#3b82f6', staffId: '', description: '' });
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (idString: string) => {
    if (idString.startsWith('assign-')) {
       alert('案件アサインはここでは削除できません。アサイン調整画面で操作してください。');
       return;
    }
    if (!confirm('この予定を削除しますか？')) return;
    await fetch(`http://localhost:3000/calendar/${idString}`, { method: 'DELETE' });
    fetchData();
  };

  const getEventsForDay = (day: number) => {
    const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => {
       const startStr = typeof e.start === 'string' ? e.start : new Date(e.start).toISOString();
       return startStr.startsWith(targetDateStr);
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 relative font-sans text-slate-800 bg-slate-50/50">
        
        {/* 背景装飾: テクニカル・ドットパターン */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* --- Header Control Panel --- */}
        <div className="flex-none sticky top-0 z-30 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] p-5 flex flex-col md:flex-row items-center justify-between gap-4 ring-1 ring-slate-900/5 transition-all">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
              <CalendarIcon size={28} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                作戦行動カレンダー
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1.5 mt-0.5">
                 Operational Schedule
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
              <button onClick={prevMonth} className="p-3 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors active:scale-95">
                <ChevronLeft size={20} strokeWidth={2.5}/>
              </button>
              <div className="px-6 py-1 text-center min-w-[160px] border-x border-slate-100">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Year / Month</span>
                <span className="block text-xl font-black text-slate-800 tabular-nums leading-none tracking-tight">
                  {year} <span className="text-indigo-500">.</span> {String(month + 1).padStart(2, '0')}
                </span>
              </div>
              <button onClick={nextMonth} className="p-3 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors active:scale-95">
                <ChevronRight size={20} strokeWidth={2.5}/>
              </button>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-wide active:scale-95 whitespace-nowrap"
            >
              <Plus size={18} strokeWidth={3} /> 予定追加
            </button>
          </div>
        </div>

        {/* --- Calendar Grid --- */}
        <div className="flex-1 bg-white border border-slate-200 rounded-[24px] shadow-xl overflow-hidden flex flex-col z-10 ring-1 ring-slate-900/5">
          
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 backdrop-blur-sm">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
              <div key={day} className={`py-4 text-center text-[10px] font-black tracking-[0.25em] ${
                i === 0 ? 'text-rose-500' : i === 6 ? 'text-blue-500' : 'text-slate-400'
              }`}>
                {day}
              </div>
            ))}
          </div>
          
          {/* Days Cells */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr overflow-y-auto custom-scrollbar bg-slate-50/30">
            {calendarCells.map((day, i) => {
              // Empty Cell (Previous Month)
              if (day === null) return (
                <div key={`empty-${i}`} className="bg-slate-100/50 border-b border-r border-slate-200/50 backdrop-blur-[1px] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '8px 8px'}}></div>
                </div>
              );
              
              const dayEvents = getEventsForDay(day as number);
              const isWeekend = (i % 7 === 0) || (i % 7 === 6);
              const isToday = 
                day === new Date().getDate() && 
                month === new Date().getMonth() && 
                year === new Date().getFullYear();

              return (
                <div 
                  key={day} 
                  className={`
                    border-b border-r border-slate-200/80 p-2 relative group transition-all duration-300 min-h-[140px] flex flex-col gap-2
                    ${isToday ? 'bg-indigo-50/60 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]' : 'hover:bg-white'}
                    ${isWeekend && !isToday ? 'bg-slate-50/60' : ''}
                  `}
                >
                  {/* Date Number & Add Button */}
                  <div className="flex justify-between items-start">
                    <span className={`
                      text-lg font-black w-9 h-9 flex items-center justify-center rounded-xl transition-all tabular-nums leading-none shadow-sm
                      ${isToday 
                        ? 'bg-indigo-600 text-white shadow-indigo-500/40 scale-110' 
                        : i % 7 === 0 ? 'bg-white text-rose-500 border border-slate-100' : i % 7 === 6 ? 'bg-white text-blue-500 border border-slate-100' : 'bg-white text-slate-600 border border-slate-100 group-hover:border-indigo-200'}
                    `}>
                      {day}
                    </span>
                    
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation();
                        setNewEvent({ ...newEvent, start: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` }); 
                        setIsModalOpen(true); 
                      }} 
                      className="text-slate-400 hover:text-white hover:bg-indigo-600 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 scale-90 group-hover:scale-100 shadow-lg shadow-indigo-500/20"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Events List */}
                  <div className="flex flex-col gap-1.5 mt-1 overflow-y-auto max-h-[120px] custom-scrollbar pr-1 pb-2">
                    {dayEvents.map((ev: any) => {
                      const isAssignment = ev.extendedProps?.type === 'assignment';
                      
                      return (
                        <div 
                          key={ev.id} 
                          onClick={(e) => { e.stopPropagation(); handleDelete(ev.id); }} 
                          className={`
                            relative pl-2.5 pr-2 py-2 rounded-lg border cursor-pointer 
                            hover:shadow-lg hover:-translate-y-0.5 transition-all text-[10px] font-bold truncate flex items-center gap-2
                            group/item backdrop-blur-sm
                            ${isAssignment 
                                ? 'bg-slate-100/80 border-slate-200 text-slate-500' 
                                : 'bg-white/90 border-slate-100 text-slate-700 shadow-sm'}
                          `}
                          style={!isAssignment ? { borderLeft: `3px solid ${ev.backgroundColor || ev.color}` } : {}}
                          title={ev.title}
                        >
                          <div className={`shrink-0 ${isAssignment ? 'text-slate-400' : 'text-slate-500'}`}>
                             {isAssignment ? <Layers size={10} /> : ev.color === '#10b981' ? <User size={10} /> : ev.color === '#ef4444' ? <Clock size={10} /> : <Briefcase size={10} />}
                          </div>
                          <span className="truncate flex-1">{ev.title}</span>
                          
                          {/* Hover Action */}
                          {isAssignment ? (
                            <div className="absolute right-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <AlignLeft size={10} className="text-slate-400"/>
                            </div>
                          ) : (
                            <div className="absolute right-1 opacity-0 group-hover/item:opacity-100 bg-rose-50 rounded px-1.5 py-0.5 text-rose-500 hover:bg-rose-100 transition-colors">
                              <Trash2 size={10} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Modal (Command Console) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-white/20">
              
              {/* Modal Header */}
              <div className="bg-slate-900 p-8 flex justify-between items-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none"><CalendarIcon size={120} /></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl shadow-lg backdrop-blur-sm"><Plus size={24} className="text-indigo-200"/></div>
                    <div>
                        <span className="block text-[10px] font-bold text-indigo-300 uppercase tracking-widest">New Entry</span>
                        <span className="block font-black text-xl tracking-tight">新規スケジュール登録</span>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors relative z-10"><X size={20}/></button>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">タイトル</label>
                  <input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all placeholder:text-slate-300" placeholder="例: クライアント定例会議" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">日付</label>
                    <input type="date" value={newEvent.start} onChange={e => setNewEvent({...newEvent, start: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-600 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">種別・優先度</label>
                    <div className="relative">
                        <select value={newEvent.color} onChange={e => setNewEvent({...newEvent, color: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-600 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all appearance-none cursor-pointer">
                        <option value="#3b82f6">🟦 通常 (Default)</option>
                        <option value="#ef4444">🟥 重要 (Urgent)</option>
                        <option value="#10b981">🟩 私用 (Personal)</option>
                        <option value="#f59e0b">🟧 行事 (Event)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><Layers size={14}/></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">関連スタッフ</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select value={newEvent.staffId} onChange={e => setNewEvent({...newEvent, staffId: e.target.value})} className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-600 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 transition-all appearance-none cursor-pointer">
                        <option value="">全員参加 (All Staff)</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><AlignLeft className="-rotate-90" size={14}/></div>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">詳細メモ</label>
                   <textarea 
                    value={newEvent.description} 
                    onChange={e => setNewEvent({...newEvent, description: e.target.value})} 
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-xl font-medium text-slate-600 outline-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-200 h-28 resize-none transition-all placeholder:text-slate-300 text-sm leading-relaxed" 
                    placeholder="場所、アジェンダ、備考などを入力..." 
                   />
                </div>

                <button onClick={handleCreate} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black shadow-xl shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> 予定を保存する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}