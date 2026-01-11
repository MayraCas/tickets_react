import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Tutorial from './components/Tutorial';
import AuditoriaTool from './components/AuditoriaTool';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

const App = () => {
  const [activeTab, setActiveTab] = useState('tutorial');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="md:ml-64 p-4 md:p-10">
        {activeTab === 'tutorial' && <Tutorial />}
        {activeTab === 'auditoria' && <AuditoriaTool />}
        {activeTab === 'dashboard' && <Dashboard />}
      </main>

      <Footer />
    </div>
  );
};

export default App;