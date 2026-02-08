'use client';

import { LayoutDashboard, Users, BookOpen, Building2, Briefcase, Settings, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'ダッシュボード', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'スタッフ管理', icon: Users, path: '/' },
    { name: 'スキルマスタ', icon: BookOpen, path: '/skills' },
    { name: '派遣先管理', icon: Building2, path: '/clients' },
    { name: 'プロジェクト管理', icon: Briefcase, path: '/projects' },
    // ★追加: 案件マッチング画面へのリンク
    { name: '案件マッチング', icon: Zap, path: '/matching' },
    { name: 'システム設定', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen sticky top-0 p-6 flex flex-col gap-10">
      <div className="px-4">
        <h1 className="text-2xl font-black italic tracking-tighter text-slate-900">
          STAFFING<span className="text-blue-600">PRO</span>
        </h1>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
              pathname === item.path
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <item.icon size={20} />
            <span className="text-sm tracking-tight">{item.name}</span>
          </Link>
        ))}
      </nav>
      
      {/* ステータス表示エリア */}
      <div className="mt-auto bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1 text-center">System Status</p>
        <p className="text-[11px] font-bold text-blue-900 text-center">All Systems Normal</p>
      </div>
    </aside>
  );
}