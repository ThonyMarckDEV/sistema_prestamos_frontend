import React from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';

/**
 * CalculadoraCuota — Widget de previsualización de cuota.
 *
 * Props:
 * - monto:             number  — capital base
 * - tasa:              number  — % de interés (TEM)
 * - cuotas:            number  — número de cuotas
 * - frecuencia:        string  — SEMANAL, CATORCENAL, MENSUAL
 * - seguro:            number  — Monto del seguro
 * - seguro_financiado: boolean — true si se suma a las cuotas, false si se paga en efectivo
 * - className:         string  — clases extra opcionales
 */
const CalculadoraCuota = ({ monto = 0, tasa = 0, cuotas = 0, frecuencia = 'MENSUAL', seguro = 0, seguro_financiado = false, className = '' }) => {
    const montoBase    = parseFloat(monto)  || 0;
    const tasaNum      = parseFloat(tasa)   || 0;
    const cuotasNum    = parseInt(cuotas)   || 0;
    const seguroNum    = parseFloat(seguro) || 0;
    
    // Aseguramos que sea un booleano (por si viene como string del select)
    const isFinanciado = String(seguro_financiado) === 'true' || String(seguro_financiado) === '1';

    if (montoBase <= 0 || tasaNum <= 0 || cuotasNum <= 0) return null;

    let meses = 0;
    if (frecuencia === 'SEMANAL') {
        meses = cuotasNum / 4;
    } else if (frecuencia === 'CATORCENAL') {
        meses = cuotasNum / 2;
    } else if (frecuencia === 'MENSUAL') {
        meses = cuotasNum;
    }

    // Matemática financiera
    const interesGenerado = round(montoBase * (tasaNum / 100) * meses);
    
    // Si el seguro es financiado, se suma al total a dividir. Si no, no suma a las cuotas.
    const totalFinanciado = round(montoBase + interesGenerado + (isFinanciado ? seguroNum : 0));
    
    const valorCuota      = round(totalFinanciado / cuotasNum);

    return (
        <div className={`bg-slate-900 rounded-xl p-4 flex flex-col xl:flex-row justify-between items-center gap-4 shadow-inner border border-slate-800 ${className}`}>
            
            {/* Izquierda: Desglose */}
            <div className="flex items-center gap-2 sm:gap-3 w-full xl:w-auto flex-wrap sm:flex-nowrap">
                <div className="p-2 bg-brand-gold/20 rounded-lg flex-shrink-0 hidden sm:block">
                    <CalculatorIcon className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Monto Base</p>
                    <p className="text-sm font-black text-white">S/ {fmt(montoBase)}</p>
                </div>
                <div className="text-slate-500 font-black">+</div>
                <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Interés</p>
                    <p className="text-sm font-black text-brand-red-light">S/ {fmt(interesGenerado)}</p>
                </div>
                
                {seguroNum > 0 && (
                    <>
                        <div className="text-slate-500 font-black">+</div>
                        <div>
                            <p className="text-[10px] text-brand-gold-dark uppercase font-bold">
                                Seguro {isFinanciado ? '(Cuotas)' : '(Previo)'}
                            </p>
                            <p className="text-sm font-black text-brand-gold">S/ {fmt(seguroNum)}</p>
                        </div>
                    </>
                )}
            </div>

            {/* Derecha: Cuota y Total */}
            <div className="flex gap-4 sm:gap-6 w-full xl:w-auto border-t xl:border-t-0 xl:border-l border-slate-700 pt-4 xl:pt-0 xl:pl-6 justify-between xl:justify-end">
                <div className="text-left xl:text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Cuota Aprox. ({cuotasNum})</p>
                    <p className="text-lg font-black text-slate-200">S/ {fmt(valorCuota)}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-green-400 uppercase font-black">Total Financiado</p>
                    <p className="text-xl font-black text-green-400">S/ {fmt(totalFinanciado)}</p>
                    {!isFinanciado && seguroNum > 0 && (
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">+ S/ {fmt(seguroNum)} cobrados hoy</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const round = n  => Math.round(n * 100) / 100;
const fmt   = n  => parseFloat(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

export default CalculadoraCuota;