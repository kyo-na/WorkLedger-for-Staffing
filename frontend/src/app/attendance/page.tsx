'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  ChevronLeft, ChevronRight, User, FileCheck, Lock, Check, 
  Clock, AlertCircle, Calendar, ShieldCheck, PenTool, Search 
} from 'lucide-react';

export default function AttendancePage() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [days, setDays] = useState<Date[]>([]);
  
  const [monthlyStatus, setMonthlyStatus] = useState('draft');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch('http://localhost:3000/staff');
        if (res.ok) {
          const data = await res.json();
          setStaffList(data);
          if (data.length > 0) setSelectedStaffId(data[0].id);
        }
      } catch (e) { console.error(e); }
    };
    fetchStaff();
  }, []);

  const fetchData = async () => {
    if (!selectedStaffId) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const daysInMonth = new Date(year, month, 0).getDate();
    setDays(Array.from({ length: daysInMonth }, (_, i) => new Date(year, month - 1, i + 1)));

    try {
      const res = await fetch(`http://localhost:3000/attendance?staffId=${selectedStaffId}&year=${year}&month=${month}`);
      if (res.ok) setAttendanceData(await res.json());

      const resStatus = await fetch(`http://localhost:3000/attendance/status?staffId=${selectedStaffId}&year=${year}&month=${month}`);
      if (resStatus.ok) {
        const data = await resStatus.json();
        setMonthlyStatus(data.status || 'draft');
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, [selectedStaffId, currentDate]);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // 日次保存
  const handleSave = async (date: Date, field: string, value: string) => {
    if (monthlyStatus === 'approved') return;

    const dateStr = date.toISOString().split('T')[0];
    const record = attendanceData.find(a => a.date.startsWith(dateStr)) || {};
    
    const payload = {
      staffId: selectedStaffId,
      date: dateStr,
      startTime: field === 'startTime' ? value : (record.startTime ? new Date(record.startTime).toTimeString().slice(0, 5) : ''),
      endTime: field === 'endTime' ? value : (record.endTime ? new Date(record.endTime).toTimeString().slice(0, 5) : ''),
      breakTime: field === 'breakTime' ? value : (record.breakTime || 60),
      memo: field === 'memo' ? value : (record.memo || ''),
      approvalStatus: record.approvalStatus || 'draft'
    };

    await fetch('http://localhost:3000/attendance', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    
    fetchData();
  };

  // ステータス変更
  const handleDayStatusChange = async (date: Date, newStatus: string) => {
    if (monthlyStatus === 'approved') return;

    const dateStr = date.toISOString().split('T')[0];
    const record = attendanceData.find(a => a.date.startsWith(dateStr));
    if (!record) return; 

    if (record.approvalStatus === newStatus) return;

    const payload = {
      staffId: selectedStaffId,
      date: dateStr,
      startTime: record.startTime ? new Date(record.startTime).toTimeString().slice(0, 5) : '',
      endTime: record.endTime ? new Date(record.endTime).toTimeString().slice(0, 5) : '',
      breakTime: record.breakTime,
      memo: record.memo,
      approvalStatus: newStatus
    };

    await fetch('http://localhost:3000/attendance', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    fetchData(); 
  };

  const updateMonthlyStatus = async (status: string) => {
    const label = status === 'approved' ? '承認' : '申請中';
    if (!confirm(`月次ステータスを「${label}」に変更しますか？`)) return;
    await fetch('http://localhost:3000/attendance/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        staffId: selectedStaffId,
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        status
      }),
    });
    fetchData();
  };

  const calculateHours = (start?: string, end?: string, brk: number = 60) => {
    if (!start || !end) return '-';
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const work = (e - s) / (1000 * 60) - brk;
    return work < 0 ? '0.00' : (work / 60).toFixed(2);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 relative font-sans text-slate-800 bg-slate-50/50">
        
        {/* 背景装飾: テクニカルなグリッドパターン */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]" 
             style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {/* --- Command Center Header --- */}
        <div className="flex-none sticky top-0 z-40 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[20px] p-5 flex flex-col xl:flex-row items-center justify-between gap-5 ring-1 ring-slate-900/5 transition-all">
          
          {/* Left: Title & Staff Select */}
          <div className="flex items-center gap-6 w-full xl:w-auto">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                <Clock size={28} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  勤怠マネジメント
                </h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5">
                   Time Tracking Intelligence
                </p>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200 hidden sm:block opacity-50"></div>

            <div className="relative group w-full sm:w-64">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none" size={18}/>
              <select 
                value={selectedStaffId} 
                onChange={e => setSelectedStaffId(e.target.value)} 
                className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-300 transition-all appearance-none cursor-pointer hover:bg-white hover:border-slate-300"
              >
                {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronLeft className="-rotate-90" size={14}/>
              </div>
            </div>
          </div>

          {/* Center: Date Navigator */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm w-full sm:w-auto justify-between sm:justify-start">
            <button onClick={prevMonth} className="p-2.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors active:scale-95">
              <ChevronLeft size={20} strokeWidth={2.5}/>
            </button>
            <div className="px-6 py-1 text-center min-w-[140px] border-x border-slate-100">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">対象期間</span>
              <span className="block text-lg font-black text-slate-800 tabular-nums leading-none tracking-tight">
                {currentDate.getFullYear()}年 <span className="text-indigo-600">{currentDate.getMonth() + 1}月</span>
              </span>
            </div>
            <button onClick={nextMonth} className="p-2.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors active:scale-95">
              <ChevronRight size={20} strokeWidth={2.5}/>
            </button>
          </div>

          {/* Right: Monthly Status Controller */}
          <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
             <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-colors ${
               monthlyStatus === 'approved' 
                 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                 : monthlyStatus === 'applied'
                 ? 'bg-blue-50 border-blue-100 text-blue-700'
                 : 'bg-slate-50 border-slate-200 text-slate-500'
             }`}>
               <div className={`p-1.5 rounded-lg ${monthlyStatus === 'approved' ? 'bg-emerald-100' : monthlyStatus === 'applied' ? 'bg-blue-100' : 'bg-slate-200'}`}>
                  {monthlyStatus === 'approved' ? <ShieldCheck size={16}/> : monthlyStatus === 'applied' ? <FileCheck size={16}/> : <PenTool size={16}/>}
               </div>
               <div className="flex flex-col">
                 <span className="text-[9px] font-bold uppercase opacity-60 tracking-wider">Status</span>
                 <span className="text-xs font-black capitalize leading-none">
                   {monthlyStatus === 'draft' ? '作成中' : monthlyStatus === 'applied' ? '申請中' : '承認済(ロック)'}
                 </span>
               </div>
             </div>

             {monthlyStatus !== 'approved' ? (
                <button onClick={() => updateMonthlyStatus('approved')} className="flex items-center gap-2 bg-slate-900 hover:bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-slate-900/20 hover:shadow-emerald-500/30 transition-all uppercase tracking-wide active:scale-95">
                  <Check size={16} strokeWidth={3}/> 承認完了
                </button>
              ) : (
                <button onClick={() => updateMonthlyStatus('applied')} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 px-6 py-3.5 rounded-xl font-bold text-xs transition-all uppercase tracking-wide active:scale-95">
                  <Lock size={16}/> ロック解除
                </button>
              )}
          </div>
        </div>

        {/* --- Data Grid Container --- */}
        <div className={`flex-1 bg-white border border-slate-200 rounded-[24px] shadow-xl overflow-hidden flex flex-col z-10 transition-all duration-500 ring-1 ring-slate-900/5 ${monthlyStatus === 'approved' ? 'grayscale opacity-90' : ''}`}>
          
          <div className="flex-1 overflow-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <tr>
                  <th className="p-4 pl-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">日付</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-64 text-center">承認フロー</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-center">開始時刻</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-center">終了時刻</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 text-center">休憩(分)</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 text-right">実働時間</th>
                  <th className="p-4 pr-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">備考・メモ</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100">
                {days.map(day => {
                  const dateStr = day.toISOString().split('T')[0];
                  const record = attendanceData.find(a => a.date.startsWith(dateStr)) || {};
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  
                  // Status Logic
                  const currentStatus = record.approvalStatus || 'draft';
                  const startTimeStr = record.startTime ? new Date(record.startTime).toTimeString().slice(0, 5) : '';
                  const endTimeStr = record.endTime ? new Date(record.endTime).toTimeString().slice(0, 5) : '';
                  
                  const isFilled = !!(startTimeStr && endTimeStr);
                  const isLocked = monthlyStatus === 'approved';
                  const canClick = isFilled && !isLocked;

                  return (
                    <tr key={dateStr} className={`group hover:bg-slate-50/80 transition-colors ${isWeekend ? 'bg-slate-50/60' : 'bg-white'}`}>
                      
                      {/* Date Column */}
                      <td className="p-4 pl-6">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-white rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-indigo-100 transition-all">
                          <span className={`text-lg font-black tabular-nums leading-none ${
                            day.getDay() === 0 ? 'text-rose-500' : day.getDay() === 6 ? 'text-blue-500' : 'text-slate-700'
                          }`}>
                            {String(day.getDate()).padStart(2, '0')}
                          </span>
                          <span className={`text-[9px] font-bold uppercase mt-0.5 ${
                             day.getDay() === 0 ? 'text-rose-300' : day.getDay() === 6 ? 'text-blue-300' : 'text-slate-300'
                          }`}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}
                          </span>
                        </div>
                      </td>
                      
                      {/* Workflow Column (Segmented Control) */}
                      <td className="p-4">
                        <div className="flex items-center justify-center p-1 bg-slate-100 rounded-lg w-fit mx-auto shadow-inner border border-slate-200">
                          {['draft', 'applied', 'approved'].map((status) => {
                             const isActive = currentStatus === status;
                             const labels: {[key: string]: string} = { draft: '作成', applied: '申請', approved: '承認' };
                             const colors: {[key: string]: string} = { 
                               draft: 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 font-bold', 
                               applied: 'bg-blue-500 text-white shadow-md shadow-blue-500/30 font-black', 
                               approved: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 font-black' 
                             };

                             return (
                               <button
                                 key={status}
                                 onClick={() => handleDayStatusChange(day, status)}
                                 disabled={!canClick && !isActive}
                                 className={`
                                   px-4 py-1.5 rounded-[6px] text-[10px] uppercase transition-all duration-200 relative
                                   ${isActive && isFilled ? colors[status] : 'text-slate-400 hover:text-slate-600 font-medium'}
                                   ${!canClick ? 'cursor-not-allowed opacity-50' : ''}
                                 `}
                               >
                                 {labels[status]}
                               </button>
                             );
                          })}
                        </div>
                      </td>

                      {/* Time Inputs (Stealth Mode) */}
                      <td className="p-2">
                        <div className="relative group/input">
                          <input 
                            type="time" 
                            defaultValue={startTimeStr} 
                            onBlur={e => handleSave(day, 'startTime', e.target.value)} 
                            disabled={isLocked} 
                            className="w-full text-center bg-transparent border border-transparent rounded-lg py-2.5 font-mono font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 focus:shadow-sm transition-all disabled:opacity-50 hover:bg-white hover:border-slate-200 hover:shadow-sm" 
                          />
                          {!startTimeStr && !isLocked && <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 font-mono text-xs group-hover/input:hidden">--:--</div>}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="relative group/input">
                           <input 
                            type="time" 
                            defaultValue={endTimeStr} 
                            onBlur={e => handleSave(day, 'endTime', e.target.value)} 
                            disabled={isLocked} 
                            className="w-full text-center bg-transparent border border-transparent rounded-lg py-2.5 font-mono font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 focus:shadow-sm transition-all disabled:opacity-50 hover:bg-white hover:border-slate-200 hover:shadow-sm" 
                          />
                          {!endTimeStr && !isLocked && <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 font-mono text-xs group-hover/input:hidden">--:--</div>}
                        </div>
                      </td>
                      <td className="p-2">
                          <input 
                            type="number" 
                            defaultValue={record.breakTime || 60} 
                            onBlur={e => handleSave(day, 'breakTime', e.target.value)} 
                            disabled={isLocked} 
                            className="w-full text-center bg-transparent border border-transparent rounded-lg py-2.5 font-mono font-bold text-slate-500 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 focus:shadow-sm transition-all disabled:opacity-50 hover:bg-white hover:border-slate-200 hover:shadow-sm" 
                          />
                      </td>

                      {/* Total Calculation */}
                      <td className="p-4 text-right">
                        <div className={`inline-block px-3 py-1 rounded-lg font-mono font-black text-lg tabular-nums ${calculateHours(record.startTime, record.endTime, record.breakTime) !== '-' ? 'bg-slate-100 text-slate-800' : 'text-slate-200'}`}>
                          {calculateHours(record.startTime, record.endTime, record.breakTime)}
                          <span className="text-[10px] text-slate-400 ml-1 font-sans font-bold">h</span>
                        </div>
                      </td>

                      {/* Memo Input */}
                      <td className="p-4 pr-6">
                        <div className="relative">
                           <input 
                             type="text" 
                             defaultValue={record.memo || ''} 
                             onBlur={e => handleSave(day, 'memo', e.target.value)} 
                             disabled={isLocked} 
                             placeholder="備考入力..." 
                             className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 py-1.5 outline-none text-xs font-bold text-slate-600 placeholder:text-slate-300 disabled:text-slate-400 transition-colors hover:border-slate-200" 
                           />
                           {record.memo && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full pointer-events-none shadow-sm"></div>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Locked Overlay Indicator */}
          {monthlyStatus === 'approved' && (
            <div className="absolute bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900/90 backdrop-blur text-white px-5 py-3 rounded-full shadow-2xl pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Lock size={16} className="text-rose-400" />
              <span className="text-xs font-bold uppercase tracking-widest border-l border-white/20 pl-3">Read Only Mode (Approved)</span>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}