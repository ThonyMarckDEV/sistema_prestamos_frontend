import React from 'react';
import { InboxStackIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const CajaForm = ({ data, handleChange }) => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-6 uppercase tracking-wide border-b border-slate-100 pb-3">
                <InboxStackIcon className="w-6 h-6 text-red-600" /> Configuración de Caja
            </h3>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre de la Caja *</label>
                    <input 
                        type="text" 
                        value={data.nombre || ''} 
                        onChange={(e) => handleChange('nombre', e.target.value)} 
                        className="w-full p-3.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" 
                        placeholder="Ej: Caja 01" 
                        required 
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Descripción / Ubicación</label>
                    <div className="relative">
                        <DocumentTextIcon className="w-5 h-5 absolute left-3 top-3.5 text-slate-400"/>
                        <textarea 
                            value={data.descripcion || ''} 
                            onChange={(e) => handleChange('descripcion', e.target.value)} 
                            className="w-full pl-10 p-3.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all min-h-[100px]" 
                            placeholder="Detalles sobre dónde se ubica o para qué se usa..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CajaForm;