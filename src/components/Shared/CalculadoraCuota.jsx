import React, { useState } from 'react';

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

    const montoAprobado = round(montoBase + (isFinanciado ? seguroTotal : 0));


    const amortizacion = round(montoBase / cuotasNum);

    const interesTotal    = round(montoAprobado * (tasaNum / 100) * mesesTotales);
    const interesPorCuota = round(interesTotal / cuotasNum);

    const seguroPorCuota = (seguroTotal > 0 && isFinanciado)
        ? round(seguroTotal / cuotasNum)
        : 0;

    const valorCuota = round(amortizacion + interesPorCuota + seguroPorCuota);

    const totalFinanciado = round(valorCuota * cuotasNum);

    return (
        <div className={`relative overflow-hidden bg-brand-red rounded-[24px] shadow-xl border border-brand-red-dark text-white ${className}`}>

            <div className="relative z-10 p-5 flex flex-col xl:flex-row justify-between items-center gap-4">

                <div className="flex items-center gap-3 flex-wrap">

                    <Item label="Monto Aprobado" value={`S/ ${fmt(montoAprobado)}`} />
                    <Sep />
                    <Item label={`Amortización (÷${cuotasNum})`} value={`S/ ${fmt(amortizacion)}`} />
                    <Sep />
                    <Item label={`Interés/cuota`} value={`S/ ${fmt(interesPorCuota)}`} />

                    {seguroTotal > 0 && (
                        <>
                            <Sep />
                            <Item label="Seguro/cuota" value={`S/ ${fmt(seguroPorCuota)}`} />
                        </>
                    )}
                </div>

                <div className="flex gap-6">
                    <div>
                        <p>Cuota</p>
                        <p className="text-xl font-bold">S/ {fmt(valorCuota)}</p>
                    </div>
                    <div>
                        <p>Total</p>
                        <p className="text-xl font-bold">S/ {fmt(totalFinanciado)}</p>
                    </div>
                </div>
            </div>

            <button 
                type="button"
                onClick={() => setShowFormulas(v => !v)}
                className="w-full py-2 bg-black/20 text-xs font-bold"
            >
                {showFormulas ? 'Ocultar cálculo' : 'Ver cálculo'}
            </button>

            {showFormulas && (
                <div className="p-5 flex flex-col gap-2">

                    <FormulaRow
                        paso="1"
                        label="Monto Aprobado"
                        formula={`S/ ${fmt(montoBase)} + S/ ${fmt(seguroTotal)}`}
                        resultado={`S/ ${fmt(montoAprobado)}`}
                    />

                    <FormulaRow
                        paso="2"
                        label="Amortización REAL"
                        formula={`S/ ${fmt(montoBase)} ÷ ${cuotasNum}`}
                        resultado={`S/ ${fmt(amortizacion)}`}
                    />

                    <FormulaRow
                        paso="3"
                        label="Interés total"
                        formula={`S/ ${fmt(montoAprobado)} × ${tasaNum}% × ${mesesTotales}`}
                        resultado={`S/ ${fmt(interesTotal)}`}
                    />

                    <FormulaRow
                        paso="4"
                        label="Interés / cuota"
                        formula={`S/ ${fmt(interesTotal)} ÷ ${cuotasNum}`}
                        resultado={`S/ ${fmt(interesPorCuota)}`}
                    />

                    <FormulaRow
                        paso="5"
                        label="Seguro / cuota"
                        formula={`S/ ${fmt(seguroTotal)} ÷ ${cuotasNum}`}
                        resultado={`S/ ${fmt(seguroPorCuota)}`}
                    />

                    <FormulaRow
                        paso="✓"
                        label="Cuota REAL"
                        formula={`${fmt(amortizacion)} + ${fmt(interesPorCuota)} + ${fmt(seguroPorCuota)}`}
                        resultado={`S/ ${fmt(valorCuota)}`}
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