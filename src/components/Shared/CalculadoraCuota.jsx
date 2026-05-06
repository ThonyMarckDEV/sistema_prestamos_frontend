import React, { useState } from 'react';
import { CalculatorIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

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
    const [showFormulas, setShowFormulas] = useState(false);

    const montoBase        = parseFloat(monto)  || 0;
    const tasaNum          = parseFloat(tasa)   || 0;
    const cuotasNum        = parseInt(cuotas)   || 0;
    const seguroIndividual = parseFloat(seguro) || 0;
    const nIntegrantes     = parseInt(cantidadIntegrantes) || 1;
    const seguroTotal      = round(seguroIndividual * nIntegrantes);
    const isFinanciado     = String(seguro_financiado) === 'true' || String(seguro_financiado) === '1';

    if (montoBase <= 0 || tasaNum <= 0 || cuotasNum <= 0) return null;

    let mesesTotales = cuotasNum;
    if (frecuencia === 'SEMANAL')         mesesTotales = cuotasNum / 4;
    else if (frecuencia === 'CATORCENAL') mesesTotales = cuotasNum / 2;

    const montoAprobado   = round(montoBase + (isFinanciado ? seguroTotal : 0));
    const amortizacion    = round(montoAprobado / cuotasNum);
    const interesPorCuota = round(amortizacion * (tasaNum / 100) * mesesTotales);
    const seguroPorCuota  = seguroTotal > 0 ? round(seguroTotal / cuotasNum) : 0;
    const valorCuota      = round(amortizacion + interesPorCuota);
    const totalFinanciado = round(valorCuota * cuotasNum);

    return (
        <div className={`relative overflow-hidden bg-brand-red rounded-[24px] shadow-xl border border-brand-red-dark text-white ${className}`}>

            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-brand-red-light opacity-10 rounded-full blur-3xl pointer-events-none" />

            {/* ── Fila principal ── */}
            <div className="relative z-10 p-5 flex flex-col xl:flex-row justify-between items-center gap-4">

                {/* Métricas izquierda */}
                <div className="flex items-center gap-3 w-full xl:w-auto flex-wrap sm:flex-nowrap min-w-0">
                    <div className="p-2.5 bg-brand-red-dark rounded-2xl shadow-inner border border-brand-red-dark/50 flex-shrink-0 hidden sm:flex">
                        <CalculatorIcon className="w-6 h-6 text-brand-gold" />
                    </div>

                    <Item label="Monto Aprobado"                                    value={`S/ ${fmt(montoAprobado)}`} />
                    <Sep />
                    <Item label={`Amortización (÷${cuotasNum})`}                   value={`S/ ${fmt(amortizacion)}`}    muted />
                    <Sep />
                    <Item label={`Interés/cuota (${mesesTotales}m × ${tasaNum}%)`} value={`S/ ${fmt(interesPorCuota)}`} muted />

                    {seguroTotal > 0 && (
                        <>
                            <Sep />
                            <Item
                                label={isFinanciado ? 'Cobertura/cuota' : 'Seguro Total'}
                                value={isFinanciado ? `S/ ${fmt(seguroPorCuota)}` : `S/ ${fmt(seguroTotal)}`}
                                gold
                            />
                        </>
                    )}
                </div>

                {/* Totales derecha */}
                <div className="flex gap-6 w-full xl:w-auto border-t xl:border-t-0 xl:border-l border-brand-red-dark pt-4 xl:pt-0 xl:pl-6 justify-between xl:justify-end z-10 flex-shrink-0">
                    <div className="text-left xl:text-right">
                        <p className="text-[9px] font-black text-brand-red-light/80 uppercase tracking-[0.15em] mb-1 whitespace-nowrap">
                            Cuota ({cuotasNum} {frecuencia.toLowerCase()})
                        </p>
                        <p className="text-xl font-black text-white tracking-tight whitespace-nowrap">
                            S/ {fmt(valorCuota)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-brand-gold uppercase tracking-[0.15em] mb-1 whitespace-nowrap">
                            Total a Cobrar
                        </p>
                        <p className="text-xl font-black text-brand-gold tracking-tight drop-shadow-sm whitespace-nowrap">
                            S/ {fmt(totalFinanciado)}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Botón toggle fórmulas ── */}
            <button
                onClick={() => setShowFormulas(v => !v)}
                className="relative z-10 w-full flex items-center justify-center gap-1.5 py-1.5 bg-black/20 hover:bg-black/30 transition-colors text-[10px] font-black uppercase tracking-[0.15em] text-red-200/70 hover:text-red-100 border-t border-brand-red-dark"
            >
                {showFormulas ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
                {showFormulas ? 'Ocultar cálculo' : 'Ver cómo se calcula'}
            </button>

            {/* ── Panel de fórmulas ── */}
            {showFormulas && (
                <div className="relative z-10 border-t border-brand-red-dark bg-black/20 px-5 py-4 flex flex-col gap-3">

                    {/* Paso 1 */}
                    <FormulaRow
                        paso="1"
                        label="Monto Aprobado"
                        formula={
                            isFinanciado
                                ? `S/ ${fmt(montoBase)} + S/ ${fmt(seguroTotal)} (seguro financiado)`
                                : `S/ ${fmt(montoBase)} (seguro no financiado)`
                        }
                        resultado={`S/ ${fmt(montoAprobado)}`}
                    />

                    {/* Paso 2 */}
                    <FormulaRow
                        paso="2"
                        label="Amortización / cuota"
                        formula={`S/ ${fmt(montoAprobado)} ÷ ${cuotasNum} cuotas`}
                        resultado={`S/ ${fmt(amortizacion)}`}
                    />

                    {/* Paso 3 */}
                    <FormulaRow
                        paso="3"
                        label="Interés / cuota"
                        formula={`S/ ${fmt(amortizacion)} × ${tasaNum}% × ${mesesTotales} ${mesesTotales === 1 ? 'mes' : 'meses'}`}
                        resultado={`S/ ${fmt(interesPorCuota)}`}
                    />

                    {/* Paso 4 — Seguro si existe */}
                    {seguroTotal > 0 && (
                        <FormulaRow
                            paso="4"
                            label={isFinanciado ? 'Cobertura / cuota' : 'Seguro (ya cobrado)'}
                            formula={
                                isFinanciado
                                    ? `S/ ${fmt(seguroTotal)} ÷ ${cuotasNum} cuotas`
                                    : `S/ ${fmt(seguroIndividual)} × ${nIntegrantes} integrante${nIntegrantes > 1 ? 's' : ''}`
                            }
                            resultado={isFinanciado ? `S/ ${fmt(seguroPorCuota)}` : `S/ ${fmt(seguroTotal)}`}
                            gold
                        />
                    )}

                    {/* Separador */}
                    <div className="h-px bg-white/10 my-1" />

                    {/* Cuota final */}
                    <FormulaRow
                        paso="✓"
                        label="Valor Cuota"
                        formula={`S/ ${fmt(amortizacion)} + S/ ${fmt(interesPorCuota)}`}
                        resultado={`S/ ${fmt(valorCuota)}`}
                        highlight
                    />

                    {/* Total */}
                    <FormulaRow
                        paso="✓"
                        label="Total a Cobrar"
                        formula={`S/ ${fmt(valorCuota)} × ${cuotasNum} cuotas`}
                        resultado={`S/ ${fmt(totalFinanciado)}`}
                        gold
                    />
                </div>
            )}
        </div>
    );
};

/* ── Sub-componentes ── */

const FormulaRow = ({ paso, label, formula, resultado, highlight = false, gold = false }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
        {/* Número de paso */}
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0
            ${gold ? 'bg-brand-gold text-brand-red-dark' : highlight ? 'bg-white text-brand-red-dark' : 'bg-white/20 text-white'}`}>
            {paso}
        </div>

        {/* Label */}
        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-red-200/70 whitespace-nowrap w-36 flex-shrink-0">
            {label}
        </p>

        {/* Fórmula */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="text-red-300/50 text-xs flex-shrink-0">=</span>
            <p className="text-[11px] font-mono text-red-100/80 truncate">{formula}</p>
        </div>

        {/* Resultado */}
        <p className={`text-sm font-black whitespace-nowrap flex-shrink-0
            ${gold ? 'text-brand-gold' : highlight ? 'text-white' : 'text-red-100'}`}>
            {resultado}
        </p>
    </div>
);

const Sep  = () => <div className="text-brand-red-light/50 font-black text-lg flex-shrink-0">+</div>;
const Item = ({ label, value, muted = false, gold = false }) => (
    <div className="min-w-0">
        <p className="text-[9px] font-black text-brand-red-light/80 uppercase tracking-[0.15em] mb-0.5 whitespace-nowrap">{label}</p>
        <p className={`text-sm font-black whitespace-nowrap ${gold ? 'text-brand-gold' : muted ? 'text-brand-red-light' : 'text-white'}`}>
            {value}
        </p>
    </div>
);

const round = n => Math.round(n * 100) / 100;
const fmt   = n => parseFloat(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

export default CalculadoraCuota;