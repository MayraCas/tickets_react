import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Code, 
  LayoutDashboard, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Trash2,
  BookOpen,
  Search
} from 'lucide-react';
import { db } from './FirebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"; // <-- Importa funciones de Firestore


const App = () => {
  const [activeTab, setActiveTab] = useState('tutorial');
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ title: '', type: 'Correctivo', priority: 'Media' });
  const [codeToAudit, setCodeToAudit] = useState('// Pega tu código aquí\nvar x = 10;\nfunction test(){\n  if(x == 10){\n    alert("Error");\n  }\n}');
  const [auditResults, setAuditResults] = useState([]);

  // --- Lógica de Firebase ---
  useEffect(() => {
    // Colección ordenada por fecha de creación
    const q = query(collection(db, 'tickets'), orderBy('createAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setTickets(docs);
    });

    return () => unsubscribe(); // Limpiar conexión al desmontar
  }, []);


  // --- Lógica de Auditoría de Código ---
  const runAudit = () => {
    const findings = [];
    const lines = codeToAudit.split('\n');

    lines.forEach((line, index) => {
      // Regla 1: Uso de 'var' (Obsolescencia)
      if (line.includes('var ')) {
        findings.push({ 
          line: index + 1, 
          msg: 'Uso de "var" detectado. Se recomienda usar "let" o "const" para evitar problemas de scope.',
          severity: 'Baja'
        });
      }
      // Regla 2: Uso de alert (Mala práctica en producción)
      if (line.includes('alert(')) {
        findings.push({ 
          line: index + 1, 
          msg: 'Uso de "alert()" detectado. Bloquea el hilo principal; usa modales personalizados.',
          severity: 'Media'
        });
      }
      // Regla 3: Comparación débil
      if (line.includes(' == ') && !line.includes(' === ')) {
        findings.push({ 
          line: index + 1, 
          msg: 'Comparación débil (==). Usa comparación estricta (===) para evitar coerción de tipos.',
          severity: 'Media'
        });
      }
      // Regla 4: Funciones vacías
      if (line.match(/function.*\{\s*\}/)) {
        findings.push({ 
          line: index + 1, 
          msg: 'Función vacía detectada. Elimina código muerto para mejorar la mantenibilidad.',
          severity: 'Baja'
        });
      }
    });

    setAuditResults(findings);
  };

  // --- Lógica del Dashboard de Mantenimiento ---
  const addTicket = async () => {
    if (!newTicket.title.trim()) return;

    try {
      await addDoc(collection(db, "tickets"), {
        title: newTicket.title,
        type: newTicket.type,
        priority: newTicket.priority,
        status: 'Abierto',
        date: new Date().toLocaleDateString(),
        createdAt: serverTimestamp()
      });
      setNewTicket({ title: '', type: 'Correctivo', priority: 'Media' });
      console.log("Ticket creado con éxito");
    } catch (error) {
      console.error("Error al entrar el ticket: ", error);
    }
  };

  const deleteTicket = async (id) => {
    try {
      await deleteDoc(doc(db, "tickets", id));
      console.log("Ticket eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el ticket: ", error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const ticketRef = doc(db, "tickets", id);
    try {
      await updateDoc(ticketRef, {
        status: currentStatus === 'Abierto' ? 'Resuelto' : 'Abierto',
        updatedAt: serverTimestamp()
      });
      console.log("Ticket actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar ticket: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar / Navigation */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 p-6 hidden md:block">
        <div className="flex items-center gap-2 mb-10 px-2">
          <Settings className="text-blue-600 w-8 h-8" />
          <span className="font-bold text-xl tracking-tight">Sistemas V</span>
        </div>
        
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('tutorial')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'tutorial' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <BookOpen size={20} />
            <span className="font-medium">Tutorial Teórico</span>
          </button>
          <button 
            onClick={() => setActiveTab('auditoria')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'auditoria' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <ShieldCheck size={20} />
            <span className="font-medium">Herramienta Auditoría</span>
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Gestión Mantenimiento</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="md:ml-64 p-4 md:p-10">
        
        {/* SECTION: TUTORIAL */}
        {activeTab === 'tutorial' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Tutorial de Implementación</h1>
              <p className="text-slate-500 text-lg">Aprendiendo a auditar y mantener software profesionalmente.</p>
            </header>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4 text-blue-600">
                <Code size={24} />
                <h2 className="text-2xl font-bold">1. ¿Cómo funciona la Auditoría de Código?</h2>
              </div>
              <p className="text-slate-600 mb-4 leading-relaxed">
                La auditoría estática de código consiste en analizar el código fuente sin ejecutarlo. Se buscan patrones que violen las "reglas de negocio" o "estándares de la industria".
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="bg-slate-50 p-4 rounded-lg border border-slate-100 italic">
                  "El auditor no es un enemigo, es el primer filtro de calidad antes de producción."
                </li>
                <li className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <strong>Regla de Oro:</strong> Automatiza lo que puedas, revisa manualmente lo lógico.
                </li>
              </ul>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4 text-emerald-600">
                <LayoutDashboard size={24} />
                <h2 className="text-2xl font-bold">2. El Ciclo de Vida del Mantenimiento</h2>
              </div>
              <p className="text-slate-600 mb-6">
                Para gestionar el mantenimiento eficazmente, cada solicitud debe ser categorizada y priorizada. No es lo mismo un error que impide cobrar (Correctivo Crítico) que una mejora estética (Perfectivo Baja).
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">Correctivo</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Adaptativo</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">Perfectivo</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">Preventivo</span>
              </div>
            </section>
          </div>
        )}

        {/* SECTION: AUDITORÍA TOOL */}
        {activeTab === 'auditoria' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Linter Básico de Auditoría</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Editor */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Código a analizar (JS/HTML)</label>
                <textarea 
                  className="w-full h-80 p-4 font-mono text-sm bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 shadow-inner focus:ring-2 focus:ring-blue-500 outline-none"
                  value={codeToAudit}
                  onChange={(e) => setCodeToAudit(e.target.value)}
                />
                <button 
                  onClick={runAudit}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Search size={20} /> Ejecutar Auditoría
                </button>
              </div>

              {/* Resultados */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold">Hallazgos de Seguridad/Calidad</h3>
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{auditResults.length}</span>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto max-h-[400px]">
                  {auditResults.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                      <CheckCircle2 className="mx-auto mb-2 opacity-20" size={48} />
                      <p>No se encontraron problemas evidentes.</p>
                    </div>
                  ) : (
                    auditResults.map((res, i) => (
                      <div key={i} className={`p-4 rounded-lg border-l-4 ${res.severity === 'Media' ? 'bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-300'}`}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-bold uppercase text-slate-400">Línea {res.line}</span>
                          <span className={`text-xs font-bold ${res.severity === 'Media' ? 'text-amber-700' : 'text-slate-500'}`}>{res.severity}</span>
                        </div>
                        <p className="text-sm text-slate-700">{res.msg}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: DASHBOARD MANTENIMIENTO */}
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold">Gestión de Mantenimiento</h2>
                <p className="text-slate-500">Control de deuda técnica y evolutivos.</p>
              </div>
              <div className="flex gap-4 text-center">
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                  <p className="text-xl font-bold">{tickets.length}</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase">Abiertos</p>
                  <p className="text-xl font-bold text-blue-600">{tickets.filter(t=>t.status==='Abierto').length}</p>
                </div>
              </div>
            </div>

            {/* Nuevo Ticket */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-600">Descripción del Cambio / Error</label>
                <input 
                  type="text"
                  placeholder="Ej: Error 404 al loguearse..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">Tipo</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  value={newTicket.type}
                  onChange={(e) => setNewTicket({...newTicket, type: e.target.value})}
                >
                  <option>Correctivo</option>
                  <option>Adaptativo</option>
                  <option>Perfectivo</option>
                  <option>Preventivo</option>
                </select>
              </div>
              <button 
                onClick={addTicket}
                className="bg-blue-600 hover:bg-blue-700 text-white h-[50px] rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-100"
              >
                <PlusCircle size={20} /> Crear Ticket
              </button>
            </div>

            {/* Lista de Tickets */}
            <div className="grid grid-cols-1 gap-4">
              {tickets.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-20 text-center text-slate-400">
                   El backlog está vacío. ¡Buen trabajo!
                </div>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className={`group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${ticket.status === 'Resuelto' ? 'opacity-60 grayscale' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        ticket.type === 'Correctivo' ? 'bg-red-50 text-red-600' :
                        ticket.type === 'Adaptativo' ? 'bg-blue-50 text-blue-600' :
                        ticket.type === 'Perfectivo' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {ticket.type === 'Correctivo' ? <AlertCircle size={24} /> : <Settings size={24} />}
                      </div>
                      <div>
                        <h4 className={`font-bold text-lg ${ticket.status === 'Resuelto' ? 'line-through text-slate-400' : ''}`}>{ticket.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <span className="font-medium">{ticket.type}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>{ticket.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleStatus(ticket.id, ticket.status)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${ticket.status === 'Abierto' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        <CheckCircle2 size={18} />
                        {ticket.status === 'Abierto' ? 'Resolver' : 'Reabrir'}
                      </button>
                      <button 
                        onClick={() => deleteTicket(ticket.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* Footer / Credits */}
      <footer className="md:ml-64 p-6 text-center text-slate-400 text-sm">
        Unidad 5: Mantenimiento - Ingeniería de Sistemas &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;