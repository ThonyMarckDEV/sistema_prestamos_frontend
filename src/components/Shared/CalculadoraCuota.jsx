import React from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';

/**
 * CalculadoraCuota — Widget de previsualización de cuota.
 *
 * Props:
 * - monto:               number  — capital base
 * - tasa:                number  — % de interés (TEM)
 * - cuotas:              number  — número de cuotas
 * - frecuencia:          string  — SEMANAL, CATORCENAL, MENSUAL
 * - seguro:              number  — Monto del seguro individual
 * - seguro_financiado:   boolean — true si se suma a las cuotas, false si se paga en efectivo
 * - cantidadIntegrantes: number  — Número de integrantes para multiplicar el seguro
 * - className:           string  — clases extra opcionales
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

    let meses = 0;
    if (frecuencia === 'SEMANAL')         meses = cuotasNum / 4;
    else if (frecuencia === 'CATORCENAL') meses = cuotasNum / 2;
    else if (frecuencia === 'MENSUAL')    meses = cuotasNum;

    const interesGenerado = round(montoBase * (tasaNum / 100) * meses);
    const totalFinanciado = round(montoBase + interesGenerado + (isFinanciado ? seguroTotal : 0));
    const valorCuota      = round(totalFinanciado / cuotasNum);

    return (
        <div className={`relative overflow-hidden bg-brand-red rounded-[24px] p-5 flex flex-col xl:flex-row justify-between items-center gap-4 shadow-xl border border-brand-red-dark text-white ${className}`}>

            {/* Brillo decorativo */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-brand-red-light opacity-10 rounded-full blur-3xl pointer-events-none" />

            {/* Izquierda: ícono + desglose */}
            <div className="flex items-center gap-3 w-full xl:w-auto flex-wrap sm:flex-nowrap z-10">
                <div className="p-2.5 bg-brand-red-dark rounded-2xl shadow-inner border border-brand-red-dark/50 flex-shrink-0 hidden sm:flex">
                    <CalculatorIcon className="w-6 h-6 text-brand-gold" />
                </div>

                <Item label="Monto Base" value={`S/ ${fmt(montoBase)}`} />
                <Sep />
                <Item label="Interés" value={`S/ ${fmt(interesGenerado)}`} muted />

                {seguroTotal > 0 && (
                    <>
                        <Sep />
                        <Item
                            label={`Seguro${nIntegrantes > 1 ? ` (${nIntegrantes}x)` : ''} ${isFinanciado ? '(Cuotas)' : '(Previo)'}`}
                            value={`S/ ${fmt(seguroTotal)}`}
                            gold
                        />
                    </>
                )}
            </div>

            {/* Derecha: cuota + total */}
            <div className="flex gap-6 w-full xl:w-auto border-t xl:border-t-0 xl:border-l border-brand-red-dark pt-4 xl:pt-0 xl:pl-6 justify-between xl:justify-end z-10">
                <div className="text-left xl:text-right">
                    <p className="text-[9px] font-black text-brand-red-light/80 uppercase tracking-[0.15em] mb-1">
                        Cuota Aprox. ({cuotasNum})
                    </p>
                    <p className="text-xl font-black text-white tracking-tight">S/ {fmt(valorCuota)}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-brand-gold uppercase tracking-[0.15em] mb-1">
                        Total Financiado
                    </p>
                    <p className="text-2xl font-black text-brand-gold tracking-tighter drop-shadow-sm">
                        S/ {fmt(totalFinanciado)}
                    </p>
                    {!isFinanciado && seguroTotal > 0 && (
                        <p className="text-[9px] text-brand-red-light/70 font-bold mt-0.5">
                            + S/ {fmt(seguroTotal)} cobrados hoy
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Sub-componentes ───────────────────────────────────────────────────────────
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