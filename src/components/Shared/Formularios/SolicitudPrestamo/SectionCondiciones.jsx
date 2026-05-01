import React from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { onlyNumbers } from 'utilities/Validations/validations';
import CalculadoraCuota from 'components/Shared/CalculadoraCuota';

const SectionCondiciones = ({ data, handleChange, isBlocked }) => {
    
    const numIntegrantes = data.es_grupal ? Math.max(1, data.integrantes?.length || 1) : 1;

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <h3 className="text-sm font-black text-slate-700 uppercase mb-4 flex items-center gap-2">
                <BanknotesIcon className="w-5 h-5 text-brand-red" /> Condiciones del Préstamo
            </h3>

             <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
            <div className="col-span-2 md:col-span-1">
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
            <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Frecuencia</label>
                <select disabled={isBlocked} value={data.frecuencia} onChange={e => handleChange('frecuencia', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red disabled:cursor-not-allowed">
                    <option value="SEMANAL">SEMANAL</option>
                    <option value="CATORCENAL">CATORCENAL</option>
                    <option value="MENSUAL">MENSUAL</option>
                </select>
            </div>
                <div>
                    <label className="block text-[10px] font-bold text-brand-gold-dark uppercase mb-1">
                        Seguro x Cliente (S/)
                    </label>
                    <input
                        disabled={isBlocked} type="text" value={data.seguro}
                        onChange={e => handleChange('seguro', e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'))}
                        placeholder="0.00"
                        className="w-full p-2.5 bg-brand-gold-light/20 border border-brand-gold/30 rounded-lg text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold disabled:cursor-not-allowed"
                    />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] font-bold text-brand-gold-dark uppercase mb-1">Cobro Seguro</label>
                    <select 
                        disabled={isBlocked} 
                        value={String(data.seguro_financiado) === 'true' || String(data.seguro_financiado) === '1' ? 'true' : 'false'} 
                        onChange={e => handleChange('seguro_financiado', e.target.value === 'true')} 
                        className="w-full p-2.5 bg-brand-gold-light/20 border border-brand-gold/30 rounded-lg text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold disabled:cursor-not-allowed"
                    >
                        <option value="false">Efectivo (Previo)</option>
                        <option value="true">Financiado (Cuotas)</option>
                    </select>
                </div>
            </div>

            <CalculadoraCuota
                monto={data.monto_solicitado}
                tasa={data.tasa_interes}
                cuotas={data.cuotas_solicitadas}
                frecuencia={data.frecuencia}
                seguro={data.seguro}
                seguro_financiado={data.seguro_financiado}
                cantidadIntegrantes={numIntegrantes}
                className="mt-6"
            />
        </div>
    );
};

export default SectionCondiciones;