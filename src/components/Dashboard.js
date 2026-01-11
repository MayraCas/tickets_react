import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle2, AlertCircle, Trash2, Settings } from 'lucide-react';
import { db } from '../FirebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ title: '', type: 'Correctivo', priority: 'Media' });

  // Lógica de Firebase
  useEffect(() => {
    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setTickets(docs);
    },
    (error) => {
      console.error("Error al obtener tickets: ", error);
    });

    return () => unsubscribe();
  }, []);

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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Gestión de Mantenimiento</h2>
          <p className="text-slate-500">Control de deuda técnica y evolutivos.</p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-white px-4 py-2 rounded-xl border border-purple-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
            <p className="text-xl font-bold">{tickets.length}</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-purple-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase">Abiertos</p>
            <p className="text-xl font-bold text-purple-600">{tickets.filter(t=>t.status==='Abierto').length}</p>
          </div>
        </div>
      </div>

      {/* Nuevo Ticket */}
      <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-slate-600">Descripción del Cambio / Error</label>
          <input 
            type="text"
            placeholder="Ej: Error 404 al loguearse..."
            className="w-full p-3 bg-purple-50 border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
            value={newTicket.title}
            onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600">Tipo</label>
          <select 
            className="w-full p-3 bg-purple-50 border border-purple-200 rounded-xl outline-none"
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
          className="bg-purple-600 hover:bg-purple-700 text-white h-[50px] rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-100"
        >
          <PlusCircle size={20} /> Crear Ticket
        </button>
      </div>

      {/* Lista de Tickets */}
      <div className="grid grid-cols-1 gap-4">
        {tickets.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-purple-200 rounded-2xl py-20 text-center text-slate-400">
             El backlog está vacío. ¡Buen trabajo!
          </div>
        ) : (
          tickets.map(ticket => (
            <div key={ticket.id} className={`group bg-white p-5 rounded-2xl border border-purple-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${ticket.status === 'Resuelto' ? 'opacity-60 grayscale' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  ticket.type === 'Correctivo' ? 'bg-red-50 text-red-600' :
                  ticket.type === 'Adaptativo' ? 'bg-purple-50 text-purple-600' :
                  ticket.type === 'Perfectivo' ? 'bg-purple-100 text-purple-700' : 'bg-purple-50 text-purple-500'
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
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${ticket.status === 'Abierto' ? 'bg-purple-50 text-purple-700 hover:bg-purple-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
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
  );
};

export default Dashboard;
