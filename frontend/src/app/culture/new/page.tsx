'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Brain, User, Save, CheckCircle2, Search, Sliders, 
  MessageSquare, Loader2, ChevronRight, Users, UserPlus, ArrowLeft,
  Activity, Fingerprint, Sparkles
} from 'lucide-react';

export default function CultureEditPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // モード管理フラグ
  const [isNewMode, setIsNewMode] = useState(false);

  // ダミーデータ
  const [staffList, setStaffList] = useState([
    { id: 1, name: '山本 大介', type: 'ムードメーカー型' },
    { id: 2, name: '加藤 さくら', type: '職人・スペシャリスト型' },
    { id: 3, name: '中村 翔太', type: 'バランサー・調整型' },
  ]);

  const emptyForm = {
    staffId: null as number | null,
    staffName: '',
    type: 'バランサー・調整型',
    traits: { agreeableness: 50, extraversion: 50, conscientiousness: 50, openness: 50, stability: 50 },
    aiNote: ''
  };

  const [formData, setFormData] = useState(emptyForm);

  // 新規追加モード開始
  const handleStartNew = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNewMode(true);
    setFormData({ ...emptyForm });
  };

  // スタッフ選択（編集モード）
  const handleSelectStaff = (staff: any) => {
    setIsNewMode(false);
    setFormData({
      ...emptyForm,
      staffId: staff.id,
      staffName: staff.name,
      type: staff.type as any,
      // 本来はAPIから取得する値をセット
      traits: { agreeableness: 60, extraversion: 45, conscientiousness: 70, openness: 55, stability: 40 },
    });
  };

  const handleSave = async () => {
    if (!formData.staffName) return alert("氏名を入力してください");
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // 保存後はリストモードに戻すなどの処理
    if (isNewMode) setIsNewMode(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in pb-20 relative font-sans text-slate-800 bg-slate-50/50">
        
        {/* 背景装飾: テクニカル・グリッド */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* 通知トースト */}
        {showToast && (
          <div className="fixed top-10 right-10 z-[100] bg-slate-900/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] flex items-center gap-4 animate-in slide-in-from-right-10 border border-white/10 ring-1 ring-white/10">
            <div className="p-2 bg-emerald-500/20 rounded-full">
              <CheckCircle2 className="text-emerald-400" size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">{isNewMode ? 'データベースに新規登録しました' : 'プロファイル情報を更新しました'}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">System Update Successful</p>
            </div>
          </div>
        )}

        {/* ヘッダーコンソール */}
        <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] p-5 flex flex-col md:flex-row justify-between items-center gap-6 ring-1 ring-slate-900/5 transition-all">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
              <Brain size={28} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                価値観モデリング
                {isNewMode && <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded border border-indigo-200 uppercase tracking-wider">New Entry Mode</span>}
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1.5">
                <Activity size={10} /> Psychometrics & Culture Fit Engine
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleSave} 
            disabled={isSaving || !formData.staffName}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 hover:shadow-indigo-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] text-xs uppercase tracking-wide group"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="group-hover:scale-110 transition-transform"/>}
            {isNewMode ? 'プロファイルを登録' : '変更を保存'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* 左サイド: ディレクトリ (isNewMode時はフォーカスモードのため薄くなる) */}
          <div className={`lg:col-span-4 transition-all duration-500 ease-in-out ${isNewMode ? 'opacity-30 pointer-events-none scale-95 blur-[1px]' : 'opacity-100 scale-100'}`}>
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Users size={14}/> Staff Directory
                  </h3>
                  <button 
                    type="button"
                    onClick={handleStartNew}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                  >
                    <UserPlus size={12} /> 新規作成
                  </button>
                </div>

                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="名前で検索..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-bold text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300" 
                  />
                </div>
              </div>

              <div className="p-2 max-h-[600px] overflow-y-auto custom-scrollbar space-y-1">
                {staffList.filter(s => s.name.includes(searchTerm)).map((staff) => (
                  <button 
                    key={staff.id} 
                    onClick={() => handleSelectStaff(staff)} 
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                      formData.staffId === staff.id 
                        ? 'bg-indigo-50 border-indigo-200 shadow-inner' 
                        : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${formData.staffId === staff.id ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                        {staff.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <span className={`block font-bold text-sm ${formData.staffId === staff.id ? 'text-indigo-900' : 'text-slate-700'}`}>{staff.name}</span>
                        <span className="block text-[10px] text-slate-400 font-medium truncate max-w-[120px]">{staff.type}</span>
                      </div>
                    </div>
                    {formData.staffId === staff.id && <ChevronRight size={16} className="text-indigo-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右サイド: コントロールパネル */}
          <div className={`${isNewMode ? 'lg:col-span-12' : 'lg:col-span-8'} transition-all duration-500 space-y-6`}>
            
            {isNewMode && (
              <button onClick={() => setIsNewMode(false)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-wide transition-colors mb-2 group">
                <div className="p-1 rounded-full bg-slate-100 group-hover:bg-indigo-100 transition-colors"><ArrowLeft size={14} /></div>
                ディレクトリに戻る
              </button>
            )}

            {/* 基本情報パネル */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 ring-1 ring-slate-900/5">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                   <Fingerprint size={18} className="text-indigo-500"/>
                   <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Identity Profile</h3>
                </div>

                <div className={`grid grid-cols-1 ${isNewMode ? 'md:grid-cols-2 gap-8' : 'md:grid-cols-1 xl:grid-cols-2 gap-8'}`}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Staff Name</label>
                    <div className="relative group">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"/>
                      <input 
                        type="text" 
                        value={formData.staffName}
                        onChange={(e) => setFormData({...formData, staffName: e.target.value})}
                        placeholder="氏名を入力..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 font-bold text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-base"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Personality Type</label>
                    <div className="relative group">
                      <Sliders size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"/>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 font-bold text-slate-800 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-base appearance-none cursor-pointer"
                      >
                        <option>ムードメーカー型</option>
                        <option>職人・スペシャリスト型</option>
                        <option>バランサー・調整型</option>
                        <option>リーダー・牽引型</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={16}/>
                    </div>
                  </div>
                </div>
            </div>

            {/* パラメータ・イコライザー */}
            <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Activity size={120}/></div>
              
              <div className="flex items-center gap-2 mb-10">
                 <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Activity size={20}/></div>
                 <div>
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Psychometrics Equalizer</h3>
                   <p className="text-[10px] text-slate-400 font-bold">5-Factor Model Adjustment</p>
                 </div>
              </div>

              <div className={`grid grid-cols-1 ${isNewMode ? 'md:grid-cols-2 gap-x-12' : 'gap-y-8'} gap-y-10 relative z-10`}>
                {(Object.keys(formData.traits) as Array<keyof typeof formData.traits>).map((key) => {
                  const value = formData.traits[key];
                  const labels: Record<string, string> = {
                    agreeableness: '協調性 (Agreeableness)',
                    extraversion: '外交性 (Extraversion)',
                    conscientiousness: '誠実性 (Conscientiousness)',
                    openness: '開放性 (Openness)',
                    stability: '情緒安定 (Stability)'
                  };
                  
                  return (
                    <div key={key} className="space-y-4 group">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-300 transition-colors uppercase tracking-widest">
                          {labels[key]}
                        </label>
                        <span className="font-mono font-black text-3xl text-white tabular-nums tracking-tighter">
                          {value}<span className="text-sm text-slate-600 ml-1 font-bold">%</span>
                        </span>
                      </div>
                      
                      <div className="relative h-14 flex items-center">
                        {/* Track Container */}
                        <div className="absolute inset-x-0 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                          {/* Gradient Bar */}
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-900 via-indigo-600 to-indigo-400 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                        
                        {/* Native Input Overlay (Invisible but clickable) */}
                        <input 
                          type="range" min="0" max="100" 
                          value={value} 
                          onChange={(e) => setFormData({...formData, traits: { ...formData.traits, [key]: parseInt(e.target.value) }})} 
                          className="relative z-20 w-full h-full opacity-0 cursor-pointer" 
                        />
                        
                        {/* Custom Thumb (Follows value) */}
                        <div 
                          className="absolute h-8 w-8 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] border-4 border-indigo-600 pointer-events-none transition-all duration-100 ease-out z-10 flex items-center justify-center group-hover:scale-110"
                          style={{ left: `calc(${value}% - 16px)` }}
                        >
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI インテリジェンス・ログ */}
            <div className="bg-slate-900 p-8 md:p-10 rounded-[32px] shadow-2xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                
                <div className="relative z-10">
                  <h3 className="font-black text-indigo-300 mb-6 flex items-center gap-2 text-xs uppercase tracking-widest">
                    <Sparkles size={16}/> AI Intelligence Log (Private)
                  </h3>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-indigo-400/50" size={18} />
                    <textarea 
                      value={formData.aiNote}
                      onChange={(e) => setFormData({...formData, aiNote: e.target.value})}
                      className="w-full h-32 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 pl-12 font-medium text-slate-200 placeholder:text-slate-600 outline-none focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm leading-relaxed resize-none"
                      placeholder="期待する役割、現場での性格的な相性、特記事項などを入力してください..."
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-3 text-right font-mono">ENCRYPTED // INTERNAL USE ONLY</p>
                </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}