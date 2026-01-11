import React, { useState } from 'react';
import { CheckCircle2, Search } from 'lucide-react';

const AuditoriaTool = () => {
  const [codeToAudit, setCodeToAudit] = useState('// Pega tu código aquí\nvar x = 10;\nfunction test(){\n  if(x == 10){\n    alert("Error");\n  }\n}');
  const [auditResults, setAuditResults] = useState([]);

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
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold">Linter Básico de Auditoría</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Código a analizar (JS/HTML)</label>
          <textarea 
            className="w-full h-80 p-4 font-mono text-sm bg-slate-900 text-purple-300 rounded-xl border border-slate-800 shadow-inner focus:ring-2 focus:ring-purple-500 outline-none"
            value={codeToAudit}
            onChange={(e) => setCodeToAudit(e.target.value)}
          />
          <button 
            onClick={runAudit}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Search size={20} /> Ejecutar Auditoría
          </button>
        </div>

        {/* Resultados */}
        <div className="bg-white rounded-xl border border-purple-200 overflow-hidden shadow-sm">
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-200 flex justify-between items-center">
            <h3 className="font-bold">Hallazgos de Seguridad/Calidad</h3>
            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">{auditResults.length}</span>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-[400px]">
            {auditResults.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <CheckCircle2 className="mx-auto mb-2 opacity-20" size={48} />
                <p>No se encontraron problemas evidentes.</p>
              </div>
            ) : (
              auditResults.map((res, i) => (
                <div key={i} className={`p-4 rounded-lg border-l-4 ${res.severity === 'Media' ? 'bg-purple-50 border-purple-400' : 'bg-slate-50 border-slate-300'}`}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold uppercase text-slate-400">Línea {res.line}</span>
                    <span className={`text-xs font-bold ${res.severity === 'Media' ? 'text-purple-700' : 'text-slate-500'}`}>{res.severity}</span>
                  </div>
                  <p className="text-sm text-slate-700">{res.msg}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditoriaTool;
