import React from 'react';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { onlyNumbers } from 'utilities/Validations/validations';

const EmpleoForm = ({ data, handleNestedChange }) => {
    // Solo mostrar si es persona natural (tipo 1)
    if (Number(data.datos_cliente.tipo) !== 1) return null;

    const emp = data.empleo;
    const onEmp = (field, value) => handleNestedChange('empleo', field, value);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-5 uppercase tracking-wide">
                <BriefcaseIcon className="w-5 h-5 text-red-600" /> Datos Laborales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Centro Laboral</label>
                    <input type="text" value={emp.centroLaboral || ''} onChange={(e) => onEmp('centroLaboral', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Ingreso Mensual (S/)</label>
                    <input type="text" value={emp.ingresoMensual || ''} onChange={(e) => onEmp('ingresoMensual', onlyNumbers(e.target.value))} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="0.00" />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Inicio Laboral</label>
                    <input type="date" value={emp.inicioLaboral || ''} onChange={(e) => onEmp('inicioLaboral', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Situación Laboral</label>
                    <select value={emp.situacionLaboral || ''} onChange={(e) => onEmp('situacionLaboral', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none">
                        <option value="">-- Seleccionar --</option>
                        <option value="Dependiente">Dependiente</option>
                        <option value="Independiente">Independiente</option>
                        <option value="Jubilado">Jubilado</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
export default EmpleoForm;