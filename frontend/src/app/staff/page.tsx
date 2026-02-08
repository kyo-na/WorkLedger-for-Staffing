'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { UserPlus, Search, Trash2, ChevronRight, User, Mail, Phone, MapPin, Calendar, DollarSign, Lock } from 'lucide-react';

export default function StaffListPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  // 強化されたフォームデータ（DBの全項目に対応）
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123', // デフォルト
    phone: '',
    address: '',
    birthDate: '',
    // 給与設定も同時に登録
    hourly_rate: 0,
    monthly_salary: 0
  });

  const fetchStaff = async () => {
    try {
      const res = await fetch('http://localhost:3000/staff');
      if (res.ok) setStaffList(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleRegister = async () => {
    if (!formData.name || !formData.email) {
      alert('氏名とメールアドレスは必須です');
      return;
    }

    try {
      // 1. スタッフ基本情報の登録
      const res = await fetch('http://localhost:3000/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
        }),
      });

      if (!res.ok) throw new Error('Failed to create staff');
      const newStaff = await res.json();

      // 2. 給与設定の登録 (staffIdを使って登録)
      if (formData.hourly_rate > 0 || formData.monthly_salary > 0) {
        await fetch(`http://localhost:3000/staff/${newStaff.id}/salary`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hourly_rate: Number(formData.hourly_rate),
            monthly_salary: Number(formData.monthly_salary)
          }),
        });
      }

      alert('スタッフを登録しました');
      setFormData({ name: '', email: '', password: 'password123', phone: '', address: '', birthDate: '', hourly_rate: 0, monthly_salary: 0 });
      fetchStaff();

    } catch (e) {
      console.error(e);
      alert('登録に失敗しました');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('削除しますか？')) return;
    await fetch(`http://localhost:3000/staff/${id}`, { method: 'DELETE' });
    fetchStaff();
  };

  const filteredList = staffList.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="flex flex-col xl:flex-row gap-8 animate-in fade-in pb-10">
        
        {/* 左側：新規登録フォーム (全項目対応) */}
        <div className="w-full xl:w-1/3 bg-white p-8 rounded-[2.5rem] shadow-xl h-fit border border-slate-100 sticky top-4">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <UserPlus className="text-indigo-600"/> 新規採用登録
          </h2>
          
          <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            {/* 基本情報セクション */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest border-b border-slate-100 pb-1">基本情報</p>
              
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-300" size={18}/>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-11 p-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500/20" placeholder="氏名 (必須)" />
              </div>
              
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-300" size={18}/>
                <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-11 p-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500/20" placeholder="メール (必須)" />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-300" size={18}/>
                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-11 p-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500/20" placeholder="パスワード" />
              </div>

              <div className="relative">
                <Calendar className="absolute left-4 top-4 text-slate-300" size={18}/>
                <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="w-full pl-11 p-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500/20 text-slate-500" />
              </div>
            </div>

            {/* 連絡先セクション */}
            <div className="space-y-3 pt-4">
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest border-b border-slate-100 pb-1">連絡先・住所</p>
              
              <div className="relative">
                <Phone className="absolute left-4 top-4 text-slate-300" size={18}/>
                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full pl-11 p-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500/20" placeholder="電話番号" />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-slate-300" size={18}/>
                <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full pl-11 p-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500/20" placeholder="住所" />
              </div>
            </div>

            {/* 給与セクション */}
            <div className="space-y-3 pt-4">
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest border-b border-slate-100 pb-1">給与条件</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <DollarSign className="absolute left-4 top-4 text-slate-300" size={16}/>
                  <input type="number" value={formData.hourly_rate} onChange={e => setFormData({...formData, hourly_rate: Number(e.target.value)})} className="w-full pl-10 p-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500/20" placeholder="時給" />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-4 text-slate-300" size={16}/>
                  <input type="number" value={formData.monthly_salary} onChange={e => setFormData({...formData, monthly_salary: Number(e.target.value)})} className="w-full pl-10 p-4 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 ring-indigo-500/20" placeholder="月給" />
                </div>
              </div>
            </div>

            <button onClick={handleRegister} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all mt-4">
              登録する
            </button>
          </div>
        </div>

        {/* 右側：スタッフ一覧リスト */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 sticky top-4 z-10">
            <Search className="ml-4 text-slate-300" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="flex-1 p-2 bg-transparent font-bold outline-none text-lg" placeholder="スタッフを検索..." />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredList.map(staff => (
              <div key={staff.id} onClick={() => router.push(`/staff/${staff.id}`)} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-800">{staff.name}</h3>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                      <Mail size={12}/> {staff.email}
                      {staff.phone && <span className="flex items-center gap-1 ml-2"><Phone size={12}/> {staff.phone}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(staff.id); }} className="p-3 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                  <ChevronRight className="text-slate-300 group-hover:text-indigo-600" />
                </div>
              </div>
            ))}
            {filteredList.length === 0 && <div className="text-center p-10 text-slate-400 font-bold">該当なし</div>}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}