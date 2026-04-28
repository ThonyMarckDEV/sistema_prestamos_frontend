import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

// ── Sub-celda capital o interés ───────────────────────────────────────────────
export const CeldaFinanciera = ({ total, pagado, pendiente }) => (
    <div className="flex flex-col min-w-[70px]">
        <span className="text-[11px] font-black text-slate-800">S/ {parseFloat(total).toFixed(2)}</span>
        {parseFloat(pagado) > 0 && (
            <span className="text-[9px] font-bold text-green-700">PAGADO: S/ {parseFloat(pagado).toFixed(2)}</span>
        )}
        {parseFloat(pendiente) > 0 && (
            <span className="text-[9px] font-bold text-brand-red">PENDIENTE: S/ {parseFloat(pendiente).toFixed(2)}</span>
        )}
    </div>
);

/**
 * CronogramaTable — Tabla reutilizable de cronograma de pagos.
 *
 * Props:
 * - cronograma:        array   — filas del cronograma
 * - esVistaIntegrante: bool    — true si es cronograma individual de integrante
 * - onHistorialModal:  fn      — abre modal de historial de mora
 * - extraColumns:      array   — columnas adicionales al final (ej: botón Cobrar)
 *                               formato: [{ header, render }]
 */
const CronogramaTable = ({ cronograma = [], esVistaIntegrante = false, onHistorialModal, extraColumns = [] }) => {

    const getStatusBadge = (estado) => {
        const styles = {
            1: 'bg-yellow-50 text-yellow-700 border-yellow-100',
            2: 'bg-green-50 text-green-700 border-green-100',
            3: 'bg-brand-gold-light text-brand-gold-dark border-brand-gold/30',
            4: 'bg-brand-red-light text-brand-red border-brand-red/30',
            5: 'bg-orange-50 text-orange-700 border-orange-100',
            6: 'bg-blue-50 text-blue-700 border-blue-100',
        };
        const labels = { 1: 'PENDIENTE', 2: 'PAGADO', 3: 'VENCE HOY', 4: 'VENCIDO', 5: 'PAGO PARCIAL', 6: 'REFINANCIADO' };
        return (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${styles[estado] || styles[1]}`}>
                {labels[estado] || 'PENDIENTE'}
            </span>
        );
    };

    return (
        <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-slate-50 text-[9px] font-black text-slate-500 uppercase border-b border-slate-100">
                    <tr>
                        <th className="px-4 py-4 text-center">N°</th>
                        <th className="px-4 py-4">Vencimiento</th>
                        <th className="px-4 py-4">Cuota</th>
                        <th className="px-4 py-4">Capital</th>
                        <th className="px-4 py-4">Interés</th>
                        <th className="px-4 py-4">Mora</th>
                        <th className="px-4 py-4">Abonos</th>
                        <th className="px-4 py-4">Saldo Real</th>
                        <th className="px-4 py-4 text-center">Estado</th>
                        {extraColumns.map((col) => (
                            <th key={col.header} className="px-4 py-4 text-center">{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {cronograma.map((cuota, i) => {
                        const nro        = cuota.nro ?? (i + 1);
                        const monto      = parseFloat(cuota.total_cuota ?? cuota.monto ?? 0);
                        const capital    = parseFloat(cuota.capital ?? 0);
                        const interes    = parseFloat(cuota.interes ?? 0);
                        const capPagado  = parseFloat(cuota.capital_pagado ?? 0);
                        const intPagado  = parseFloat(cuota.interes_pagado ?? 0);
                        const capPend    = parseFloat(cuota.capital_pendiente ?? Math.max(0, capital - capPagado));
                        const intPend    = parseFloat(cuota.interes_pendiente ?? Math.max(0, interes - intPagado));
                        const moraTotal  = parseFloat(cuota.mora_total ?? cuota.mora ?? 0);
                        const moraPagada = parseFloat(cuota.mora_pagada ?? 0);
                        const moraPend   = Math.max(0, moraTotal - moraPagada);
                        const abonado    = esVistaIntegrante
                            ? parseFloat(cuota.pago_total_real ?? cuota.pago_acumulado ?? 0)
                            : parseFloat(cuota.pago_realizado  ?? cuota.pago_acumulado ?? 0);
                        const acumInd    = esVistaIntegrante ? parseFloat(cuota.pago_acumulado ?? 0) : 0;
                        const saldo      = parseFloat(cuota.saldo_pendiente ?? cuota.saldo_real ?? 0);
                        const diasAtraso = cuota.dias_atraso || 0;
                        const excAnt     = esVistaIntegrante
                            ? parseFloat(cuota.excedente_aplicado || 0)
                            : (parseFloat(cuota.excedente_consumido || 0) > 0
                                ? parseFloat(cuota.excedente_consumido)
                                : parseFloat(cuota.excedente_anterior || 0));
                        const excConsInd = esVistaIntegrante ? parseFloat(cuota.excedente_consumido || 0) : 0;
                        const excGen     = esVistaIntegrante ? 0 : parseFloat(cuota.excedente_generado || 0);

                        return (
                            <tr key={nro} className="hover:bg-brand-red-light/30 transition-colors">

                                {/* N° */}
                                <td className="px-4 py-4 text-xs font-black text-slate-400 text-center font-mono">
                                    #{nro.toString().padStart(2, '0')}
                                </td>

                                {/* Vencimiento */}
                                <td className="px-4 py-4">
                                    <span className="text-xs font-bold text-slate-600 block">{cuota.vencimiento}</span>
                                    {diasAtraso > 0 && <span className="text-[9px] font-black text-brand-red uppercase">{diasAtraso} días atraso</span>}
                                </td>

                                {/* Cuota */}
                                <td className="px-4 py-4">
                                    <span className="text-sm font-black text-slate-700">S/ {monto.toFixed(2)}</span>
                                </td>

                                {/* Capital */}
                                <td className="px-4 py-4">
                                    <CeldaFinanciera total={capital} pagado={capPagado} pendiente={capPend} />
                                </td>

                                {/* Interés */}
                                <td className="px-4 py-4">
                                    <CeldaFinanciera total={interes} pagado={intPagado} pendiente={intPend} />
                                </td>

                                {/* Mora */}
                                <td className="px-4 py-4">
                                    {moraTotal <= 0 ? (
                                        <span className="text-slate-300 font-black text-[11px]">—</span>
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className={`font-black text-[11px] ${moraPend > 0 ? 'text-brand-red' : 'text-brand-red line-through'}`}>
                                                {moraPend > 0 ? `+S/ ${moraPend.toFixed(2)}` : `S/ ${moraTotal.toFixed(2)}`}
                                            </span>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className={`text-[8px] font-bold ${moraPend === 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                                    {moraPend === 0 ? '✓ Cubierta' : `De S/ ${moraTotal.toFixed(2)}`}
                                                </span>
                                                {cuota.historial_mora?.length > 0 && (
                                                    <button
                                                        onClick={() => onHistorialModal?.({ nro, historial: cuota.historial_mora, total: moraTotal })}
                                                        className="text-slate-400 hover:text-brand-red transition-all p-0.5 rounded-full hover:bg-brand-red-light"
                                                    >
                                                        <ClockIcon className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </td>

                                {/* Abonos */}
                                <td className="px-4 py-4">
                                    <div className="flex flex-col gap-0.5">
                                        {abonado > 0 && <span className="text-[9px] font-bold text-brand-red uppercase">Recibido: S/ {abonado.toFixed(2)}</span>}
                                        {esVistaIntegrante && acumInd > 0 && acumInd !== abonado && <span className="text-[9px] font-bold text-green-700 uppercase">Acumulado: S/ {acumInd.toFixed(2)}</span>}
                                        {!esVistaIntegrante && parseFloat(cuota.pago_acumulado || 0) > 0 && <span className="text-[9px] font-bold text-green-700 uppercase">Acumulado: S/ {parseFloat(cuota.pago_acumulado).toFixed(2)}</span>}
                                        {moraPagada > 0 && <span className="text-[9px] font-bold text-brand-gold-dark uppercase">Mora cubierta: S/ {moraPagada.toFixed(2)}</span>}
                                        {excAnt > 0 && <span className="text-[9px] font-bold text-purple-600 uppercase">{esVistaIntegrante ? 'Excedente. aplicado' : 'Excedente. usado'}: -S/ {excAnt.toFixed(2)}</span>}
                                        {esVistaIntegrante && excConsInd > 0 && <span className="text-[9px] font-bold text-purple-600 uppercase">Excedente. usado: -S/ {excConsInd.toFixed(2)}</span>}
                                        {excGen > 0 && <span className="text-[9px] font-bold text-orange-500 uppercase">Excedente: S/ {excGen.toFixed(2)}</span>}
                                        {abonado === 0 && excAnt === 0 && moraPagada === 0 && excGen === 0 && excConsInd === 0 && (
                                            <span className="text-[10px] text-slate-300 font-bold">—</span>
                                        )}
                                    </div>
                                </td>

                                {/* Saldo Real */}
                                <td className="px-4 py-4">
                                    <span className={`text-sm font-black italic ${saldo > 0 ? 'text-brand-red underline' : 'text-green-600'}`}>
                                        S/ {saldo.toFixed(2)}
                                    </span>
                                    {moraPend > 0 && saldo > 0 && (
                                        <span className="text-[9px] text-slate-400 font-bold block">
                                            Cap: {Math.max(0, monto - (esVistaIntegrante ? acumInd : parseFloat(cuota.pago_acumulado || 0))).toFixed(2)} | Mora: {moraPend.toFixed(2)}
                                        </span>
                                    )}
                                </td>

                                {/* Estado */}
                                <td className="px-4 py-4 text-center">{getStatusBadge(cuota.estado)}</td>

                                {/* Columnas extra (ej: Cobrar) */}
                                {extraColumns.map((col) => (
                                    <td key={col.header} className="px-4 py-4 text-center">
                                        {col.render(cuota, i, cronograma)}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CronogramaTable;