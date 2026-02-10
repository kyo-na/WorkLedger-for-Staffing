'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  User, Save, Trash2, Mail, Phone, MapPin, Calendar, 
  DollarSign, BookOpen, Award, Briefcase, ChevronLeft, 
  Check, X, TrendingUp, ShieldCheck, Star, Activity, Loader2
} from 'lucide-react';

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
      // ダミーデータ（APIの代わり）
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dummyStaff = {
        id: id,
        name: '山田 太郎',
        email: 'taro.yamada@example.com',
        phone: '090-1234-5678',
        address: '東京都渋谷区神南1-1-1',
        birthDate: '1990-05-15',
        status: 'active',
        salarySettings: { hourly_rate: 2500, monthly_salary: 400000 },
        skills: [
          { id: 1, level: 'advanced', years_of_exp: 5, skills: { name: 'React' } },
          { id: 2, level: 'intermediate', years_of_exp: 3, skills: { name: 'TypeScript' } }
        ],
        licenses: [
          { id: 1, obtained_date: '2022-04-01', licenses: { name: '応用情報技術者' } }
        ],
        assignments: [
          { id: 1, startDate: '2023-04-01', endDate: null, isActive: true, project: { name: '次世代ECプラットフォーム構築' } },
          { id: 2, startDate: '2021-01-01', endDate: '2023-03-31', isActive: false, project: { name: '社内管理システム刷新' } }
        ]
      };
      const dummySkills = [
        { id: '1', name: 'React' }, { id: '2', name: 'TypeScript' }, { id: '3', name: 'Python' }
      ];
      const dummyLicenses = [
        { id: '1', name: '基本情報技術者' }, { id: '2', name: '応用情報技術者' }, { id: '3', name: 'AWS SAA' }
      ];

      setStaff(dummyStaff);
      setSkillMaster(dummySkills);
      setLicenseMaster(dummyLicenses);

    } catch (e) { console.error(e); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { if (id) fetchData(); }, [id]);

  // 基本情報保存
  const handleSave = async () => {
    try {
      // APIコール（シミュレーション）
      console.log('Saving staff:', staff);
      alert('保存しました');
    } catch (e) { alert('保存失敗'); }
  };

  const handleDelete = async () => {
    if (!confirm('削除しますか？')) return;
    // APIコール（シミュレーション）
    console.log('Deleting staff:', id);
    router.push('/staff');
  };

  // --- スキル操作 ---
  const handleAddSkill = async () => {
    if (!newSkill.skillId) return;
    // APIコール（シミュレーション）
    console.log('Adding skill:', newSkill);
    setNewSkill({ skillId: '', level: 'beginner', years: 1 });
    fetchData(); // 実際はここで再取得
  };
  const handleDeleteSkill = async (sid: number) => {
    if (!confirm('削除しますか？')) return;
    // APIコール（シミュレーション）
    console.log('Deleting skill:', sid);
    fetchData();
  };

  // --- 資格操作 ---
  const handleAddLicense = async () => {
    if (!newLicense.licenseId) return;
    // APIコール（シミュレーション）
    console.log('Adding license:', newLicense);
    setNewLicense({ licenseId: '', obtainedDate: '' });
    fetchData();
  };
  const handleDeleteLicense = async (lid: number) => {
    if (!confirm('削除しますか？')) return;
    // APIコール（シミュレーション）
    console.log('Deleting license:', lid);
    fetchData();
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-400 font-bold text-xs tracking-widest animate-pulse">LOADING PROFILE...</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 animate-in fade-in pb-20 relative min-h-screen font-sans text-slate-800 bg-slate-50/50">
        
        {/* 背景装飾 */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        {/* --- Header: インテリジェンス・コントロールバー --- */}
        <div className="sticky top-4 z-40 mx-4 md:mx-auto max-w-6xl w-full">
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 transition-all ring-1 ring-slate-900/5">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button onClick={() => router.back()} className="p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-slate-100 group active:scale-95">
                <ChevronLeft size={20} className="text-slate-400 group-hover:text-slate-700"/>
              </button>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                    {staff.name ? staff.name.charAt(0) : '?'}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                    {staff.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-mono">ID: {String(staff.id).padStart(4, '0')}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${staff.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                      <Activity size={10} /> {staff.status === 'active' ? 'Active Staff' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button 
                onClick={handleDelete} 
                className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs uppercase tracking-wide flex items-center gap-2 group active:scale-95"
              >
                <Trash2 size={16} className="group-hover:scale-110 transition-transform" /> 
                <span className="hidden md:inline">削除</span>
              </button>
              <div className="h-8 w-px bg-slate-200 hidden md:block opacity-50"></div>
              <button 
                onClick={handleSave} 
                className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-widest active:scale-95 group"
              >
                <Save size={16} className="group-hover:scale-110 transition-transform" /> 保存
              </button>
            </div>
          </div>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 relative z-10">
          
          {/* Left Column: Sidebar Navigation & Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
              
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Navigation</p>
                <div className="space-y-2">
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
                      className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 ${
                        activeTab === tab.id 
                        ? 'bg-indigo-50 text-indigo-700 shadow-inner' 
                        : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <tab.icon size={18} className={activeTab === tab.id ? 'text-indigo-500' : 'text-slate-400'}/>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Project History Summary</p>
                <div className="space-y-3">
                  {staff.assignments?.slice(0, 3).map((assign: any) => (
                    <div key={assign.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${assign.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <div>
                        <h4 className="font-bold text-slate-700 text-xs leading-tight">{assign.project?.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{assign.startDate.substring(0, 7)} ~</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Forms */}
          <div className="lg:col-span-8">
            {/* 1. 基本情報タブ */}
            {activeTab === 'basic' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* プロフィールカード */}
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-[10rem] -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700 pointer-events-none"></div>
                   
                   <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8 relative z-10">
                     <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><User size={20}/></div>
                     <h3 className="text-lg font-black text-slate-800">Personal Information</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                     <div className="space-y-2 group">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-indigo-600 transition-colors">氏名</label>
                       <input 
                         value={staff.name} 
                         onChange={e => setStaff({...staff, name: e.target.value})} 
                         className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                       />
                     </div>
                     
                     <div className="space-y-2 group">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-indigo-600 transition-colors">生年月日</label>
                       <div className="relative">
                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
                         <input 
                           type="date" 
                           value={staff.birthDate || ''} 
                           onChange={e => setStaff({...staff, birthDate: e.target.value})} 
                           className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                         />
                       </div>
                     </div>

                     <div className="space-y-2 group md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-indigo-600 transition-colors">住所</label>
                       <div className="relative">
                         <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
                         <input 
                           value={staff.address || ''} 
                           onChange={e => setStaff({...staff, address: e.target.value})} 
                           className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                           placeholder="未設定" 
                         />
                       </div>
                     </div>
                   </div>
                </div>

                {/* 連絡先カード */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
                     <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Phone size={20}/></div>
                     <h3 className="text-lg font-black text-slate-800">Contact Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-emerald-600 transition-colors">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
                        <input 
                          value={staff.email} 
                          onChange={e => setStaff({...staff, email: e.target.value})} 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-emerald-600 transition-colors">電話番号</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
                        <input 
                          value={staff.phone || ''} 
                          onChange={e => setStaff({...staff, phone: e.target.value})} 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                          placeholder="未設定" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 実務スキルタブ */}
            {activeTab === 'skills' && (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* フォームエリア */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 leading-tight">スキル登録</h3>
                      <p className="text-[10px] text-slate-500 font-bold">ADD NEW SKILL</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-5 space-y-1 group">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">SKILL NAME</label>
                      <select value={newSkill.skillId} onChange={e => setNewSkill({...newSkill, skillId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-700 transition-all">
                        <option value="">スキルを選択...</option>
                        {skillMaster.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>

                    <div className="md:col-span-3 space-y-1 group">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">LEVEL</label>
                      <select value={newSkill.level} onChange={e => setNewSkill({...newSkill, level: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-200 text-slate-700">
                        <option value="beginner">初級</option>
                        <option value="intermediate">中級</option>
                        <option value="advanced">上級</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2 space-y-1 group">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">YEARS</label>
                      <div className="relative">
                        <input type="number" value={newSkill.years} onChange={e => setNewSkill({...newSkill, years: Number(e.target.value)})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-200 text-slate-700 text-center" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">年</span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                        <button onClick={handleAddSkill} className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold shadow-md hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                            <Check size={16} /> 追加
                        </button>
                    </div>
                  </div>
                </div>

                {/* リストエリア */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff.skills?.length > 0 ? staff.skills.map((s: any) => (
                    <div key={s.id} className="group bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-[0_8px_30px_rgb(79,70,229,0.1)] transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button onClick={() => handleDeleteSkill(s.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16}/></button>
                      </div>

                      <div className="flex items-start gap-4 relative z-0">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl border border-indigo-100">
                          {s.skills?.name?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-slate-800 text-lg leading-tight">{s.skills?.name}</h4>
                          <div className="flex items-center gap-3 mt-2">
                            {/* レベルメーター */}
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map(lvl => (
                                <div key={lvl} className={`w-6 h-1.5 rounded-full ${
                                  (s.level === 'beginner' && lvl <= 1) || 
                                  (s.level === 'intermediate' && lvl <= 2) || 
                                  (s.level === 'advanced' && lvl <= 3) 
                                  ? 'bg-indigo-500' : 'bg-slate-200'
                                }`}></div>
                              ))}
                            </div>
                            <span className="text-xs font-bold text-slate-400">{s.years_of_exp} Years</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
                      <BookOpen size={48} className="text-slate-300 mb-4" />
                      <p className="font-bold">登録されたスキルはありません</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. 保有資格タブ */}
            {activeTab === 'licenses' && (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 leading-tight">資格登録</h3>
                      <p className="text-[10px] text-slate-500 font-bold">ADD LICENSE</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-6 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">LICENSE NAME</label>
                      <select value={newLicense.licenseId} onChange={e => setNewLicense({...newLicense, licenseId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-700 transition-all">
                        <option value="">資格を選択...</option>
                        {licenseMaster.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">OBTAINED DATE</label>
                      <input type="date" value={newLicense.obtainedDate} onChange={e => setNewLicense({...newLicense, obtainedDate: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-200 text-slate-600" />
                    </div>
                    <div className="md:col-span-2">
                        <button onClick={handleAddLicense} className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold shadow-md hover:bg-emerald-600 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                            <Check size={16} /> 追加
                        </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {staff.licenses?.length > 0 ? staff.licenses.map((l: any) => (
                    <div key={l.id} className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xl border border-emerald-100 relative overflow-hidden">
                          <span className="relative z-10"><Award size={24}/></span>
                          <div className="absolute inset-0 bg-emerald-200/20 rounded-2xl rotate-45 transform translate-y-8"></div>
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-lg">{l.licenses?.name}</h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2 mt-1">
                            <Check size={12} className="text-emerald-500"/>
                            Obtained: {l.obtained_date ? new Date(l.obtained_date).toLocaleDateString() : 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteLicense(l.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20}/></button>
                    </div>
                  )) : (
                     <div className="py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
                       <Award size={48} className="text-slate-300 mb-4" />
                       <p className="font-bold">保有資格はありません</p>
                     </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. 給与設定タブ */}
            {activeTab === 'salary' && (
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                
                <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8 relative z-10">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><DollarSign size={24}/></div>
                    <h3 className="text-lg font-black text-slate-800">Compensation Settings</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                   <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-200 group focus-within:ring-4 ring-indigo-500/10 focus-within:border-indigo-500 transition-all">
                     <div className="flex items-center justify-between mb-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hourly Rate</label>
                       <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-400">時給</span>
                     </div>
                     <div className="flex items-baseline gap-1">
                       <span className="text-2xl font-medium text-slate-400">¥</span>
                       <input 
                         type="number" 
                         value={staff.salarySettings?.hourly_rate || 0} 
                         onChange={e => setStaff({...staff, salarySettings: {...staff.salarySettings, hourly_rate: e.target.value}})} 
                         className="w-full bg-transparent font-black text-4xl text-slate-800 outline-none placeholder:text-slate-200" 
                       />
                     </div>
                   </div>

                   <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-200 group focus-within:ring-4 ring-indigo-500/10 focus-within:border-indigo-500 transition-all">
                     <div className="flex items-center justify-between mb-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly Salary</label>
                       <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-400">月給</span>
                     </div>
                     <div className="flex items-baseline gap-1">
                       <span className="text-2xl font-medium text-slate-400">¥</span>
                       <input 
                         type="number" 
                         value={staff.salarySettings?.monthly_salary || 0} 
                         onChange={e => setStaff({...staff, salarySettings: {...staff.salarySettings, monthly_salary: e.target.value}})} 
                         className="w-full bg-transparent font-black text-4xl text-slate-800 outline-none placeholder:text-slate-200" 
                       />
                     </div>
                   </div>
                </div>
              </div>
            )}

            {/* 5. アサイン履歴 */}
            {activeTab === 'history' && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <div className="space-y-0 relative">
                   {/* タイムラインの縦線 */}
                   <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100"></div>

                   {staff.assignments?.map((assign: any, idx: number) => (
                     <div key={assign.id} className="relative pl-16 py-4 group">
                       {/* タイムラインのドット */}
                       <div className={`absolute left-[1.15rem] top-8 w-5 h-5 rounded-full border-4 border-white shadow-sm z-10 transition-colors ${assign.isActive ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                       
                       <div className="bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg rounded-2xl p-5 transition-all duration-300">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div>
                             <div className="flex items-center gap-2 mb-1">
                               <span className="text-xs font-bold font-mono text-slate-400">
                                 {new Date(assign.startDate).toLocaleDateString()} - {assign.endDate ? new Date(assign.endDate).toLocaleDateString() : '現在'}
                               </span>
                               {assign.isActive && (
                                 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-600 flex items-center gap-1">
                                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                                   稼働中
                                 </span>
                               )}
                             </div>
                             <h4 className="font-black text-xl text-slate-800">{assign.project?.name}</h4>
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400 group-hover:text-indigo-600 transition-colors">
                               <Briefcase size={20} />
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   ))}
                   
                   {(!staff.assignments || staff.assignments.length === 0) && (
                     <div className="text-center py-20">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                         <Briefcase size={32} />
                       </div>
                       <p className="text-slate-400 font-bold">アサイン履歴はありません</p>
                     </div>
                   )}
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}