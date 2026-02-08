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

  Heart, // ★追加

  Brain,

  UserPlus

} from 'lucide-react';



export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pathname = usePathname();



  const menuItems = [

    { label: 'ダッシュボード', icon: <LayoutDashboard size={20} />, href: '/' },

   

    { divider: 'Human Resources' },

    { label: 'スタッフ一覧', icon: <Users size={20} />, href: '/staff' },

   

    { divider: 'Sales & Operations' },

    { label: '派遣先・顧客', icon: <Building2 size={20} />, href: '/clients' },

    { label: 'プロジェクト管理', icon: <Briefcase size={20} />, href: '/projects' },

    { label: '案件マッチング', icon: <Zap size={20} />, href: '/matching' },

    // ★追加: カルチャーマッチング

    { label: '人柄・カルチャー', icon: <Heart size={20} />, href: '/culture' },

    { label: '性格・価値観設定', icon: <Brain size={20} />, href: '/culture/edit' },

    { label: '性格・価値観登録', icon: <UserPlus size={20} />, href: '/culture/new' },

     { label: 'アサイン調整', icon: <Users size={20} />, href: '/assignments' },

     { label: '稼働カレンダー', icon: <CalendarDays size={20} />, href: '/calendar' },



    { divider: 'Back Office' },

    { label: '勤怠管理', icon: <Clock size={20} />, href: '/attendance' },

    { label: '経費精算', icon: <Receipt size={20} />, href: '/expenses' },

    { label: '給与明細', icon: <Wallet size={20} />, href: '/payrolls' },

    { label: '請求管理', icon: <FileText size={20} />, href: '/invoices' },

    { label: '契約書作成', icon: <FileCheck size={20} />, href: '/documents' },

   

    { label: '分析レポート', icon: <BarChart3 size={20} />, href: '/analysis' },

  ];



  return (

    <div className="min-h-screen bg-[#f8fafc] flex text-slate-600 font-sans">

     

      {/* サイドバー */}

      <aside

        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 transition-transform duration-300 ease-in-out ${

          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'

        } lg:translate-x-0 lg:static lg:inset-0 shadow-xl lg:shadow-none`}

      >

        <div className="h-full flex flex-col">

         

          {/* ロゴエリア */}

          <div className="h-20 flex items-center px-8 border-b border-slate-50">

            <div className="flex items-center gap-2">

              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">

                <Briefcase size={18} />

              </div>

              <span className="text-xl font-black text-slate-800 italic tracking-tighter">

                HR <span className="text-indigo-600">NEXUS</span>

              </span>

            </div>

          </div>



          {/* メニューエリア */}

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">

            {menuItems.map((item, index) => (

              item.divider ? (

                <div key={index} className="px-4 py-4 mt-2">

                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.divider}</p>

                </div>

              ) : (

                <Link

                  key={index}

                  href={item.href || '#'}

                  onClick={() => setIsSidebarOpen(false)}

                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${

                    pathname === item.href

                      ? 'bg-indigo-50 text-indigo-600 shadow-sm'

                      : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'

                  }`}

                >

                  {pathname === item.href && (

                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full"></div>

                  )}

                  <div className={`transition-transform duration-200 ${pathname === item.href ? 'scale-110' : 'group-hover:scale-110'}`}>

                    {item.icon}

                  </div>

                  <span className="font-bold text-sm tracking-tight">{item.label}</span>

                  {pathname === item.href && (

                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"></div>

                  )}

                </Link>

              )

            ))}

          </nav>



          {/* ユーザー情報・ログアウト */}

          <div className="p-4 border-t border-slate-50">

            <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">

              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">N</div>

              <div className="flex-1 min-w-0">

                <p className="text-sm font-black text-slate-800 truncate">管理者 太郎</p>

                <p className="text-xs font-bold text-slate-400 truncate">ログアウト</p>

              </div>

              <LogOut size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />

            </button>

          </div>

        </div>

      </aside>



      {/* メインコンテンツエリア */}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

       

        {/* モバイル用ヘッダー */}

        <header className="h-16 lg:hidden bg-white border-b border-slate-100 flex items-center justify-between px-4 z-40 sticky top-0">

          <div className="flex items-center gap-2">

             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">

               <Briefcase size={18} />

             </div>

             <span className="text-lg font-black text-slate-800 italic">HR NEXUS</span>

          </div>

          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg">

            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}

          </button>

        </header>



        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">

         

          {/* PC用ヘッダー（検索バーなど） */}

          <div className="hidden lg:flex items-center justify-between mb-8">

            <div className="relative w-96 group">

              <input type="text" placeholder="検索 (Ctrl+K)" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-4 ring-indigo-500/10 transition-all shadow-sm group-hover:shadow-md"/>

              <div className="absolute left-3 top-3 text-slate-400">

                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">

                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />

                </svg>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <button className="p-3 bg-white rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md relative">

                <Bell size={20} strokeWidth={2.5} />

                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>

              </button>

               <div className="flex items-center gap-3 pl-4 border-l border-slate-200">

                  <div className="text-right">

                    <p className="text-xs font-black text-slate-800">管理者 太郎</p>

                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Super Admin</p>

                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border-2 border-indigo-100">AD</div>

               </div>

            </div>

          </div>

         

          {children}



        </main>

      </div>



      {/* モバイル用オーバーレイ */}

      {isSidebarOpen && (

        <div

          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"

          onClick={() => setIsSidebarOpen(false)}

        />

      )}

    </div>

  );

}

