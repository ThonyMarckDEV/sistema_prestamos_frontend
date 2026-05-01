import React from 'react';

// Función para evitar el error de precisión de punto flotante (0.0000000001)
const safeRound = (n) => Math.round(n * 100) / 100;

// ── Sub-celda capital o interés ───────────────────────────────────────────────
export const CeldaFinanciera = ({ total, pagado, pendiente }) => {
    const pendNum = safeRound(parseFloat(pendiente || 0));
    
    return (
        <div className="flex flex-col min-w-[85px] leading-tight">
            <span className="text-[11px] font-black text-slate-800 whitespace-nowrap">
                S/ {parseFloat(total).toFixed(2)}
            </span>
            {parseFloat(pagado) > 0 && (
                <span className="text-[9px] font-bold text-green-700 whitespace-nowrap uppercase">
                    Pagado: S/ {parseFloat(pagado).toFixed(2)}
                </span>
            )}
            {/* Solo mostramos pendiente si es realmente >= 0.01 */}
            {pendNum >= 0.01 && (
                <span className="text-[9px] font-bold text-brand-red whitespace-nowrap uppercase">
                    Pend: S/ {pendNum.toFixed(2)}
                </span>
            )}
        </div>
    );
};

/**
 * CronogramaTable — Tabla reutilizable de cronograma de pagos.
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
        const labels = { 1: 'PENDIENTE', 2: 'PAGADO', 3: 'VENCE HOY', 4: 'VENCIDO', 5: 'PARCIAL', 6: 'REFINANCIADO' };
        return (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border whitespace-nowrap ${styles[estado] || styles[1]}`}>
                {labels[estado] || 'PENDIENTE'}
            </span>
        );
    };

    return (
        <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm overflow-x-auto bg-white">
            <table className="w-full text-left border-collapse min-w-[950px]">
                <thead className="bg-slate-50 text-[9px] font-black text-slate-500 uppercase border-b border-slate-100 whitespace-nowrap">
                    <tr>
                        <th className="px-3 py-4 text-center">N°</th>
                        <th className="px-3 py-4">Vencimiento</th>
                        <th className="px-3 py-4">Cuota</th>
                        <th className="px-3 py-4">Capital</th>
                        <th className="px-3 py-4">Interés</th>
                        <th className="px-3 py-4">Seguro</th>
                        <th className="px-3 py-4">Mora</th>
                        <th className="px-3 py-4">Abonos</th>
                        <th className="px-3 py-4">Saldo Real</th>
                        <th className="px-3 py-4 text-center">Estado</th>
                        {extraColumns.map((col) => (
                            <th key={col.header} className="px-3 py-4 text-center">{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {cronograma.map((cuota, i) => {
                        const nro        = cuota.nro ?? (i + 1);
                        const monto      = parseFloat(cuota.total_cuota ?? cuota.monto ?? 0);
                        const capital    = parseFloat(cuota.capital ?? 0);
                        const interes    = parseFloat(cuota.interes ?? 0);
                        
                        const seguro     = parseFloat(cuota.seguro ?? 0);
                        let segPagado    = parseFloat(cuota.seguro_pagado ?? 0);
                        if (!esVistaIntegrante && cuota.integrantes?.length > 0) {
                             segPagado = cuota.integrantes.reduce((sum, int) => sum + parseFloat(int.seguro_pagado || 0), 0);
                        }
                        
                        // Aplicamos safeRound para evitar el 0.01 fantasma
                        const segPend    = safeRound(seguro - segPagado);

                        const capPagado  = parseFloat(cuota.capital_pagado ?? 0);
                        const intPagado  = parseFloat(cuota.interes_pagado ?? 0);
                        const capPend    = safeRound(parseFloat(cuota.capital_pendiente ?? (capital - capPagado)));
                        const intPend    = safeRound(parseFloat(cuota.interes_pendiente ?? (interes - intPagado)));
                        
                        const moraTotal  = parseFloat(cuota.mora_total ?? cuota.mora ?? 0);
                        const moraPagada = parseFloat(cuota.mora_pagada ?? 0);
                        const moraPend   = safeRound(moraTotal - moraPagada);
                        
                        const abonado    = esVistaIntegrante
                            ? parseFloat(cuota.pago_total_real ?? cuota.pago_acumulado ?? 0)
                            : parseFloat(cuota.pago_realizado  ?? cuota.pago_acumulado ?? 0);
                        
                        const saldo      = safeRound(parseFloat(cuota.saldo_pendiente ?? cuota.saldo_real ?? 0));
                        const diasAtraso = cuota.dias_atraso || 0;
                        const excAnt     = parseFloat(esVistaIntegrante ? (cuota.excedente_aplicado || 0) : (cuota.excedente_consumido > 0 ? cuota.excedente_consumido : cuota.excedente_anterior || 0));

                        let estadoGlobal = cuota.estado;
                        if (!esVistaIntegrante && cuota.integrantes?.length > 0) {
                            if (saldo <= 0.01) estadoGlobal = 2; 
                            else if (abonado > 0) estadoGlobal = 5;
                        }

                        return (
                            <tr key={nro} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-3 py-4 text-xs font-black text-slate-400 text-center font-mono">
                                    #{nro.toString().padStart(2, '0')}
                                </td>

                                <td className="px-3 py-4 whitespace-nowrap">
                                    <span className="text-xs font-bold text-slate-600 block">{cuota.vencimiento}</span>
                                    {diasAtraso > 0 && <span className="text-[9px] font-black text-brand-red uppercase">{diasAtraso} días atraso</span>}
                                </td>

                                <td className="px-3 py-4 whitespace-nowrap">
                                    <span className="text-sm font-black text-slate-700">S/ {monto.toFixed(2)}</span>
                                </td>

                                <td className="px-3 py-4"><CeldaFinanciera total={capital} pagado={capPagado} pendiente={capPend} /></td>
                                <td className="px-3 py-4"><CeldaFinanciera total={interes} pagado={intPagado} pendiente={intPend} /></td>
                                <td className="px-3 py-4"><CeldaFinanciera total={seguro} pagado={segPagado} pendiente={segPend} /></td>

                                <td className="px-3 py-4">
                                    {moraTotal <= 0 ? (
                                        <span className="text-slate-300 font-black text-[11px]">—</span>
                                    ) : (
                                        <div className="flex flex-col min-w-[70px]">
                                            <span className={`font-black text-[11px] whitespace-nowrap ${moraPend > 0 ? 'text-brand-red' : 'text-slate-400 line-through'}`}>
                                                S/ {moraTotal.toFixed(2)}
                                            </span>
                                            {moraPend > 0 ? (
                                                <span className="text-[8px] font-black text-brand-red uppercase">Pend: S/ {moraPend.toFixed(2)}</span>
                                            ) : (
                                                <span className="text-[8px] font-black text-green-600 uppercase">✓ Cubierta</span>
                                            )}
                                        </div>
                                    )}
                                </td>

                                <td className="px-3 py-4">
                                    <div className="flex flex-col gap-0.5 min-w-[100px]">
                                        {abonado > 0 && <span className="text-[9px] font-bold text-brand-red uppercase whitespace-nowrap">Recibido: S/ {abonado.toFixed(2)}</span>}
                                        {moraPagada > 0 && <span className="text-[9px] font-bold text-brand-gold-dark uppercase whitespace-nowrap">Mora: S/ {moraPagada.toFixed(2)}</span>}
                                        {excAnt > 0 && <span className="text-[9px] font-bold text-purple-600 uppercase whitespace-nowrap">Exc: S/ {excAnt.toFixed(2)}</span>}
                                        {abonado === 0 && excAnt === 0 && <span className="text-[10px] text-slate-300 font-bold">—</span>}
                                    </div>
                                </td>

                                <td className="px-3 py-4">
                                    <span className={`text-sm font-black italic whitespace-nowrap ${saldo > 0.01 ? 'text-brand-red underline' : 'text-green-600'}`}>
                                        S/ {Math.max(0, saldo).toFixed(2)}
                                    </span>
                                </td>

                                <td className="px-3 py-4 text-center">{getStatusBadge(estadoGlobal)}</td>

                                {extraColumns.map((col) => (
                                    <td key={col.header} className="px-3 py-4 text-center whitespace-nowrap">
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