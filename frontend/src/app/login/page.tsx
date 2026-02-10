'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // 将来的な認証ロジックの実装箇所
    console.log('Login attempt:', { email, password });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* 背景装飾: サイバーセキュリティ的な雰囲気 */}
      <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[150px] opacity-20 pointer-events-none -mr-32 -mt-32 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] opacity-10 pointer-events-none -ml-32 -mb-32"></div>

      {/* ログインカード */}
      <div className="max-w-[440px] w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl relative z-10 overflow-hidden ring-1 ring-white/5">
        
        {/* ヘッダーエリア */}
        <div className="p-12 pb-0 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/30 ring-4 ring-white/5 relative group">
            <div className="absolute inset-0 bg-white/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Briefcase className="text-white drop-shadow-md" size={40} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
            Work<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Ledger</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3 opacity-80">
             <div className="h-px w-8 bg-gradient-to-r from-transparent to-indigo-500"></div>
             <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Staffing Intelligence</p>
             <div className="h-px w-8 bg-gradient-to-l from-transparent to-indigo-500"></div>
          </div>
        </div>

        {/* フォームエリア */}
        <form onSubmit={handleLogin} className="p-10 pt-8 space-y-6">
          
          <div className="space-y-2 group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5 group-focus-within:text-indigo-400 transition-colors">
              <Mail size={12} /> Email Identity
            </label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-5 pr-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl font-bold text-white outline-none focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600 text-sm"
                placeholder="admin@workledger.com" 
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5 group-focus-within:text-indigo-400 transition-colors">
              <Lock size={12} /> Secure Key
            </label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-5 pr-5 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl font-bold text-white outline-none focus:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600 text-sm"
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 active:scale-[0.98] group mt-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <ShieldCheck size={18} className="text-indigo-100 relative z-10" />
            <span className="tracking-widest text-xs uppercase relative z-10">Authenticate</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform relative z-10" />
          </button>

        </form>

        {/* フッター */}
        <div className="px-10 pb-8 text-center border-t border-white/5 pt-6 mx-10">
          <p className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Protected by Enterprise Grade Security
          </p>
        </div>

      </div>
    </div>
  );
}