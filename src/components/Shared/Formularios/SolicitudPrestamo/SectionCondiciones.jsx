import React from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { onlyNumbers } from 'utilities/Validations/validations';
import CalculadoraCuota from 'components/Shared/CalculadoraCuota';

const SectionCondiciones = ({ data, handleChange, isBlocked, calc }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
        <h3 className="text-sm font-black text-slate-700 uppercase mb-4 flex items-center gap-2">
            <BanknotesIcon className="w-5 h-5 text-brand-red" /> Condiciones del Préstamo
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Monto Total (S/)</label>
                <input
                    disabled={isBlocked} readOnly={data.es_grupal} type="text" value={data.monto_solicitado}
                    onChange={e => handleChange('monto_solicitado', e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'))}
                    className={`w-full p-2.5 border rounded-lg text-sm font-black outline-none disabled:cursor-not-allowed ${data.es_grupal ? 'bg-brand-red-light/50 border-brand-red/20 text-brand-red' : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-brand-red focus:border-brand-red'}`}
                />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tasa Interés %</label>
                <input
                    disabled={isBlocked} type="text" value={data.tasa_interes}
                    onChange={e => handleChange('tasa_interes', e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red disabled:cursor-not-allowed"
                />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">N° Cuotas</label>
                <input
                    disabled={isBlocked} type="text" value={data.cuotas_solicitadas}
                    onChange={e => handleChange('cuotas_solicitadas', onlyNumbers(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red disabled:cursor-not-allowed"
                />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Frecuencia</label>
                <select disabled={isBlocked} value={data.frecuencia} onChange={e => handleChange('frecuencia', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red disabled:cursor-not-allowed">
                    <option value="SEMANAL">SEMANAL</option>
                    <option value="CATORCENAL">CATORCENAL</option>
                    <option value="MENSUAL">MENSUAL</option>
                </select>
            </div>
        </div>

        <CalculadoraCuota
            monto={data.monto_solicitado}
            tasa={data.tasa_interes}
            cuotas={data.cuotas_solicitadas}
            className="mt-6"
        />
    </div>
);

export default SectionCondiciones;