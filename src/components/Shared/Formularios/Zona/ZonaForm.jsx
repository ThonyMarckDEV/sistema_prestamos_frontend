import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

const ZonaForm = ({ data, handleChange }) => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-6 uppercase tracking-wide border-b border-slate-100 pb-3">
                <MapPinIcon className="w-6 h-6 text-red-600" /> Configuración de Zona Operativa
            </h3>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre de la Zona *</label>
                    <input 
                        type="text" 
                        value={data.nombre || ''} 
                        onChange={(e) => handleChange('nombre', e.target.value)} 
                        className="w-full p-3.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" 
                        placeholder="Ej: TALARA ALTA 2" 
                        required 
                    />
                    <p className="text-[10px] text-slate-400 mt-2 ml-1 italic">
                        El nombre debe ser único. Se usará para agrupar clientes y grupos solidarios.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ZonaForm;