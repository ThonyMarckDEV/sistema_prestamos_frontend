import React from 'react';
import { BanknotesIcon, CalculatorIcon } from '@heroicons/react/24/outline';
import { onlyNumbers } from 'utilities/Validations/validations';

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

        {/* WIDGET CALCULADORA CORPORATIVA */}
        {calc.montoBase > 0 && (
            <div className="mt-6 bg-slate-900 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-inner relative z-10 border border-slate-800">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="p-2 bg-brand-gold/20 rounded-lg"><CalculatorIcon className="w-6 h-6 text-brand-gold" /></div>
                    <div><p className="text-[10px] text-slate-400 uppercase font-bold">Monto Base</p><p className="text-sm font-black text-white">S/ {calc.montoBase.toFixed(2)}</p></div>
                    <div className="text-slate-500 font-black">+</div>
                    <div><p className="text-[10px] text-slate-400 uppercase font-bold">Interés ({calc.porcentajeInteres}%)</p><p className="text-sm font-black text-brand-red-light">S/ {calc.interesGenerado.toFixed(2)}</p></div>
                </div>
                <div className="flex gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6 justify-between md:justify-end">
                    <div className="text-left md:text-right"><p className="text-[10px] text-slate-400 uppercase font-bold">Cuota Aprox. ({calc.nCuotas})</p><p className="text-lg font-black text-slate-200">S/ {calc.valorCuotaAprox.toFixed(2)}</p></div>
                    {/* El total a pagar lo dejamos verde porque financieramente significa saldo/éxito */}
                    <div className="text-right"><p className="text-[10px] text-green-400 uppercase font-black">Total a Pagar</p><p className="text-2xl font-black text-green-400">S/ {calc.totalAPagar.toFixed(2)}</p></div>
                </div>
            </div>
        )}
    </div>
);
export default SectionCondiciones;