import React from 'react';
import { Settings, BookOpen, ShieldCheck, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-purple-200 p-6 hidden md:block">
      <div className="flex items-center gap-2 mb-10 px-2">
        <Settings className="text-purple-600 w-8 h-8" />
        <span className="font-bold text-xl tracking-tight">Sistemas V</span>
      </div>
      
      <div className="space-y-2">
        <button 
          onClick={() => setActiveTab('tutorial')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'tutorial' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          <BookOpen size={20} />
          <span className="font-medium">Tutorial Teórico</span>
        </button>
        <button 
          onClick={() => setActiveTab('auditoria')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'auditoria' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          <ShieldCheck size={20} />
          <span className="font-medium">Herramienta Auditoría</span>
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Gestión Mantenimiento</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
