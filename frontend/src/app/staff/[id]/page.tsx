'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Save, Trash2, Mail, Phone, MapPin, Calendar, DollarSign, BookOpen, Award, Briefcase, ChevronLeft } from 'lucide-react';

export default function StaffDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  
  // スタッフデータ
  const [staff, setStaff] = useState<any>({
    name: '', email: '', phone: '', address: '', birthDate: '', status: 'active',
    salarySettings: { hourly_rate: 0, monthly_salary: 0 },
    skills: [], licenses: [], assignments: []
  });

  // マスタデータ
  const [skillMaster, setSkillMaster] = useState<any[]>([]);
  const [licenseMaster, setLicenseMaster] = useState<any[]>([]);
  
  // 入力フォーム用ステート
  const [newSkill, setNewSkill] = useState({ skillId: '', level: 'beginner', years: 1 });
  const [newLicense, setNewLicense] = useState({ licenseId: '', obtainedDate: '' });

  // データ取得
  const fetchData = async () => {
    if (!id) return;
    try {
      const [resStaff, resSkills, resLicenses] = await Promise.all([
        fetch(`http://localhost:3000/staff/${id}`),
        fetch('http://localhost:3000/skills'),
        fetch('http://localhost:3000/licenses')
      ]);

      if (resStaff.ok) {
        const data = await resStaff.json();
        // 日付形式の調整 (YYYY-MM-DD)
        if (data.birthDate) data.birthDate = new Date(data.birthDate).toISOString().split('T')[0];
        if (!data.salarySettings) data.salarySettings = { hourly_rate: 0, monthly_salary: 0 };
        setStaff(data);
      }
      
      if (resSkills.ok) setSkillMaster(await resSkills.json());
      if (resLicenses.ok) setLicenseMaster(await resLicenses.json());

    } catch (e) { console.error(e); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { if (id) fetchData(); }, [id]);

  // 基本情報保存
  const handleSave = async () => {
    try {
      await fetch(`http://localhost:3000/staff/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: staff.name, email: staff.email, phone: staff.phone, address: staff.address, status: staff.status,
          birthDate: staff.birthDate ? new Date(staff.birthDate) : null,
        }),
      });
      await fetch(`http://localhost:3000/staff/${id}/salary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hourly_rate: Number(staff.salarySettings.hourly_rate),
          monthly_salary: Number(staff.salarySettings.monthly_salary)
        }),
      });
      alert('保存しました');
    } catch (e) { alert('保存失敗'); }
  };

  const handleDelete = async () => {
    if (!confirm('削除しますか？')) return;
    await fetch(`http://localhost:3000/staff/${id}`, { method: 'DELETE' });
    router.push('/staff');
  };

  // --- スキル操作 ---
  const handleAddSkill = async () => {
    if (!newSkill.skillId) return;
    await fetch(`http://localhost:3000/staff/${id}/skills`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newSkill)
    });
    setNewSkill({ skillId: '', level: 'beginner', years: 1 });
    fetchData();
  };
  const handleDeleteSkill = async (sid: number) => {
    if (!confirm('削除しますか？')) return;
    await fetch(`http://localhost:3000/staff/${id}/skills/${sid}`, { method: 'DELETE' });
    fetchData();
  };

  // --- 資格操作 ---
  const handleAddLicense = async () => {
    if (!newLicense.licenseId) return;
    await fetch(`http://localhost:3000/staff/${id}/licenses`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newLicense)
    });
    setNewLicense({ licenseId: '', obtainedDate: '' });
    fetchData();
  };
  const handleDeleteLicense = async (lid: number) => {
    if (!confirm('削除しますか？')) return;
    await fetch(`http://localhost:3000/staff/${id}/licenses/${lid}`, { method: 'DELETE' });
    fetchData();
  };

  if (isLoading) return <div className="p-20 text-center font-bold text-slate-400">LOADING...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in pb-20 relative">
        
        {/* ヘッダー */}
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-4 z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><ChevronLeft /></button>
            <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl">
              {staff.name ? staff.name.charAt(0) : '?'}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{staff.name}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                STAFF ID: {id}
                <span className={`px-2 py-0.5 rounded-full text-[10px] text-white ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                  {staff.status === 'active' ? '在籍中' : '退職済'}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="bg-red-50 text-red-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100"><Trash2 size={18} /> 削除</button>
            <button onClick={handleSave} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700"><Save size={18} /> 保存</button>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'basic', icon: User, label: '基本情報' },
            { id: 'skills', icon: BookOpen, label: '実務スキル' },
            { id: 'licenses', icon: Award, label: '保有資格' },
            { id: 'salary', icon: DollarSign, label: '給与設定' },
            { id: 'history', icon: Briefcase, label: 'アサイン履歴' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* --- タブコンテンツ --- */}

        {/* 1. 実務スキルタブ */}
        {activeTab === 'skills' && (
          <div className="flex flex-col lg:flex-row gap-8 animate-in slide-in-from-bottom-4">
            {/* 左: フォーム */}
            <div className="w-full lg:w-1/3 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-fit">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen size={20}/></div>
                スキル選択
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">SKILL NAME</label>
                  <select value={newSkill.skillId} onChange={e => setNewSkill({...newSkill, skillId: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100 focus:ring-2 ring-indigo-500/20">
                    <option value="">マスタから選択...</option>
                    {skillMaster.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">LEVEL</label>
                    <select value={newSkill.level} onChange={e => setNewSkill({...newSkill, level: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100">
                      <option value="beginner">初級</option>
                      <option value="intermediate">中級</option>
                      <option value="advanced">上級</option>
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">YEARS</label>
                    <input type="number" value={newSkill.years} onChange={e => setNewSkill({...newSkill, years: Number(e.target.value)})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100" />
                  </div>
                </div>
                <button onClick={handleAddSkill} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-md hover:bg-slate-800 mt-2">追加</button>
              </div>
            </div>

            {/* 右: リスト */}
            <div className="flex-1 space-y-3">
              {staff.skills?.length > 0 ? staff.skills.map((s: any) => (
                <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                      {s.skills?.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800">{s.skills?.name}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{s.level}</span>
                        <span>{s.years_of_exp} Years Experience</span>
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteSkill(s.id)} className="p-2 text-slate-300 hover:text-red-500 bg-slate-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 font-bold p-10 border-2 border-dashed border-slate-200 rounded-[2rem]">実務スキルはまだありません</div>
              )}
            </div>
          </div>
        )}

        {/* 2. 保有資格タブ (リニューアル版) */}
        {activeTab === 'licenses' && (
          <div className="flex flex-col lg:flex-row gap-8 animate-in slide-in-from-bottom-4">
            {/* 左: フォーム */}
            <div className="w-full lg:w-1/3 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-fit">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Award size={20}/></div>
                資格選択
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">LICENSE NAME</label>
                  <select value={newLicense.licenseId} onChange={e => setNewLicense({...newLicense, licenseId: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100 focus:ring-2 ring-emerald-500/20">
                    <option value="">一覧から選択...</option>
                    {licenseMaster.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">OBTAINED DATE</label>
                  <input type="date" value={newLicense.obtainedDate} onChange={e => setNewLicense({...newLicense, obtainedDate: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100 text-slate-600" />
                </div>
                <button onClick={handleAddLicense} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 mt-2">資格を追加</button>
              </div>
            </div>

            {/* 右: リスト */}
            <div className="flex-1 space-y-3">
              {staff.licenses?.length > 0 ? staff.licenses.map((l: any) => (
                <div key={l.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg">
                      {l.licenses?.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800">{l.licenses?.name}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Obtained: {l.obtained_date ? new Date(l.obtained_date).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteLicense(l.id)} className="p-2 text-slate-300 hover:text-red-500 bg-slate-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 font-bold p-10 border-2 border-dashed border-slate-200 rounded-[2rem]">保有資格はまだありません</div>
              )}
            </div>
          </div>
        )}

        {/* 3. 基本情報タブ */}
        {activeTab === 'basic' && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
             <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">氏名</label>
              <input value={staff.name} onChange={e => setStaff({...staff, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">Email</label>
              <input value={staff.email} onChange={e => setStaff({...staff, email: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">電話番号</label>
              <input value={staff.phone || ''} onChange={e => setStaff({...staff, phone: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">住所</label>
              <input value={staff.address || ''} onChange={e => setStaff({...staff, address: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600" />
            </div>
          </div>
        )}

        {/* 4. 給与設定タブ */}
        {activeTab === 'salary' && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2"><DollarSign className="text-indigo-600"/> 給与条件</h3>
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">時給</label>
                <input type="number" value={staff.salarySettings?.hourly_rate || 0} onChange={e => setStaff({...staff, salarySettings: {...staff.salarySettings, hourly_rate: e.target.value}})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600 text-lg" />
              </div>
               <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">月給</label>
                <input type="number" value={staff.salarySettings?.monthly_salary || 0} onChange={e => setStaff({...staff, salarySettings: {...staff.salarySettings, monthly_salary: e.target.value}})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600 text-lg" />
              </div>
            </div>
          </div>
        )}

        {/* 5. アサイン履歴 */}
        {activeTab === 'history' && (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4">
             <div className="space-y-4">
               {staff.assignments?.map((assign: any) => (
                 <div key={assign.id} className="flex items-center justify-between p-4 border-l-4 border-indigo-500 bg-slate-50 rounded-r-xl">
                    <div>
                      <h4 className="font-black text-slate-800">{assign.project?.name}</h4>
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        {new Date(assign.startDate).toLocaleDateString()} - {assign.endDate ? new Date(assign.endDate).toLocaleDateString() : '現在'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${assign.isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                      {assign.isActive ? '稼働中' : '終了'}
                    </span>
                 </div>
               ))}
               {(!staff.assignments || staff.assignments.length === 0) && (
                 <p className="text-center text-slate-400 font-bold py-10">アサイン履歴はありません</p>
               )}
             </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}