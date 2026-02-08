'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Brain, Save, ArrowLeft, MessageSquare, Sliders, User, CheckCircle2, Loader2 } from 'lucide-react';

export default function CultureNewPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    staffName: '',
    type: 'バランサー・調整型',
    traits: { agreeableness: 50, extraversion: 50, conscientiousness: 50, openness: 50, stability: 50 },
    aiNote: ''
  });

  const handleSave = async () => {
    if (!formData.staffName) return alert("氏名を入力してください");
    setIsSaving(true);
    
    // API送信のシミュレーション
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setShowToast(true);
    // 保存後、3秒待ってから一覧に戻る
    setTimeout(() => {
      setShowToast(false);
      router.push('/culture'); 
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        
        {/* 保存完了トースト */}
        {showToast && (
          <div className="fixed top-8 right-8 z-[100] bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 border border-slate-700">
            <div className="bg-emerald-500 p-2 rounded-full text-white"><CheckCircle2 size={24} /></div>
            <div>
              <p className="font-black text-lg">登録完了！</p>
              <p className="text-slate-400 text-sm">一覧画面へ戻ります...</p>
            </div>
          </div>
        )}

        {/* ナビゲーション */}
        <button onClick={() => router.back()} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all">
          <div className="p-2 rounded-xl group-hover:bg-indigo-50 transition-colors"><ArrowLeft size={20} /></div>
          キャンセルして戻る
        </button>

        {/* メインカード */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* カードヘッダー */}
          <div className="bg-slate-900 p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-indigo-500/30 rotate-6">
                <Brain size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">新規スタッフ登録</h1>
                <p className="text-indigo-300 font-bold text-sm uppercase tracking-widest mt-1">New Personnel Profile</p>
              </div>
            </div>
            <button 
              onClick={handleSave} 
              disabled={isSaving || !formData.staffName}
              className="w-full md:w-auto bg-white text-slate-900 hover:bg-indigo-50 px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              新規スタッフを登録
            </button>
          </div>

          <div className="p-10 space-y-12">
            {/* 1. 基本情報 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                  <User size={14} className="text-indigo-500" /> 氏名
                </label>
                <input 
                  type="text" 
                  placeholder="例：田中 太郎"
                  value={formData.staffName}
                  onChange={(e) => setFormData({...formData, staffName: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[1.5rem] p-6 font-bold text-xl outline-none transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                  <Sliders size={14} className="text-indigo-500" /> 特性タイプ
                </label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[1.5rem] p-6 font-bold text-xl outline-none transition-all shadow-inner cursor-pointer"
                >
                  <option>バランサー・調整型</option>
                  <option>ムードメーカー型</option>
                  <option>職人・スペシャリスト型</option>
                  <option>リーダー・牽引型</option>
                </select>
              </div>
            </section>

            {/* 2. 性格特性スコア */}
            <section className="space-y-8 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
              <h3 className="font-black text-slate-800 flex items-center gap-3 text-lg uppercase">
                <div className="w-2 h-6 bg-pink-500 rounded-full"></div>
                特性バランス調整 (Big 5)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                {(Object.keys(formData.traits) as Array<keyof typeof formData.traits>).map((key) => (
                  <div key={key} className="space-y-4">
                    <div className="flex justify-between items-end px-1">
                      <span className="font-black text-slate-600">
                        {key === 'agreeableness' ? '🤝 協調性' : key === 'extraversion' ? '📢 外交性' : key === 'conscientiousness' ? '💎 誠実性' : key === 'openness' ? '💡 開放性' : '🧘 情緒安定'}
                      </span>
                      <span className="text-3xl font-black text-indigo-600">{formData.traits[key]}<span className="text-xs ml-1 font-bold text-slate-300">PT</span></span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={formData.traits[key]} 
                      onChange={(e) => setFormData({...formData, traits: { ...formData.traits, [key]: parseInt(e.target.value) }})} 
                      className="w-full h-3 bg-white rounded-full appearance-none cursor-pointer accent-indigo-600 shadow-sm" 
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 3. AIメモ */}
            <section className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                <MessageSquare size={14} className="text-indigo-500" /> AIへの補足指示（性格・価値観）
              </label>
              <textarea 
                value={formData.aiNote}
                onChange={(e) => setFormData({...formData, aiNote: e.target.value})}
                placeholder="「プレッシャーに強い」「新しい技術への興味が非常に高い」など、マッチングに役立つ情報を入力..."
                className="w-full h-48 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[2rem] p-8 font-medium text-slate-700 outline-none transition-all shadow-inner text-lg leading-relaxed"
              />
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}