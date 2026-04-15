import React from 'react';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const SectionNotas = ({ data, handleChange, isBlocked }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-xs font-black text-slate-700 uppercase mb-2 flex items-center gap-2">
            <ClipboardDocumentListIcon className="w-5 h-5 text-slate-400" /> Notas Internas
        </h3>
        <textarea 
            disabled={isBlocked}
            value={data.observaciones || ''} 
            onChange={e => handleChange('observaciones', e.target.value)}
            placeholder="Ej: Cliente con buen historial, ingresos demostrables..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-red-500 outline-none min-h-[80px] disabled:cursor-not-allowed"
        />
    </div>
);
export default SectionNotas;