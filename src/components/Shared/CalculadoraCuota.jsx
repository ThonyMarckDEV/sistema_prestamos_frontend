import React, { useState } from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';

/**
 * CalculadoraCuota
 *
 * Props nuevas para modo grupal con tasas individuales:
 *   integrantes  — array de integrantes con { id, nombre, monto, tasa_interes, usa_tasa_individual }
 *                  Si se pasa, se calcula por integrante y se ignoran monto/tasa del nivel superior.
 *
 * Props legacy (modo simple):
 *   monto, tasa, cuotas, frecuencia, seguro, seguro_financiado, cantidadIntegrantes
 */
const CalculadoraCuota = ({
    // modo grupal con tasas individuales
    integrantes        = null,   // array | null
    tasaGlobal         = 0,      // tasa global (fallback por integrante)
    // modo simple / legacy
    monto              = 0,
    tasa               = 0,
    cuotas             = 0,
    frecuencia         = 'MENSUAL',
    seguro             = 0,
    seguro_financiado  = false,
    cantidadIntegrantes = 1,
    className          = '',
}) => {
    const [showFormulas, setShowFormulas] = useState(false);

    const cuotasNum        = parseInt(cuotas)   || 0;
    const seguroIndividual = parseFloat(seguro) || 0;
    const isFinanciado     = String(seguro_financiado) === 'true' || String(seguro_financiado) === '1';

    if (cuotasNum <= 0) return null;

    let mesesTotales = cuotasNum;
    if (frecuencia === 'SEMANAL')         mesesTotales = cuotasNum / 4;
    else if (frecuencia === 'CATORCENAL') mesesTotales = cuotasNum / 2;

    // ── Modo grupal con tasas individuales ────────────────────────────────────
    const esGrupalConTasas = Array.isArray(integrantes) && integrantes.length > 0;

    if (esGrupalConTasas) {
        // Calcular por integrante
        const calcInt = (int) => {
            const montoInt = parseFloat(int.monto || 0);
            if (montoInt <= 0) return null;

            const tasaInt  = int.usa_tasa_individual && int.tasa_interes != null && int.tasa_interes !== ''
                ? parseFloat(int.tasa_interes)
                : (parseFloat(tasaGlobal) || 0);

            if (tasaInt <= 0) return null;

            const seguro_i   = isFinanciado ? seguroIndividual : 0;
            const montoApr   = round(montoInt + seguro_i);
            const amort      = round(montoApr / cuotasNum);
            const intCuota   = round(amort * (tasaInt / 100) * mesesTotales);
            const valCuota   = round(amort + intCuota);
            const totalInd   = round(valCuota * cuotasNum);
            const totalInt   = round(intCuota * cuotasNum);
            const segCuota   = isFinanciado ? round(seguroIndividual / cuotasNum) : 0;

            return {
                nombre:       int.nombre,
                tasaInt,
                montoInt,
                montoApr,
                amort,
                intCuota,
                valCuota,
                totalInd,
                totalInt,
                segCuota,
                usaTasaPropia: !!int.usa_tasa_individual,
            };
        };

        const porInt = integrantes.map(calcInt).filter(Boolean);
        if (porInt.length === 0) return null;

        const totalCuotaGrupal  = round(porInt.reduce((a, i) => a + i.valCuota,  0));
        const totalPagarGrupal  = round(porInt.reduce((a, i) => a + i.totalInd,  0));
        const montoTotalGrupo   = round(porInt.reduce((a, i) => a + i.montoInt,  0));
        const seguroTotalGrupo  = round(seguroIndividual * integrantes.length);

        return (
            <div className={`relative overflow-hidden bg-brand-red rounded-[24px] shadow-xl border border-brand-red-dark text-white flex flex-col ${className}`}>
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-brand-red-light opacity-10 rounded-full blur-3xl pointer-events-none" />

                {/* Cabecera grupal */}
                <div className="relative z-10 p-5 flex flex-col xl:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 w-full xl:w-auto flex-wrap sm:flex-nowrap min-w-0">
                        <div className="p-2.5 bg-brand-red-dark rounded-2xl shadow-inner border border-brand-red-dark/50 flex-shrink-0 hidden sm:flex">
                            <CalculatorIcon className="w-6 h-6 text-brand-gold" />
                        </div>
                        <Item label="Monto Grupo" value={`S/ ${fmt(montoTotalGrupo)}`} />
                        <Sep />
                        <Item label={`${integrantes.length} integrantes`} value={`${cuotasNum} cuotas`} muted />
                        {seguroTotalGrupo > 0 && (
                            <>
                                <Sep />
                                <Item
                                    label={isFinanciado ? 'Seguro/cuota (x int.)' : 'Seguro Total'}
                                    value={isFinanciado ? `S/ ${fmt(seguroIndividual / cuotasNum)}` : `S/ ${fmt(seguroTotalGrupo)}`}
                                    gold
                                />
                            </>
                        )}
                    </div>

                    <div className="flex gap-6 w-full xl:w-auto border-t xl:border-t-0 xl:border-l border-brand-red-dark pt-4 xl:pt-0 xl:pl-6 justify-between xl:justify-end z-10 flex-shrink-0">
                        <div>
                            <p className="text-[9px] font-black text-brand-red-light/80 uppercase tracking-[0.15em] mb-1">
                                Cuota Total ({cuotasNum} {frecuencia.toLowerCase()})
                            </p>
                            <p className="text-xl font-black">S/ {fmt(totalCuotaGrupal)}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-brand-gold uppercase tracking-[0.15em] mb-1">
                                Total a Cobrar
                            </p>
                            <p className="text-xl font-black text-brand-gold tracking-tighter drop-shadow-sm">
                                S/ {fmt(totalPagarGrupal)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botón desglose */}
                <button
                    type="button"
                    onClick={() => setShowFormulas(v => !v)}
                    className={`relative z-10 w-full py-2.5 text-xs font-black uppercase tracking-widest transition-colors focus:outline-none ${showFormulas ? 'bg-black/30 text-brand-gold' : 'bg-black/20 text-white/70 hover:bg-black/30 hover:text-white'}`}
                >
                    {showFormulas ? '▲ Ocultar desglose por integrante' : '▼ Ver desglose por integrante'}
                </button>

                {/* Panel desglose por integrante */}
                {showFormulas && (
                    <div className="relative z-10 p-5 bg-black/30 flex flex-col gap-4 border-t border-black/20 shadow-inner">
                        {porInt.map((int, idx) => (
                            <div key={idx} className="bg-black/20 rounded-2xl p-4">
                                {/* Encabezado integrante */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-black text-white uppercase tracking-wide">{int.nombre}</span>
                                    {int.usaTasaPropia && (
                                        <span className="text-[9px] font-black bg-amber-400 text-amber-900 px-2 py-0.5 rounded-md uppercase">
                                            Tasa propia: {int.tasaInt}%
                                        </span>
                                    )}
                                    {!int.usaTasaPropia && (
                                        <span className="text-[9px] font-black bg-white/10 text-white/60 px-2 py-0.5 rounded-md uppercase">
                                            Tasa global: {int.tasaInt}%
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <FormulaRow
                                        paso="1"
                                        label="Monto Aprobado"
                                        formula={isFinanciado
                                            ? `S/ ${fmt(int.montoInt)} + S/ ${fmt(seguroIndividual)}`
                                            : `S/ ${fmt(int.montoInt)}`
                                        }
                                        resultado={`S/ ${fmt(int.montoApr)}`}
                                    />
                                    <FormulaRow
                                        paso="2"
                                        label="Amortización"
                                        formula={`S/ ${fmt(int.montoApr)} ÷ ${cuotasNum}`}
                                        resultado={`S/ ${fmt(int.amort)}`}
                                    />
                                    <FormulaRow
                                        paso="3"
                                        label="Interés / cuota"
                                        formula={`S/ ${fmt(int.amort)} × ${int.tasaInt}% × ${mesesTotales} meses`}
                                        resultado={`S/ ${fmt(int.intCuota)}`}
                                    />
                                    {seguroIndividual > 0 && isFinanciado && (
                                        <FormulaRow
                                            paso="4"
                                            label="Seguro / cuota"
                                            formula={`S/ ${fmt(seguroIndividual)} ÷ ${cuotasNum}`}
                                            resultado={`S/ ${fmt(int.segCuota)}`}
                                        />
                                    )}
                                    <div className="h-1" />
                                    <FormulaRow
                                        paso="✓"
                                        label="Cuota Final"
                                        formula={`S/ ${fmt(int.amort)} + S/ ${fmt(int.intCuota)}`}
                                        resultado={`S/ ${fmt(int.valCuota)}`}
                                        isFinal
                                    />
                                    <FormulaRow
                                        paso="✓"
                                        label="Total a Cobrar"
                                        formula={`S/ ${fmt(int.valCuota)} × ${cuotasNum}`}
                                        resultado={`S/ ${fmt(int.totalInd)}`}
                                        isFinal
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Totales del grupo */}
                        <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Total Grupo</span>
                            <div className="flex gap-6">
                                <div className="text-right">
                                    <p className="text-[9px] text-white/50 uppercase">Cuota</p>
                                    <p className="text-lg font-black">S/ {fmt(totalCuotaGrupal)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-brand-gold uppercase">Total</p>
                                    <p className="text-lg font-black text-brand-gold">S/ {fmt(totalPagarGrupal)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Modo simple (individual o grupal sin tasas distintas) ─────────────────
    const montoBase    = parseFloat(monto)  || 0;
    const tasaNum      = parseFloat(tasa)   || 0;
    const nIntegrantes = parseInt(cantidadIntegrantes) || 1;
    const seguroTotal  = round(seguroIndividual * nIntegrantes);

    if (montoBase <= 0 || tasaNum <= 0) return null;

    const montoAprobado   = round(montoBase + (isFinanciado ? seguroTotal : 0));
    const amortizacion    = round(montoAprobado / cuotasNum);
    const interesPorCuota = round(amortizacion * (tasaNum / 100) * mesesTotales);
    const interesTotal    = round(interesPorCuota * cuotasNum);
    const seguroPorCuota  = seguroTotal > 0 && isFinanciado ? round(seguroTotal / cuotasNum) : 0;
    const valorCuota      = round(amortizacion + interesPorCuota);
    const totalFinanciado = round(valorCuota * cuotasNum);

    return (
        <div className={`relative overflow-hidden bg-brand-red rounded-[24px] shadow-xl border border-brand-red-dark text-white flex flex-col ${className}`}>
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
                    <Item label="Interés/cuota" value={`S/ ${fmt(interesPorCuota)}`} muted />
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
                        <p className="text-xl font-black text-brand-gold tracking-tighter drop-shadow-sm">
                            S/ {fmt(totalFinanciado)}
                        </p>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setShowFormulas(v => !v)}
                className={`relative z-10 w-full py-2.5 text-xs font-black uppercase tracking-widest transition-colors focus:outline-none ${showFormulas ? 'bg-black/30 text-brand-gold' : 'bg-black/20 text-white/70 hover:bg-black/30 hover:text-white'}`}
            >
                {showFormulas ? '▲ Ocultar desglose' : '▼ Ver desglose de cálculo'}
            </button>

            {showFormulas && (
                <div className="relative z-10 p-5 bg-black/30 flex flex-col gap-1.5 border-t border-black/20 shadow-inner">
                    <FormulaRow
                        paso="1"
                        label="Monto Aprobado"
                        formula={isFinanciado ? `S/ ${fmt(montoBase)} + S/ ${fmt(seguroTotal)}` : `S/ ${fmt(montoBase)}`}
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
                        formula={`S/ ${fmt(montoAprobado)} × ${tasaNum}% × ${mesesTotales} meses`}
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
                            formula={isFinanciado ? `S/ ${fmt(seguroTotal)} ÷ ${cuotasNum}` : `S/ ${fmt(seguroIndividual)} × ${nIntegrantes}`}
                            resultado={isFinanciado ? `S/ ${fmt(seguroPorCuota)}` : `S/ ${fmt(seguroTotal)}`}
                        />
                    )}
                    <div className="h-2" />
                    <FormulaRow
                        paso="✓"
                        label="Cuota Final"
                        formula={`S/ ${fmt(amortizacion)} + S/ ${fmt(interesPorCuota)}`}
                        resultado={`S/ ${fmt(valorCuota)}`}
                        isFinal
                    />
                    <FormulaRow
                        paso="✓"
                        label="Total a Cobrar"
                        formula={`S/ ${fmt(valorCuota)} × ${cuotasNum}`}
                        resultado={`S/ ${fmt(totalFinanciado)}`}
                        isFinal
                    />
                </div>
            )}
        </div>
    );
};

// ── Sub-componentes ───────────────────────────────────────────────────────────

const FormulaRow = ({ paso, label, formula, resultado, isFinal = false }) => (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between py-2 px-3 rounded-xl transition-all ${isFinal ? 'bg-brand-red-dark/60 border border-brand-red-light/20 shadow-md' : 'hover:bg-white/5 border-b border-white/5 last:border-0'}`}>
        <div className="flex items-center gap-3 mb-1 sm:mb-0">
            <span className={`flex items-center justify-center min-w-[22px] h-[22px] rounded-md text-[10px] font-black shadow-sm ${isFinal ? 'bg-brand-gold text-brand-red-dark' : 'bg-black/40 text-brand-red-light border border-white/5'}`}>
                {paso}
            </span>
            <span className={`text-sm ${isFinal ? 'font-black text-white uppercase tracking-wide text-xs' : 'font-bold text-white/90'}`}>
                {label}
            </span>
        </div>
        <div className="flex items-center sm:justify-end gap-3 sm:gap-4 pl-8 sm:pl-0">
            <span className={`font-mono text-[11px] sm:text-xs tracking-tight ${isFinal ? 'text-white/70' : 'text-white/50'}`}>
                {formula}
            </span>
            <span className={`font-black ${isFinal ? 'text-brand-gold text-lg drop-shadow-md' : 'text-white text-sm'}`}>
                {resultado}
            </span>
        </div>
    </div>
);

const Sep = () => <span className="text-brand-red-light/30 font-black text-lg">+</span>;

const Item = ({ label, value, muted, gold }) => (
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