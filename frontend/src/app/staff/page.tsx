'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  UserPlus, Search, Trash2, ChevronRight, User, Mail, 
  Phone, MapPin, Calendar, DollarSign, Lock, 
  BadgeCheck, Sparkles, Building, Briefcase 
} from 'lucide-react';

export default function StaffListPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  // 強化されたフォームデータ（初期値を明確に設定）
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    phone: '',
    address: '',
    birthDate: '', // 日付型ではなく文字列で管理（input type="date"用）
    hourly_rate: 0,
    monthly_salary: 0
  });

  const fetchStaff = async () => {
    try {
      // ダミーデータ（APIの代わり）
      await new Promise(resolve => setTimeout(resolve, 500));
      const dummyStaff = [
        { id: 1, name: '山田 太郎', email: 'taro.yamada@example.com', phone: '090-1234-5678' },
        { id: 2, name: '鈴木 一郎', email: 'ichiro.suzuki@example.com', phone: '080-9876-5432' },
        { id: 3, name: '佐藤 花子', email: 'hanako.sato@example.com', phone: '070-1111-2222' },
      ];
      setStaffList(dummyStaff);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleRegister = async () => {
    if (!formData.name || !formData.email) {
      alert('氏名とメールアドレスは必須です');
      return;
    }

    try {
      // APIコール（シミュレーション）
      console.log('Registering staff:', formData);
      
      // 実際の実装例:
      /*
      const res = await fetch('http://localhost:3000/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
        }),
      });
      if (!res.ok) throw new Error('Failed to create staff');
      */

      alert('スタッフを登録しました');
      
      // フォームのリセット
      setFormData({ 
        name: '', 
        email: '', 
        password: 'password123', 
        phone: '', 
        address: '', 
        birthDate: '', 
        hourly_rate: 0, 
        monthly_salary: 0 
      });
      
      fetchStaff(); // リスト更新

    } catch (e) {
      console.error(e);
      alert('登録に失敗しました');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('削除しますか？')) return;
    // APIコール（シミュレーション）
    console.log('Deleting staff:', id);
    fetchStaff();
  };

  const filteredList = staffList.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col xl:flex-row gap-8 h-[calc(100vh-6rem)] pb-6 relative font-sans text-slate-800">
        
        {/* 背景装飾 */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.6]" 
             style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, #f0f9ff 0%, transparent 50%), radial-gradient(circle at 100% 100%, #f0fdf4 0%, transparent 50%)' }}>
        </div>

        {/* ■ 左側：コントロールパネル（新規登録フォーム） */}
        <div className="w-full xl:w-[420px] flex-shrink-0 relative z-10">
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-indigo-100/50 rounded-[32px] p-8 h-full flex flex-col overflow-hidden">
            {/* 装飾的な背景光 */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
            
            <div className="relative mb-8 flex-none">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                  <UserPlus size={20} />
                </span>
                新規タレント登録
              </h2>
              <p className="text-xs text-slate-500 mt-2 font-bold ml-14">
                必要な情報を入力してデータベースに追加します
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
              
              {/* グループ: Identity */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <BadgeCheck size={16} className="text-indigo-500" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">基本情報 (Identity)</p>
                </div>
                
                <div className="group relative">
                  <User className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18}/>
                  <input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400" 
                    placeholder="氏名 (必須)" 
                  />
                </div>
                
                <div className="group relative">
                  <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18}/>
                  <input 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400" 
                    placeholder="メールアドレス (必須)" 
                  />
                </div>

                <div className="group relative">
                  <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18}/>
                  <input 
                    type="password" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400" 
                    placeholder="パスワード" 
                  />
                </div>

                <div className="group relative">
                  <Calendar className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18}/>
                  <input 
                    type="date" 
                    value={formData.birthDate || ''} // null対策
                    onChange={e => setFormData({...formData, birthDate: e.target.value})} 
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-500" 
                  />
                </div>
              </div>

              {/* グループ: Contact */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 pt-2 border-t border-slate-100">
                  <Building size={16} className="text-indigo-500" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">連絡先 (Contact Info)</p>
                </div>
                
                <div className="group relative">
                  <Phone className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18}/>
                  <input 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400" 
                    placeholder="電話番号" 
                  />
                </div>

                <div className="group relative">
                  <MapPin className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18}/>
                  <input 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400" 
                    placeholder="住所" 
                  />
                </div>
              </div>

              {/* グループ: Compensation */}
              <div className="space-y-4 pb-4">
                <div className="flex items-center gap-2 mb-2 pt-2 border-t border-slate-100">
                  <Briefcase size={16} className="text-indigo-500" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">給与設定 (Compensation)</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="group relative">
                    <DollarSign className="absolute left-4 top-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16}/>
                    <input 
                      type="number" 
                      value={formData.hourly_rate || ''} // 0の場合は空文字にしても良いが、ここでは数値を維持
                      onChange={e => setFormData({...formData, hourly_rate: Number(e.target.value)})} 
                      className="w-full pl-10 pr-2 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400" 
                      placeholder="時給" 
                    />
                    <span className="absolute right-4 top-4 text-[10px] text-slate-400 font-bold">/ 時</span>
                  </div>
                  <div className="group relative">
                    <DollarSign className="absolute left-4 top-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16}/>
                    <input 
                      type="number" 
                      value={formData.monthly_salary || ''}
                      onChange={e => setFormData({...formData, monthly_salary: Number(e.target.value)})} 
                      className="w-full pl-10 pr-2 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400" 
                      placeholder="月給" 
                    />
                    <span className="absolute right-4 top-4 text-[10px] text-slate-400 font-bold">/ 月</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-2 border-t border-slate-100 flex-none">
                <button 
                    onClick={handleRegister} 
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 group active:scale-95"
                >
                    <Sparkles size={18} className="text-indigo-300 group-hover:text-white transition-colors" />
                    <span>登録を実行</span>
                </button>
            </div>
          </div>
        </div>

        {/* ■ 右側：データグリッド（スタッフ一覧） */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 h-full">
          
          {/* インテリジェンス・ヘッダー：検索と統計 */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-5 flex-none">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="w-full pl-14 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 shadow-inner" 
                placeholder="スタッフを検索..." 
              />
            </div>

            <div className="flex items-center gap-6 px-4 w-full md:w-auto overflow-x-auto">
               <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">総スタッフ数</span>
                 <span className="text-3xl font-black text-slate-900 leading-none">{filteredList.length}</span>
               </div>
               <div className="h-10 w-px bg-slate-200 mx-2"></div>
               <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">稼働中</span>
                 <span className="text-3xl font-black text-emerald-500 leading-none">{filteredList.length}</span>
               </div>
            </div>
          </div>

          {/* スタッフリスト */}
          <div className="flex-1 overflow-y-auto pr-2 pb-2 space-y-4 custom-scrollbar">
            {filteredList.map(staff => (
              <div 
                key={staff.id} 
                onClick={() => router.push(`/staff/${staff.id}`)} 
                className="group relative bg-white border border-slate-100 rounded-[24px] p-5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer flex items-center justify-between hover:-translate-y-0.5"
              >
                {/* 左側のカラーバー（アクセント） */}
                <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-slate-100 rounded-r-full group-hover:bg-indigo-500 transition-colors"></div>

                <div className="flex items-center gap-6 pl-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 font-black text-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors shadow-sm">
                      {staff.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                  </div>
                  
                  <div>
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-3 group-hover:text-indigo-700 transition-colors mb-1">
                      {staff.name}
                      {/* IDバッジ */}
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                        #{String(staff.id).padStart(4, '0')}
                      </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                        <Mail size={14} className="text-slate-300"/> {staff.email}
                      </p>
                      {staff.phone && (
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <Phone size={14} className="text-slate-300"/> {staff.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pr-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(staff.id); }} 
                    className="p-3 text-slate-300 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="削除"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm">
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </div>
              </div>
            ))}
            
            {filteredList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-[32px] border-2 border-dashed border-slate-200 text-slate-400 m-2">
                <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                    <Search size={48} className="text-slate-200" />
                </div>
                <p className="font-black text-xl text-slate-300">該当するスタッフが見つかりません</p>
                <p className="text-xs font-bold opacity-60 mt-1">検索条件を変更するか、新規登録を行ってください。</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}