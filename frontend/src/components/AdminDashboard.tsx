'use client';

import React from 'react';
import { Users, Building2, Briefcase, DollarSign, LogOut, LayoutDashboard, UserSquare2, BookOpen, Settings } from 'lucide-react';

const AdminDashboard = () => {
  // 本来はバックエンドから取得する統計データ
  const stats = [
    { label: '登録スタッフ数', value: '2 名', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: '取引先企業数', value: '1 社', icon: Building2, color: 'bg-green-100 text-green-600' },
    { label: '稼働中案件数', value: '1 件', icon: Briefcase, color: 'bg-orange-100 text-orange-600' },
    { label: '月間売上予測', value: '¥8,000', icon: DollarSign, color: 'bg-pink-100 text-pink-600' },
  ];

  const menuItems = [
    { label: 'ダッシュボード', icon: LayoutDashboard, active: true },
    { label: 'スタッフ管理', icon: UserSquare2 },
    { label: 'スキルマスタ', icon: BookOpen },
    { label: '派遣先管理', icon: Building2 },
    { label: 'プロジェクト管理', icon: Briefcase },
    { label: 'システム設定', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-700">
      {/* サイドバー */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <h2 className="text-blue-600 font-black text-xl tracking-tighter">STAFFING HUB</h2>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                item.active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <header className="h-16 bg-blue-600 flex items-center justify-between px-8 text-white shadow-lg">
          <h1 className="text-lg font-bold">派遣管理システム (管理者)</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">管理者 さん</span>
            <button className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-lg transition-all">
              <LogOut size={18} />
              <span className="font-bold">終了</span>
            </button>
          </div>
        </header>

        {/* コンテンツエリア */}
        <div className="p-8 space-y-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">経営ダッシュボード</h2>

          {/* 統計カードグリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-105 cursor-default">
                <div className={`p-4 rounded-2xl ${stat.color}`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-800 mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 売上推移グラフエリア (ダミー) */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 h-96 flex flex-col">
            <h3 className="text-xl font-black mb-10">売上推移</h3>
            <div className="flex-1 flex items-end gap-4 px-10 pb-10 border-b border-slate-100 relative">
              {/* グラフのグリッド線 */}
              <div className="absolute inset-x-0 top-0 h-px bg-slate-50"></div>
              <div className="absolute inset-x-0 top-1/4 h-px bg-slate-50"></div>
              <div className="absolute inset-x-0 top-2/4 h-px bg-slate-50"></div>
              <div className="absolute inset-x-0 top-3/4 h-px bg-slate-50"></div>
              
              {/* 2月の棒グラフ */}
              <div className="w-16 bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 cursor-pointer" style={{ height: '80%' }}></div>
              <p className="absolute -bottom-8 left-16 text-sm font-bold text-slate-400">2月</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;