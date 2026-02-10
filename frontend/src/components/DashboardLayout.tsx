'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  CalendarDays,
  Clock,
  Receipt,
  BarChart3,
  FileText,
  Menu,
  X,
  LogOut,
  Bell,
  Wallet,
  FileCheck,
  Zap,
  Heart,
  Brain,
  UserPlus,
  Search,
  ChevronDown,
  Settings,
  Layers, // スキルマスタ用アイコン
  ScrollText // 資格マスタ用アイコン
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: 'ダッシュボード', icon: <LayoutDashboard size={18} />, href: '/' },
    
    { divider: 'Human Resources' },
    { label: 'スタッフ一覧', icon: <Users size={18} />, href: '/staff' },
    // ★修正: ご指定のパスに合わせてルートを変更
    { label: 'スキルマスタ', icon: <Layers size={18} />, href: '/skills' },
    { label: '保有資格マスタ', icon: <ScrollText size={18} />, href: '/licenses' },
    
    { divider: 'Sales & Operations' },
    { label: '派遣先・顧客', icon: <Building2 size={18} />, href: '/clients' },
    { label: 'プロジェクト管理', icon: <Briefcase size={18} />, href: '/projects' },
    { label: '案件マッチング', icon: <Zap size={18} />, href: '/matching' },
    
    // カルチャーマッチング関連
    { label: '人柄・カルチャー', icon: <Heart size={18} />, href: '/culture' },
    { label: '性格・価値観設定', icon: <Brain size={18} />, href: '/culture/edit' },
    { label: '性格・価値観登録', icon: <UserPlus size={18} />, href: '/culture/new' },
    { label: 'アサイン調整', icon: <Users size={18} />, href: '/assignments' },
    { label: '稼働カレンダー', icon: <CalendarDays size={18} />, href: '/calendar' },

    { divider: 'Back Office' },
    { label: '勤怠管理', icon: <Clock size={18} />, href: '/attendance' },
    { label: '経費精算', icon: <Receipt size={18} />, href: '/expenses' },
    { label: '給与明細', icon: <Wallet size={18} />, href: '/payrolls' },
    { label: '請求管理', icon: <FileText size={18} />, href: '/invoices' },
    { label: '契約書作成', icon: <FileCheck size={18} />, href: '/documents' },
    
    { label: '分析レポート', icon: <BarChart3 size={18} />, href: '/analysis' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-500/20">
      
      {/* 背景装飾：テクニカルなグリッドパターン */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]" 
           style={{ 
             backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      {/* サイドバー (Glassmorphism design) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          
          {/* ロゴエリア */}
          <div className="h-20 flex items-center px-6 border-b border-slate-100/50">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl text-white shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <Briefcase size={18} className="relative z-10" />
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-slate-800 leading-none tracking-tight">
                  Work<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Ledger</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">for Staffing</span>
              </div>
            </Link>
          </div>

          {/* メニューエリア */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {menuItems.map((item, index) => (
              item.divider ? (
                <div key={index} className="px-3 pt-6 pb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">{item.divider}</p>
                </div>
              ) : (
                <Link
                  key={index}
                  href={item.href || '#'}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-indigo-50/80 text-indigo-700 shadow-sm ring-1 ring-indigo-200/50'
                      : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  {/* アクティブ時のインジケーター */}
                  {pathname === item.href && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-r-full shadow-[0_0_12px_rgba(79,70,229,0.5)]"></div>
                  )}

                  <div className={`transition-all duration-200 ${pathname === item.href ? 'text-indigo-600 scale-100' : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-105'}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm tracking-tight">{item.label}</span>
                  
                  {/* ホバー時の矢印（さりげないインタラクション） */}
                  {pathname !== item.href && (
                     <div className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                     </div>
                  )}
                </Link>
              )
            ))}
          </nav>

          {/* ユーザープロファイル（下部固定） */}
          <div className="p-4 border-t border-slate-100/50 bg-slate-50/50 backdrop-blur-sm">
            <button className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white hover:shadow-md hover:shadow-slate-200/50 hover:ring-1 hover:ring-slate-200 transition-all duration-200 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-md ring-2 ring-white">N</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-slate-700 truncate group-hover:text-indigo-700 transition-colors">管理者 太郎</p>
                <p className="text-[10px] font-medium text-slate-400 truncate">admin@workledger.com</p>
              </div>
              <LogOut size={16} className="text-slate-300 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
      </aside>

      {/* メインコンテンツラッパー */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        
        {/* モバイル用ヘッダー */}
        <header className="h-16 lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
               <Briefcase size={16} />
             </div>
             <span className="text-base font-black text-slate-800 italic">WorkLedger</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* メインエリア */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* PC用ヘッダーエリア */}
            <div className="hidden lg:flex items-center justify-between">
              
              {/* 検索バー */}
              <div className="relative group w-[400px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="検索キーワードを入力 (Ctrl+K)" 
                  className="block w-full pl-10 pr-4 py-2.5 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 shadow-sm transition-all hover:bg-white/80 hover:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">⌘K</span>
                </div>
              </div>

              {/* 右側アクションエリア */}
              <div className="flex items-center gap-3">
                
                {/* 通知ボタン */}
                <button className="relative p-2.5 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 text-slate-500 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all group">
                  <Bell size={18} />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                </button>
                
                {/* 設定ボタン（ダミー） */}
                <button className="p-2.5 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 text-slate-500 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all">
                  <Settings size={18} />
                </button>

                {/* ユーザーロール表示 */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-300/30 ml-2">
                   <div className="text-right hidden xl:block">
                     <p className="text-xs font-bold text-slate-700">管理者 太郎</p>
                     <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide bg-indigo-50 px-1.5 py-0.5 rounded inline-block mt-0.5">Super Admin</p>
                   </div>
                   <button className="flex items-center gap-1 pl-1 pr-2 py-1 rounded-xl hover:bg-white/50 transition-colors">
                     <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 text-indigo-600 flex items-center justify-center font-black text-xs border border-indigo-100 shadow-sm">
                       AD
                     </div>
                     <ChevronDown size={14} className="text-slate-400" />
                   </button>
                </div>
              </div>
            </div>
            
            {/* コンテンツ注入エリア */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[calc(100vh-140px)] p-6 relative overflow-hidden">
               {/* 装飾用背景光 */}
               <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
               <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>
               
               <div className="relative z-10">
                 {children}
               </div>
            </div>

          </div>
        </main>
      </div>

      {/* モバイル用オーバーレイ */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}