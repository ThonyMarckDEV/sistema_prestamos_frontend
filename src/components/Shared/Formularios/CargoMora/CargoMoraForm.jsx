import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

const CargoMoraForm = ({ data, handleChange }) => {
    const inputs = [
        { label: 'S/ 300 - 1000', key: 'monto_300_1000' },
        { label: 'S/ 1001 - 2000', key: 'monto_1001_2000' },
        { label: 'S/ 2001 - 3000', key: 'monto_2001_3000' },
        { label: 'S/ 3001 - 4000', key: 'monto_3001_4000' },
        { label: 'S/ 4001 - 5000', key: 'monto_4001_5000' },
        { label: 'S/ 5001 - 6000', key: 'monto_5001_6000' },
        { label: 'S/ 6001 a más', key: 'monto_mas_6000' }
    ];

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Rango de Días de Atraso *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <ClockIcon className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
                            <input type="number" min="0" value={data.dias_min ?? ''} onChange={e => handleChange('dias_min', e.target.value)}
                                className="w-full pl-10 p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-800"
                                placeholder="Mínimo (Ej: 1)" required />
                        </div>
                        <div className="relative">
                            <ClockIcon className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
                            <input type="number" min={data.dias_min || 0} value={data.dias_max ?? ''} onChange={e => handleChange('dias_max', e.target.value)}
                                className="w-full pl-10 p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-slate-800"
                                placeholder="Máximo (Vacío para Infinito)" />
                        </div>
                    </div>
                </div>

                {inputs.map(i => (
                    <div key={i.key}>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{i.label}</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-slate-400 font-bold">S/</span>
                            <input type="number" step="0.01" value={data[i.key] ?? ''} onChange={e => handleChange(i.key, e.target.value)}
                                className="w-full pl-8 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-black text-slate-700" required />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default CargoMoraForm;