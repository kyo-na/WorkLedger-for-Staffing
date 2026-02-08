'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ChevronLeft, ChevronRight, User, FileCheck, Lock, Check } from 'lucide-react';

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

  // 日次保存 (時間入力など)
  const handleSave = async (date: Date, field: string, value: string) => {
    if (monthlyStatus === 'approved') return;

    const dateStr = date.toISOString().split('T')[0];
    const record = attendanceData.find(a => a.date.startsWith(dateStr)) || {};
    
    // 現在の値を維持しつつ更新
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
    
    // ★重要: 保存後にデータを再取得して、ボタンを有効化させる
    fetchData();
  };

  // ステータス変更
  const handleDayStatusChange = async (date: Date, newStatus: string) => {
    if (monthlyStatus === 'approved') return;

    const dateStr = date.toISOString().split('T')[0];
    const record = attendanceData.find(a => a.date.startsWith(dateStr));
    if (!record) return; 

    // 同じステータスなら変更しない
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
    if (!confirm(`月次ステータスを「${status.toUpperCase()}」に変更しますか？`)) return;
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
      <div className="space-y-6 animate-in fade-in pb-20">
        
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">ATTENDANCE<span className="text-indigo-600">SHEET</span></h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">勤務表・勤怠管理</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={16}/>
              <select value={selectedStaffId} onChange={e => setSelectedStaffId(e.target.value)} className="pl-10 pr-4 py-2 bg-white rounded-xl font-bold outline-none border border-slate-200 text-sm w-48 focus:ring-2 ring-indigo-500/20">
                {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-white rounded-lg"><ChevronLeft size={16}/></button>
              <span className="font-black text-slate-700 w-32 text-center">{currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月</span>
              <button onClick={nextMonth} className="p-2 hover:bg-white rounded-lg"><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>

        {/* 月次操作バー */}
        <div className="bg-slate-900 text-white p-4 rounded-[1.5rem] shadow-lg flex items-center justify-between">
           <div className="flex items-center gap-4 px-2">
             <div className={`p-2 rounded-lg ${monthlyStatus === 'approved' ? 'bg-emerald-500' : 'bg-slate-700'}`}>
               {monthlyStatus === 'approved' ? <Lock size={20}/> : <FileCheck size={20}/>}
             </div>
             <div>
               <p className="text-[10px] font-bold opacity-70 uppercase">MONTHLY STATUS</p>
               <p className="font-bold text-lg capitalize">{monthlyStatus === 'draft' ? 'Inputting (作成中)' : monthlyStatus === 'applied' ? 'Applied (申請中)' : 'Approved (承認済)'}</p>
             </div>
           </div>
           <div className="flex gap-2">
             {monthlyStatus !== 'approved' ? (
                <button onClick={() => updateMonthlyStatus('approved')} className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                  <Check size={16}/> 月次一括承認
                </button>
             ) : (
                <button onClick={() => updateMonthlyStatus('applied')} className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all">
                  ロック解除
                </button>
             )}
           </div>
        </div>

        {/* 勤怠テーブル */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-black text-slate-400 uppercase w-20">Date</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase w-64 text-center">Workflow</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase w-32">Start</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase w-32">End</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase w-24">Break</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase w-24">Total</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase">Memo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {days.map(day => {
                  const dateStr = day.toISOString().split('T')[0];
                  const record = attendanceData.find(a => a.date.startsWith(dateStr)) || {};
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  
                  // 現在のステータス (デフォルト: draft)
                  const currentStatus = record.approvalStatus || 'draft';
                  
                  const startTimeStr = record.startTime ? new Date(record.startTime).toTimeString().slice(0, 5) : '';
                  const endTimeStr = record.endTime ? new Date(record.endTime).toTimeString().slice(0, 5) : '';

                  // ★時間が入力されているか
                  const isFilled = !!(startTimeStr && endTimeStr);
                  // ★月次ロック
                  const isLocked = monthlyStatus === 'approved';
                  // ★操作可能か (入力済 かつ ロックされていない)
                  const canClick = isFilled && !isLocked;

                  // ★選択状態の判定 (排他制御かつ、入力がある場合のみ色を付ける)
                  const isDraft = isFilled && currentStatus === 'draft';
                  const isApplied = isFilled && currentStatus === 'applied';
                  const isApproved = isFilled && currentStatus === 'approved';

                  return (
                    <tr key={dateStr} className={`hover:bg-slate-50/50 transition-colors ${isWeekend ? 'bg-slate-50/30' : ''}`}>
                      <td className="p-4 font-bold text-slate-700">
                        <span className={`inline-block w-6 ${day.getDay() === 0 ? 'text-red-400' : day.getDay() === 6 ? 'text-blue-400' : ''}`}>{day.getDate()}</span>
                        <span className="text-xs text-slate-400 ml-1">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}</span>
                      </td>
                      
                      {/* ワークフローボタン */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1">
                           
                           {/* 決定 */}
                           <button
                             onClick={() => handleDayStatusChange(day, 'draft')}
                             disabled={!canClick}
                             className={`px-3 py-1 rounded-l-lg text-[10px] font-black uppercase border-r transition-all
                             ${isDraft 
                               ? 'bg-slate-800 text-white hover:bg-slate-700' 
                               : 'bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-slate-400'}`}>
                             決定
                           </button>
                           
                           {/* 申請 */}
                           <button 
                             onClick={() => handleDayStatusChange(day, 'applied')}
                             disabled={!canClick}
                             className={`px-3 py-1 text-[10px] font-black uppercase border-r transition-all
                             ${isApplied 
                               ? 'bg-blue-500 text-white hover:bg-blue-600' 
                               : 'bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-slate-400'}`}>
                             申請
                           </button>

                           {/* 承認 */}
                           <button 
                             onClick={() => handleDayStatusChange(day, 'approved')}
                             disabled={!canClick}
                             className={`px-3 py-1 rounded-r-lg text-[10px] font-black uppercase transition-all
                             ${isApproved 
                               ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                               : 'bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-slate-400'}`}>
                             承認
                           </button>
                        </div>
                      </td>

                      <td className="p-4">
                        <input type="time" defaultValue={startTimeStr} onBlur={e => handleSave(day, 'startTime', e.target.value)} disabled={isLocked} className="bg-slate-100 rounded-lg px-2 py-1 font-bold text-slate-700 focus:bg-white focus:ring-2 ring-indigo-500/20 w-full outline-none disabled:bg-transparent" />
                      </td>
                      <td className="p-4">
                        <input type="time" defaultValue={endTimeStr} onBlur={e => handleSave(day, 'endTime', e.target.value)} disabled={isLocked} className="bg-slate-100 rounded-lg px-2 py-1 font-bold text-slate-700 focus:bg-white focus:ring-2 ring-indigo-500/20 w-full outline-none disabled:bg-transparent" />
                      </td>
                      <td className="p-4">
                        <input type="number" defaultValue={record.breakTime || 60} onBlur={e => handleSave(day, 'breakTime', e.target.value)} disabled={isLocked} className="bg-slate-100 rounded-lg px-2 py-1 font-bold text-slate-700 focus:bg-white focus:ring-2 ring-indigo-500/20 w-full outline-none text-center disabled:bg-transparent" />
                      </td>
                      <td className="p-4 font-black text-slate-800">{calculateHours(record.startTime, record.endTime, record.breakTime)}</td>
                      <td className="p-4"><input type="text" defaultValue={record.memo || ''} onBlur={e => handleSave(day, 'memo', e.target.value)} disabled={isLocked} placeholder="備考..." className="bg-transparent border-b border-transparent focus:border-indigo-300 w-full outline-none text-sm font-bold text-slate-600 disabled:text-slate-400" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}