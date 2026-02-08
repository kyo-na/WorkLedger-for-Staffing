'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Building2, Save, Trash2, Briefcase, User, Phone, Mail, MapPin, ChevronRight, Calendar, Plus, X, ArrowLeft } from 'lucide-react';

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  
  // 初期値
  const [client, setClient] = useState<any>({ 
    companyName: '', 
    contactPerson: '', 
    email: '', 
    phone: '', 
    address: '', 
    projects: [] 
  });

  // 案件登録モーダル用
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    status: 'planning',
    budget: 0
  });

  const fetchData = async () => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:3000/clients/${id}`);
      if (res.ok) {
        const data = await res.json();
        // ★修正ポイント: DBのnull値を空文字に変換してエラーを防ぐ
        setClient({
          ...data,
          companyName: data.companyName || '',
          contactPerson: data.contactPerson || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          projects: data.projects || []
        });
      }
    } catch (e) { console.error(e); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => { if (id) fetchData(); }, [id]);

  const handleSave = async () => {
    await fetch(`http://localhost:3000/clients/${id}`, {
      method: 'PUT', // PATCHでも可ですが、全体更新の意味合いでPUTにしています
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: client.companyName,
        contactPerson: client.contactPerson,
        email: client.email,
        phone: client.phone,
        address: client.address
      }),
    });
    alert('顧客情報を保存しました');
  };

  const handleDelete = async () => {
    if (!confirm('本当にこの顧客を削除しますか？\n※関連するプロジェクトも全て削除されます')) return;
    await fetch(`http://localhost:3000/clients/${id}`, { method: 'DELETE' });
    router.push('/clients');
  };

  // 案件追加処理
  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.startDate) {
      alert('案件名と開始日は必須です');
      return;
    }
    
    await fetch('http://localhost:3000/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newProject,
        clientId: Number(id), // IDを数値型に変換
        budget: Number(newProject.budget)
      }),
    });

    // フォームリセット
    setNewProject({ name: '', startDate: '', endDate: '', description: '', status: 'planning', budget: 0 });
    setIsModalOpen(false);
    fetchData(); // リロードしてリスト更新
  };

  if (isLoading) return <div className="p-20 text-center font-bold text-slate-400">LOADING...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in pb-20 relative">
        
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-4 z-10 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors md:hidden">
              <ArrowLeft size={20} className="text-slate-400"/>
            </button>
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-2xl shrink-0">
              {client.companyName ? client.companyName.substring(0, 1) : '?'}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">{client.companyName || '名称未設定'}</h2>
              <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">CLIENT ID: {id}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={handleDelete} className="flex-1 md:flex-none justify-center bg-red-50 text-red-500 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-100 transition-all text-sm">
              <Trash2 size={18} /> 削除
            </button>
            <button onClick={handleSave} className="flex-1 md:flex-none justify-center bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:bg-indigo-700 text-sm transition-all">
              <Save size={18} /> 保存
            </button>
          </div>
        </div>

        {/* タブ切り替え */}
        <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex gap-1 w-full md:w-auto overflow-x-auto">
          <button onClick={() => setActiveTab('projects')} className={`flex-1 md:flex-none justify-center px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'projects' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
            <Briefcase size={18} /> 案件一覧 ({client.projects?.length || 0})
          </button>
          <button onClick={() => setActiveTab('basic')} className={`flex-1 md:flex-none justify-center px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'basic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
            <Building2 size={18} /> 基本情報
          </button>
        </div>

        {/* コンテンツ: 基本情報 */}
        {activeTab === 'basic' && (
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">企業名</label>
              <input value={client.companyName} onChange={e => setClient({...client, companyName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600 border border-transparent focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">担当者名</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-300" size={20}/>
                <input value={client.contactPerson} onChange={e => setClient({...client, contactPerson: e.target.value})} className="w-full pl-12 p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600 border border-transparent focus:bg-white transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">電話番号</label>
              <div className="relative">
                <Phone className="absolute left-4 top-4 text-slate-300" size={20}/>
                <input value={client.phone} onChange={e => setClient({...client, phone: e.target.value})} className="w-full pl-12 p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600 border border-transparent focus:bg-white transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">メールアドレス</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-300" size={20}/>
                <input value={client.email} onChange={e => setClient({...client, email: e.target.value})} className="w-full pl-12 p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600 border border-transparent focus:bg-white transition-all" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-2">住所</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-slate-300" size={20}/>
                <input value={client.address} onChange={e => setClient({...client, address: e.target.value})} className="w-full pl-12 p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-600 border border-transparent focus:bg-white transition-all" />
              </div>
            </div>
          </div>
        )}

        {/* コンテンツ: 案件一覧 */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all text-sm"
              >
                <Plus size={18} /> この顧客の案件を追加
              </button>
            </div>

            <div className="space-y-4">
              {client.projects && client.projects.length > 0 ? (
                client.projects.map((proj: any) => (
                  <div 
                    key={proj.id} 
                    onClick={() => router.push(`/projects`)} // 詳細ページへ飛ぶように変更（本来は/projects/[id]）
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md cursor-pointer group transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${proj.status === 'active' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'}`}>
                          {proj.status}
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Calendar size={10}/> {new Date(proj.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-black text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{proj.name}</h4>
                      <p className="text-xs font-bold text-slate-400">予算: ¥{proj.budget?.toLocaleString()}</p>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors"/>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-bold">
                  プロジェクトがまだ登録されていません
                </div>
              )}
            </div>
          </div>
        )}

        {/* 案件追加モーダル */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white p-8 rounded-[2rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">新規案件作成</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">PROJECT NAME</label>
                  <input 
                    value={newProject.name} 
                    onChange={e => setNewProject({...newProject, name: e.target.value})} 
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100 focus:ring-2 ring-indigo-600/20" 
                    placeholder="例: 基幹システム刷新" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">START DATE</label>
                    <input 
                      type="date" 
                      value={newProject.startDate} 
                      onChange={e => setNewProject({...newProject, startDate: e.target.value})} 
                      className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100 text-slate-600" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">BUDGET</label>
                    <input 
                      type="number" 
                      value={newProject.budget} 
                      onChange={e => setNewProject({...newProject, budget: Number(e.target.value)})} 
                      className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100" 
                      placeholder="予算 (円)" 
                    />
                  </div>
                </div>

                <div>
                   <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">DESCRIPTION</label>
                   <textarea 
                     value={newProject.description} 
                     onChange={e => setNewProject({...newProject, description: e.target.value})} 
                     className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-slate-100 h-24 resize-none" 
                     placeholder="詳細..." 
                   />
                </div>

                <div className="flex gap-2 pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">キャンセル</button>
                  <button onClick={handleCreateProject} className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors">作成する</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}