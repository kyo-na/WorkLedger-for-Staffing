'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Brain, User, Save, CheckCircle2, Search, Sliders, 
  MessageSquare, Loader2, ChevronRight, Users, UserPlus, ArrowLeft 
} from 'lucide-react';

export default function CultureEditPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // ★重要: モード管理フラグ
  const [isNewMode, setIsNewMode] = useState(false);

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

  // ★「新規追加」ボタン：確実にフォームを全画面で表示
  const handleStartNew = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("新規登録を開始します"); // デバッグ用
    setIsNewMode(true);
    setFormData({ ...emptyForm });
  };

  // ★スタッフ選択時：通常レイアウトに戻す
  const handleSelectStaff = (staff: any) => {
    setIsNewMode(false);
    setFormData({
      ...emptyForm,
      staffId: staff.id,
      staffName: staff.name,
      type: staff.type as any,
    });
  };

  const handleSave = async () => {
    if (!formData.staffName) return alert("氏名を入力してください");
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // 新規登録後はリストに戻す
    if (isNewMode) setIsNewMode(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-20 relative">
        
        {/* 通知トースト */}
        {showToast && (
          <div className="fixed top-8 right-8 z-[100] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-5 border border-slate-700 font-bold">
            <CheckCircle2 className="text-emerald-400" />
            <span>{isNewMode ? '新規登録が完了しました' : '情報を更新しました'}</span>
          </div>
        )}

        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Brain size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">人間性・価値観マスター</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Culture & Values Management</p>
            </div>
          </div>
          
          <button 
            onClick={handleSave} 
            disabled={isSaving || !formData.staffName}
            className="relative z-10 w-full md:w-auto flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black transition-all shadow-xl active:scale-95 disabled:opacity-50 min-w-[240px] cursor-pointer"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isNewMode ? '新規スタッフを登録' : '変更を保存する'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 左サイド: スタッフ一覧 (isNewMode時は薄くして無効化) */}
          <div className={`lg:col-span-4 transition-all duration-500 ${isNewMode ? 'opacity-20 pointer-events-none' : 'block'}`}>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="font-black text-slate-800 flex items-center gap-2 text-xs uppercase tracking-widest">
                  <Users size={16} className="text-indigo-600"/> スタッフ一覧
                </h3>
                {/* ★新規追加ボタン（確実に前面へ） */}
                <button 
                  type="button"
                  onClick={handleStartNew}
                  className="relative z-30 flex items-center gap-1.5 text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100 cursor-pointer shadow-sm"
                >
                  <UserPlus size={14} /> 新規追加
                </button>
              </div>

              <div className="relative mb-4 px-2">
                <Search className="absolute left-6 top-3.5 text-slate-400" size={16} />
                <input type="text" placeholder="名前で検索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 font-bold text-slate-600 outline-none focus:ring-2 ring-indigo-500/10" />
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[450px] px-2">
                {staffList.filter(s => s.name.includes(searchTerm)).map((staff) => (
                  <button key={staff.id} onClick={() => handleSelectStaff(staff)} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${formData.staffId === staff.id ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'hover:bg-slate-50 border-transparent'}`}>
                    <span className="font-black text-slate-700 text-sm">{staff.name}</span>
                    <ChevronRight size={16} className={formData.staffId === staff.id ? 'text-indigo-400' : 'text-slate-300'} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右サイド: メインフォーム (isNewMode時は横に広がる) */}
          <div className={`${isNewMode ? 'lg:col-span-12' : 'lg:col-span-8'} transition-all duration-500 space-y-6`}>
            
            {isNewMode && (
              <button onClick={() => setIsNewMode(false)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors mb-2 cursor-pointer">
                <ArrowLeft size={16} /> 既存スタッフ編集に戻る
              </button>
            )}

            {/* スタッフ氏名・タイプ入力エリア */}
            <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 grid grid-cols-1 ${isNewMode ? 'md:grid-cols-2' : 'md:grid-cols-1 xl:grid-cols-2'} gap-8 transition-all`}>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-2">
                    <User size={12} /> スタッフ氏名
                  </label>
                  <input 
                    type="text" 
                    value={formData.staffName}
                    onChange={(e) => setFormData({...formData, staffName: e.target.value})}
                    placeholder="例：田中 太郎"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-800 outline-none focus:ring-4 ring-indigo-500/5 focus:bg-white transition-all text-lg shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-2">
                    <Sliders size={12} /> 特性タイプ
                  </label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-800 outline-none focus:ring-4 ring-indigo-500/5 focus:bg-white transition-all text-lg shadow-inner cursor-pointer"
                  >
                    <option>ムードメーカー型</option>
                    <option>職人・スペシャリスト型</option>
                    <option>バランサー・調整型</option>
                    <option>リーダー・牽引型</option>
                  </select>
                </div>
            </div>

            {/* 性格特性スコア */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-800 mb-12 flex items-center gap-2 text-xs uppercase tracking-widest border-l-4 border-indigo-600 pl-4">
                性格特性スコア調整
              </h3>
              <div className={`grid grid-cols-1 ${isNewMode ? 'md:grid-cols-2 gap-x-16' : 'gap-y-12'} gap-y-12`}>
                {(Object.keys(formData.traits) as Array<keyof typeof formData.traits>).map((key) => (
                  <div key={key}>
                    <div className="flex justify-between items-end mb-4">
                      <span className="font-black text-slate-600 text-sm">
                        {key === 'agreeableness' ? '🤝 協調性' : 
                         key === 'extraversion' ? '📢 外交性' : 
                         key === 'conscientiousness' ? '💎 誠実性' : 
                         key === 'openness' ? '💡 開放性' : '🧘 情緒安定'}
                      </span>
                      <span className="text-3xl font-black text-indigo-600">
                        {formData.traits[key]}<span className="text-[10px] ml-1 font-bold text-slate-300">PT</span>
                      </span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={formData.traits[key]} 
                      onChange={(e) => setFormData({...formData, traits: { ...formData.traits, [key]: parseInt(e.target.value) }})} 
                      className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600 transition-all" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* AIメモ */}
            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                <h3 className="font-black text-indigo-300 mb-6 flex items-center gap-2 text-xs uppercase tracking-widest relative z-10">
                  <MessageSquare size={16}/> 内部向け・AI分析補足メモ
                </h3>
                <textarea 
                  value={formData.aiNote}
                  onChange={(e) => setFormData({...formData, aiNote: e.target.value})}
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-[2rem] p-6 font-medium text-white placeholder:text-white/20 outline-none focus:bg-white/10 transition-all relative z-10 text-base leading-relaxed"
                  placeholder="期待する役割や、現場での性格的な相性などをメモしてください..."
                />
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}