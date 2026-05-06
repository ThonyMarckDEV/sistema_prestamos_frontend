import React from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';

/**
 * CalculadoraCuota — Corregida para Talara Créditos
 * Lógica: (Monto Aprobado * (Tasa/100) * Meses)
 */
const CalculadoraCuota = ({
    monto = 0,
    tasa = 0,
    cuotas = 0,
    frecuencia = 'MENSUAL',
    seguro = 0,
    seguro_financiado = false,
    cantidadIntegrantes = 1,
    className = ''
}) => {
    const montoBase        = parseFloat(monto)  || 0;
    const tasaNum          = parseFloat(tasa)   || 0;
    const cuotasNum        = parseInt(cuotas)   || 0;
    const seguroIndividual = parseFloat(seguro) || 0;
    const nIntegrantes     = parseInt(cantidadIntegrantes) || 1;
    const seguroTotal      = seguroIndividual * nIntegrantes;
    const isFinanciado     = String(seguro_financiado) === 'true' || String(seguro_financiado) === '1';

    if (montoBase <= 0 || tasaNum <= 0 || cuotasNum <= 0) return null;

    // 1. Calculamos los meses reales según la frecuencia
    let meses = 0;
    if (frecuencia === 'SEMANAL')      meses = cuotasNum / 4;
    else if (frecuencia === 'CATORCENAL') meses = cuotasNum / 2;
    else meses = cuotasNum;

    // 2. Monto Aprobado (Base para el interés)
    const montoAprobado = montoBase + (isFinanciado ? seguroTotal : 0);

    // 3. Interés: Monto Aprobado * %Mensual * Número de meses
    const interesGenerado = round(montoAprobado * (tasaNum / 100) * meses);

    // 4. Total a Pagar
    const totalFinanciado = round(montoAprobado + interesGenerado);

    // 5. Valor Cuota (Total / Número de cuotas)
    const valorCuota      = round(totalFinanciado / cuotasNum);

    return (
        <div className={`relative overflow-hidden bg-brand-red rounded-[24px] p-5 flex flex-col xl:flex-row justify-between items-center gap-4 shadow-xl border border-brand-red-dark text-white ${className}`}>
            
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-brand-red-light opacity-10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 w-full xl:w-auto flex-wrap sm:flex-nowrap z-10">
                <div className="p-2.5 bg-brand-red-dark rounded-2xl shadow-inner border border-brand-red-dark/50 flex-shrink-0 hidden sm:flex">
                    <CalculatorIcon className="w-6 h-6 text-brand-gold" />
                </div>

                <Item label="Monto Aprobado" value={`S/ ${fmt(montoAprobado)}`} />
                <Sep />
                <Item label={`Interés (${meses} meses)`} value={`S/ ${fmt(interesGenerado)}`} muted />

                {seguroTotal > 0 && (
                    <>
                        <Sep />
                        <Item
                            label={`Seguro Total`}
                            value={`S/ ${fmt(seguroTotal)}`}
                            gold
                        />
                    </>
                )}
            </div>

            <div className="flex gap-6 w-full xl:w-auto border-t xl:border-t-0 xl:border-l border-brand-red-dark pt-4 xl:pt-0 xl:pl-6 justify-between xl:justify-end z-10">
                <div className="text-left xl:text-right">
                    <p className="text-[9px] font-black text-brand-red-light/80 uppercase tracking-[0.15em] mb-1">
                        Cuota ({cuotasNum} {frecuencia.toLowerCase()})
                    </p>
                    <p className="text-xl font-black text-white tracking-tight">S/ {fmt(valorCuota)}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-brand-gold uppercase tracking-[0.15em] mb-1">
                        Total a Cobrar
                    </p>
                    <p className="text-2xl font-black text-brand-gold tracking-tighter drop-shadow-sm">
                        S/ {fmt(totalFinanciado)}
                    </p>
                </div>
            </div>
        </div>
    );
};

const Sep  = () => <div className="text-brand-red-light/50 font-black text-lg">+</div>;
const Item = ({ label, value, muted = false, gold = false }) => (
    <div>
        <p className="text-[9px] font-black text-brand-red-light/80 uppercase tracking-[0.15em] mb-0.5">{label}</p>
        <p className={`text-sm font-black ${gold ? 'text-brand-gold' : muted ? 'text-brand-red-light' : 'text-white'}`}>
            {value}
        </p>
    </div>
);

const round = n => Math.round(n * 100) / 100;
const fmt   = n => parseFloat(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

export default CalculadoraCuota;