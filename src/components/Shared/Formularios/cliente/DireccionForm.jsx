import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

const DireccionForm = ({ data, handleNestedChange }) => {
    const d = data.direccion;
    const onD = (field, value) => handleNestedChange('direccion', field, value);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-5 uppercase tracking-wide">
                <MapPinIcon className="w-5 h-5 text-red-600" /> Dirección
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Dirección Fiscal/Domicilio *</label>
                    <input type="text" value={d.direccionFiscal || ''} onChange={(e) => onD('direccionFiscal', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Departamento *</label>
                    <input type="text" value={d.departamento || ''} onChange={(e) => onD('departamento', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Provincia *</label>
                    <input type="text" value={d.provincia || ''} onChange={(e) => onD('provincia', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Distrito *</label>
                    <input type="text" value={d.distrito || ''} onChange={(e) => onD('distrito', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">T. Residencia *</label>
                    <input type="text" value={d.tiempoResidencia || ''} onChange={(e) => onD('tiempoResidencia', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="Ej: 2 años" required />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tipo de Vivienda *</label>
                    <select value={d.tipoVivienda || ''} onChange={(e) => onD('tipoVivienda', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required>
                        <option value="">-- Seleccionar --</option>
                        <option value="Propia">Propia</option>
                        <option value="Alquilada">Alquilada</option>
                        <option value="Familiar">Familiar</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
export default DireccionForm;