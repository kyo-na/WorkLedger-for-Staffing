'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // ここで NestJS の /auth/login を叩き、JWTを取得する処理を後ほど実装
    console.log('Login attempt:', { email, password });
    router.push('/'); // 一旦トップへ
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-white">
        <div className="bg-slate-900 p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/40 relative z-10">
            <Briefcase className="text-white" size={36} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic relative z-10">
            Staffing<span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black mt-2 uppercase tracking-[0.4em] relative z-10">Security Portal</p>
        </div>

        <form onSubmit={handleLogin} className="p-12 space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Email</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-6 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-slate-50 rounded-[1.8rem] border-none ring-2 ring-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-bold transition-all text-slate-700"
                placeholder="admin@admin.com" 
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Password</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-6 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-slate-50 rounded-[1.8rem] border-none ring-2 ring-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-bold transition-all text-slate-700"
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button className="w-full bg-slate-900 hover:bg-blue-600 text-white py-6 rounded-[1.8rem] font-black shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-4 transition-all active:scale-95 group">
            <span className="tracking-widest text-sm">AUTHENTICATE</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}