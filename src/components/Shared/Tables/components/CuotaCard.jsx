import React, { useState } from 'react';
import {
    ChevronDownIcon,
    ChevronUpIcon,
    ScissorsIcon
} from '@heroicons/react/24/outline';

import { useCuotaData } from '../hooks/useCuotaData';
import { getStatusBadge } from './StatusBadge';

import {
    CeldaFinanciera,
    SaldoContent,
    MoraContent,
    AbonosContent
} from './CeldasBase';

import {
    ExcedenteContent,
    ExcedentesIntegrantes
} from './Excedentes';

import { CardRow } from './CardRow';

export const CuotaCard = ({
    cuota,
    i,
    cronograma,
    esVistaIntegrante,
    onHistorialModal,
    onReducirMora,
    extraColumns
}) => {

    const [expanded, setExpanded] = useState(false);

    const d = useCuotaData(cuota, i, esVistaIntegrante);

    /* ─────────────────────────────────────────────
     * Excedentes por integrantes
     * ───────────────────────────────────────────── */
    const hayExcedentesIntegrantes =
        !esVistaIntegrante &&
        cuota.integrantes?.some(
            int =>
                int.excedente_anterior > 0 ||
                int.excedente_generado > 0 ||
                int.excedente_aplicado > 0 ||
                int.excedente_consumido > 0
        );

    /* ─────────────────────────────────────────────
     * Mostrar botón reducir mora
     * ───────────────────────────────────────────── */
    const mostrarBotonReducir =
        !esVistaIntegrante &&
        d.moraPend > 0 &&
        !!onReducirMora &&
        !d.esInactiva;

    /* ─────────────────────────────────────────────
     * Color lateral
     * ───────────────────────────────────────────── */
    const borderColor =
        d.esCancelada
            ? 'border-l-slate-300'
            : d.esRefinanciada
            ? 'border-l-blue-400'
            : d.saldo <= 0
            ? 'border-l-green-400'
            : d.diasAtraso > 0
            ? 'border-l-brand-red'
            : 'border-l-slate-200';

    return (
        <div
            className={`relative bg-white rounded-2xl border border-slate-200 border-l-4 ${borderColor} shadow-sm overflow-hidden transition-all ${
                d.esInactiva ? 'opacity-55' : ''
            }`}
        >

            {/* ─────────────────────────────────────────────
             * CABECERA
             * ───────────────────────────────────────────── */}
            <button
                className="w-full text-left px-4 pt-3 pb-3"
                onClick={() => setExpanded(v => !v)}
            >

                <div className="flex items-start justify-between gap-2">

                    {/* Número + fecha */}
                    <div className="flex items-center gap-2">

                        <span className="text-[10px] font-black text-slate-400 font-mono bg-slate-100 rounded-lg px-2 py-0.5">
                            #{d.nro.toString().padStart(2, '0')}
                        </span>

                        <div>

                            <span
                                className={`text-xs font-bold block ${
                                    d.esInactiva
                                        ? 'text-slate-400 line-through'
                                        : 'text-slate-600'
                                }`}
                            >
                                {cuota.vencimiento}
                            </span>

                            {d.diasAtraso > 0 && !d.esInactiva && (
                                <span className="text-[9px] font-black text-brand-red uppercase">
                                    {d.diasAtraso} días atraso
                                </span>
                            )}

                        </div>
                    </div>

                    {/* Monto + estado + excedente */}
                    <div className="flex flex-col items-end gap-1 shrink-0">

                        <span
                            className={`text-sm font-black ${
                                d.esInactiva
                                    ? 'text-slate-400 line-through'
                                    : 'text-slate-800'
                            }`}
                        >
                            S/ {d.monto.toFixed(2)}
                        </span>

                        {getStatusBadge(d.estadoGlobal)}

                        {d.excAnterior > 0 && !d.esInactiva && (
                            <span className="text-[8px] font-black text-purple-600 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                Disponible: S/ {d.excAnterior.toFixed(2)}
                            </span>
                        )}

                    </div>
                </div>

                {/* Mora rápida */}
                {d.moraPend > 0 && !d.esInactiva && (

                    <div className="flex items-center justify-between mt-1.5">

                        <span className="text-[9px] font-black text-brand-red uppercase">

                            Mora pendiente:
                            {' '}
                            +S/ {d.moraPend.toFixed(2)}

                            {parseFloat(cuota.mora_reducida ?? 0) > 0 && (
                                <span className="ml-1 text-green-600 line-through font-black">
                                    (-S/ {parseFloat(cuota.mora_reducida).toFixed(2)})
                                </span>
                            )}

                        </span>

                        {mostrarBotonReducir && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onReducirMora(cuota);
                                }}
                                className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100 rounded-lg text-[9px] font-black uppercase transition-all"
                                title="Reducir mora de esta cuota"
                            >
                                <ScissorsIcon className="w-3 h-3" />
                                Reducir
                            </button>
                        )}

                    </div>
                )}

                {/* Saldo */}
                <div className="flex items-center gap-1.5 mt-2">

                    <span className="text-[10px] font-black text-slate-400 uppercase">
                        Saldo pendiente:
                    </span>

                    <SaldoContent d={d} />

                </div>

                {/* Estado especial */}
                {(d.esCancelada || d.esRefinanciada) && (

                    <span
                        className={`mt-1.5 inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            d.esCancelada
                                ? 'bg-slate-100 text-slate-400'
                                : 'bg-blue-50 text-blue-500'
                        }`}
                    >
                        {d.esCancelada
                            ? 'Cancelado'
                            : 'Refinanciado'}
                    </span>

                )}

                {/* Icono expand */}
                <div className="absolute top-3 right-3 text-slate-300">
                    {expanded
                        ? <ChevronUpIcon className="w-4 h-4" />
                        : <ChevronDownIcon className="w-4 h-4" />
                    }
                </div>

            </button>

            {/* ─────────────────────────────────────────────
             * DETALLE
             * ───────────────────────────────────────────── */}
            {expanded && (

                <div className="px-4 pb-4 pt-1 bg-slate-50/60 border-t border-slate-100 space-y-0">

                    {/* Capital */}
                    <CardRow label="Capital">
                        <CeldaFinanciera
                            total={d.capital}
                            pagado={d.capPagado}
                            pendiente={d.esInactiva ? 0 : d.capPend}
                        />
                    </CardRow>

                    {/* Interés */}
                    <CardRow label="Interés">
                        <CeldaFinanciera
                            total={d.interes}
                            pagado={d.intPagado}
                            pendiente={d.esInactiva ? 0 : d.intPend}
                        />
                    </CardRow>

                    {/* Seguro */}
                    <CardRow
                        label="Seguro"
                        hidden={d.seguro <= 0}
                    >
                        <CeldaFinanciera
                            total={d.seguro}
                            pagado={d.segPagado}
                            pendiente={d.esInactiva ? 0 : d.segPend}
                        />
                    </CardRow>

                    {/* Mora */}
                    <CardRow
                        label="Mora"
                        hidden={d.moraTotal <= 0 || d.esInactiva}
                    >
                        <MoraContent
                            d={d}
                            cuota={cuota}
                            nro={d.nro}
                            onHistorialModal={onHistorialModal}
                            onReducirMora={undefined}
                            esVistaIntegrante={esVistaIntegrante}
                        />
                    </CardRow>

                    {/* Abonos */}
                    {d.tieneAbonos && (
                        <CardRow label="Movimientos">
                            <AbonosContent
                                d={d}
                                esVistaIntegrante={esVistaIntegrante}
                            />
                        </CardRow>
                    )}

                    {/* Excedente */}
                    {d.tieneExcedente && !d.esInactiva && (
                        <CardRow label="Excedente">
                            <ExcedenteContent
                                excAnterior={d.excAnterior}
                                excAplicado={d.excAplicado}
                                excConsumido={d.excConsumido}
                                excGenerado={d.excGenerado}
                                label={
                                    esVistaIntegrante
                                        ? 'Excedente propio'
                                        : 'Excedente'
                                }
                            />
                        </CardRow>
                    )}

                    {/* Excedentes socios */}
                    {hayExcedentesIntegrantes && (
                        <CardRow label="Excedentes socios">
                            <ExcedentesIntegrantes
                                integrantes={cuota.integrantes}
                                isCard
                            />
                        </CardRow>
                    )}

                    {/* Extras */}
                    {extraColumns.map((col) => (
                        <CardRow
                            key={col.header}
                            label={col.header}
                        >
                            {col.render(cuota, i, cronograma)}
                        </CardRow>
                    ))}

                    {/* Resumen inferior */}
                    {d.moraPend > 0 && d.saldo > 0 && (

                        <p className="text-[9px] text-slate-400 font-bold pt-1">

                            Capital pendiente:
                            {' '}
                            S/ {Math.max(
                                0,
                                d.monto - (d.acumInd || d.pagoAcumGrupo)
                            ).toFixed(2)}

                            {' | '}

                            Mora pendiente:
                            {' '}
                            S/ {d.moraPend.toFixed(2)}

                        </p>

                    )}

                </div>
            )}

        </div>
    );
};