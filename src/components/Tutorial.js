import React from 'react';
import { Code, LayoutDashboard } from 'lucide-react';

const Tutorial = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Tutorial de Implementación</h1>
        <p className="text-slate-500 text-lg">Aprendiendo a auditar y mantener software profesionalmente.</p>
      </header>

      <section className="bg-white p-8 rounded-2xl shadow-sm border border-purple-200">
        <div className="flex items-center gap-3 mb-4 text-purple-600">
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
          <li className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <strong>Regla de Oro:</strong> Automatiza lo que puedas, revisa manualmente lo lógico.
          </li>
        </ul>
      </section>

      <section className="bg-white p-8 rounded-2xl shadow-sm border border-purple-200">
        <div className="flex items-center gap-3 mb-4 text-purple-500">
          <LayoutDashboard size={24} />
          <h2 className="text-2xl font-bold">2. El Ciclo de Vida del Mantenimiento</h2>
        </div>
        <p className="text-slate-600 mb-6">
          Para gestionar el mantenimiento eficazmente, cada solicitud debe ser categorizada y priorizada. No es lo mismo un error que impide cobrar (Correctivo Crítico) que una mejora estética (Perfectivo Baja).
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">Correctivo</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">Adaptativo</span>
          <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold">Perfectivo</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">Preventivo</span>
        </div>
      </section>
    </div>
  );
};

export default Tutorial;
