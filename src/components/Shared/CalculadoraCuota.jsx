import React from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';

/**
 * CalculadoraCuota — Widget de previsualización de cuota.
 *
 * Props:
 * - monto:      number  — capital base
 * - tasa:       number  — % de interés
 * - cuotas:     number  — número de cuotas
 * - className:  string  — clases extra opcionales
 */
const CalculadoraCuota = ({ monto = 0, tasa = 0, cuotas = 0, className = '' }) => {
    const montoBase       = parseFloat(monto)  || 0;
    const tasaNum         = parseFloat(tasa)   || 0;
    const cuotasNum       = parseInt(cuotas)   || 0;

    if (montoBase <= 0 || tasaNum <= 0 || cuotasNum <= 0) return null;

    const interesGenerado = round(montoBase * (tasaNum / 100));
    const totalAPagar     = round(montoBase + interesGenerado);
    const valorCuota      = round(totalAPagar / cuotasNum);

    return (
        <div className={`bg-slate-900 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-inner border border-slate-800 ${className}`}>
            {/* Izquierda: monto + interés */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="p-2 bg-brand-gold/20 rounded-lg flex-shrink-0">
                    <CalculatorIcon className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Monto Base</p>
                    <p className="text-sm font-black text-white">S/ {fmt(montoBase)}</p>
                </div>
                <div className="text-slate-500 font-black">+</div>
                <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Interés ({tasaNum}%)</p>
                    <p className="text-sm font-black text-brand-red-light">S/ {fmt(interesGenerado)}</p>
                </div>
            </div>

            {/* Derecha: cuota + total */}
            <div className="flex gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6 justify-between md:justify-end">
                <div className="text-left md:text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Cuota Aprox. ({cuotasNum})</p>
                    <p className="text-lg font-black text-slate-200">S/ {fmt(valorCuota)}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-green-400 uppercase font-black">Total a Pagar</p>
                    <p className="text-xl font-black text-green-400">S/ {fmt(totalAPagar)}</p>
                </div>
            </div>
        </div>
    );
};

const round = n  => Math.round(n * 100) / 100;
const fmt   = n  => parseFloat(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

export default CalculadoraCuota;