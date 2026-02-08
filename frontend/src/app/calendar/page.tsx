'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ChevronLeft, ChevronRight, Plus, X, User } from 'lucide-react';

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
       // startがDate型か文字列かで処理を分ける、または統一する
       const startStr = typeof e.start === 'string' ? e.start : new Date(e.start).toISOString();
       return startStr.startsWith(targetDateStr);
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">COMPANY<span className="text-indigo-600">CALENDAR</span></h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">全社稼働カレンダー</p>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all text-sm">
              <Plus size={18} /> 予定を追加
            </button>
            <div className="flex items-center gap-4 bg-slate-100 p-1.5 rounded-xl">
              <button onClick={prevMonth} className="p-2 bg-white rounded-lg shadow-sm hover:bg-indigo-50 hover:text-indigo-600"><ChevronLeft size={18}/></button>
              <span className="font-black text-lg w-32 text-center text-slate-700">{year}年 {month + 1}月</span>
              <button onClick={nextMonth} className="p-2 bg-white rounded-lg shadow-sm hover:bg-indigo-50 hover:text-indigo-600"><ChevronRight size={18}/></button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
              <div key={day} className={`p-4 text-center font-black text-xs tracking-widest ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 flex-1 auto-rows-fr overflow-y-auto">
            {calendarCells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="bg-slate-50/30 border-b border-r border-slate-100" />;
              
              const dayEvents = getEventsForDay(day as number);
              const isWeekend = (i % 7 === 0) || (i % 7 === 6);

              return (
                <div key={day} className={`border-b border-r border-slate-100 p-2 relative group hover:bg-slate-50 transition-colors min-h-[100px] flex flex-col gap-1 ${isWeekend ? 'bg-slate-50/40' : ''}`}>
                  <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${i % 7 === 0 ? 'text-red-500' : i % 7 === 6 ? 'text-blue-500' : 'text-slate-700'}`}>{day}</span>
                  <div className="space-y-1">
                    {dayEvents.map((ev: any) => (
                      <div key={ev.id} onClick={() => handleDelete(ev.id)} className="text-[10px] font-bold text-white px-2 py-1 rounded-md shadow-sm cursor-pointer hover:brightness-110 truncate flex items-center gap-1" style={{ backgroundColor: ev.backgroundColor }} title={ev.title}>
                         {/* アサインかイベントかでアイコンを変えたりも可能 */}
                         {ev.extendedProps?.type === 'assignment' ? '💼' : <User size={8} className="shrink-0" />} {ev.title}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setNewEvent({ ...newEvent, start: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` }); setIsModalOpen(true); }} className="absolute top-2 right-2 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={16} /></button>
                </div>
              );
            })}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white p-8 rounded-[2rem] w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">予定登録</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400 hover:text-slate-600"/></button>
              </div>
              <div className="space-y-4">
                <input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100" placeholder="タイトル (例: 全社MTG)" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={newEvent.start} onChange={e => setNewEvent({...newEvent, start: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100 text-slate-600" />
                  <select value={newEvent.color} onChange={e => setNewEvent({...newEvent, color: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100 text-slate-600">
                    <option value="#3b82f6">🟦 通常</option>
                    <option value="#ef4444">🟥 休日</option>
                    <option value="#10b981">🟩 重要な日</option>
                  </select>
                </div>
                <select value={newEvent.staffId} onChange={e => setNewEvent({...newEvent, staffId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100 text-slate-600">
                    <option value="">(全体予定)</option>
                    {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100 h-20 resize-none" placeholder="詳細メモ..." />
                <button onClick={handleCreate} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800">保存</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}