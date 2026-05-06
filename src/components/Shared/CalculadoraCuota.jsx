import React, { useState } from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';

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

    const interesTotal    = round(interesPorCuota * cuotasNum);

    const seguroPorCuota  = seguroTotal > 0 && isFinanciado
        ? round(seguroTotal / cuotasNum)
        : 0;

    const valorCuota      = round(amortizacion + interesPorCuota);
    const totalFinanciado = round(valorCuota * cuotasNum);

    return (
        <div className={`relative overflow-hidden bg-brand-red rounded-[24px] shadow-xl border border-brand-red-dark text-white ${className}`}>

            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-brand-red-light opacity-10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 p-5 flex flex-col xl:flex-row justify-between items-center gap-4">

                <div className="flex items-center gap-3 w-full xl:w-auto flex-wrap sm:flex-nowrap min-w-0">
                    <div className="p-2.5 bg-brand-red-dark rounded-2xl shadow-inner border border-brand-red-dark/50 flex-shrink-0 hidden sm:flex">
                        <CalculatorIcon className="w-6 h-6 text-brand-gold" />
                    </div>

                    <Item label="Monto Aprobado" value={`S/ ${fmt(montoAprobado)}`} />
                    <Sep />
                    <Item label={`Amortización (÷${cuotasNum})`} value={`S/ ${fmt(amortizacion)}`} muted />
                    <Sep />
                    <Item label={`Interés/cuota`} value={`S/ ${fmt(interesPorCuota)}`} muted />

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

                <div className="flex gap-6 w-full xl:w-auto border-t xl:border-t-0 xl:border-l border-brand-red-dark pt-4 xl:pt-0 xl:pl-6 justify-between xl:justify-end z-10 flex-shrink-0">
                    <div>
                        <p className="text-[9px] font-black text-brand-red-light/80 uppercase tracking-[0.15em] mb-1">
                            Cuota ({cuotasNum} {frecuencia.toLowerCase()})
                        </p>
                        <p className="text-xl font-black">S/ {fmt(valorCuota)}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-brand-gold uppercase tracking-[0.15em] mb-1">
                            Total a Cobrar
                        </p>
                        <p className="text-xl font-black text-brand-gold">
                            S/ {fmt(totalFinanciado)}
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setShowFormulas(v => !v)}
                className="w-full py-2 bg-black/20 text-xs font-bold"
            >
                {showFormulas ? 'Ocultar cálculo' : 'Ver cálculo'}
            </button>

            {showFormulas && (
                <div className="p-5 flex flex-col gap-3 bg-black/20">

                    <FormulaRow
                        paso="1"
                        label="Monto Aprobado"
                        formula={
                            isFinanciado
                                ? `S/ ${fmt(montoBase)} + S/ ${fmt(seguroTotal)}`
                                : `S/ ${fmt(montoBase)}`
                        }
                        resultado={`S/ ${fmt(montoAprobado)}`}
                    />

                    <FormulaRow
                        paso="2"
                        label="Amortización"
                        formula={`S/ ${fmt(montoAprobado)} ÷ ${cuotasNum}`}
                        resultado={`S/ ${fmt(amortizacion)}`}
                    />

                    <FormulaRow
                        paso="3"
                        label="Interés total"
                        formula={`S/ ${fmt(montoBase)} × ${tasaNum}% × ${mesesTotales} meses`}
                        resultado={`S/ ${fmt(interesTotal)}`}
                    />

                    <FormulaRow
                        paso="3.1"
                        label="Interés / cuota"
                        formula={`S/ ${fmt(interesTotal)} ÷ ${cuotasNum}`}
                        resultado={`S/ ${fmt(interesPorCuota)}`}
                    />

                    {seguroTotal > 0 && (
                        <FormulaRow
                            paso="4"
                            label="Seguro"
                            formula={
                                isFinanciado
                                    ? `S/ ${fmt(seguroTotal)} ÷ ${cuotasNum}`
                                    : `S/ ${fmt(seguroIndividual)} × ${nIntegrantes}`
                            }
                            resultado={isFinanciado ? `S/ ${fmt(seguroPorCuota)}` : `S/ ${fmt(seguroTotal)}`}
                        />
                    )}

                    <FormulaRow
                        paso="✓"
                        label="Cuota"
                        formula={`S/ ${fmt(amortizacion)} + S/ ${fmt(interesPorCuota)}`}
                        resultado={`S/ ${fmt(valorCuota)}`}
                    />

                    <FormulaRow
                        paso="✓"
                        label="Total"
                        formula={`S/ ${fmt(valorCuota)} × ${cuotasNum}`}
                        resultado={`S/ ${fmt(totalFinanciado)}`}
                    />
                </div>
            )}
        </div>
    );
};

const FormulaRow = ({ paso, label, formula, resultado }) => (
    <div className="flex justify-between text-sm">
        <span>{paso}. {label}</span>
        <span>{formula} = <b>{resultado}</b></span>
    </div>
);

const Sep = () => <span>+</span>;

const Item = ({ label, value }) => (
    <div>
        <p className="text-xs">{label}</p>
        <p className="font-bold">{value}</p>
    </div>
);

const round = n => Math.round(n * 100) / 100;
const fmt = n => parseFloat(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

export default CalculadoraCuota;

