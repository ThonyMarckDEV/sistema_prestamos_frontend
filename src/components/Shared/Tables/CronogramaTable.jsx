import React from 'react';
import { ClockIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export const CeldaFinanciera = ({ total, pagado, pendiente }) => (
    <div className="flex flex-col min-w-[80px]">
        <span className="text-[11px] font-black text-slate-800 whitespace-nowrap">S/ {parseFloat(total).toFixed(2)}</span>
        {parseFloat(pagado) > 0 && (
            <span className="text-[9px] font-bold text-green-700 whitespace-nowrap">PAGADO: S/ {parseFloat(pagado).toFixed(2)}</span>
        )}
        {parseFloat(pendiente) > 0 && (
            <span className="text-[9px] font-bold text-brand-red whitespace-nowrap">PENDIENTE: S/ {parseFloat(pendiente).toFixed(2)}</span>
        )}
    </div>
);

const getStatusBadge = (estado) => {
    const styles = {
        0: 'bg-slate-100 text-slate-400 border-slate-200',
        1: 'bg-yellow-50 text-yellow-700 border-yellow-100',
        2: 'bg-green-50 text-green-700 border-green-100',
        3: 'bg-brand-gold-light text-brand-gold-dark border-brand-gold/30',
        4: 'bg-brand-red-light text-brand-red border-brand-red/30',
        5: 'bg-orange-50 text-orange-700 border-orange-100',
        6: 'bg-blue-50 text-blue-700 border-blue-100',
    };
    const labels = { 0:'CANCELADO', 1:'PENDIENTE', 2:'PAGADO', 3:'VENCE HOY', 4:'VENCIDO', 5:'PARCIAL', 6:'REFINANCIADO' };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border whitespace-nowrap ${styles[estado] ?? styles[1]}`}>
            {labels[estado] ?? 'PENDIENTE'}
        </span>
    );
};

const CardRow = ({ label, children, hidden }) => {
    if (hidden) return null;
    return (
        <div className="flex items-start justify-between gap-2 py-1.5 border-b border-slate-100 last:border-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide shrink-0 pt-0.5">{label}</span>
            <div className="text-right">{children}</div>
        </div>
    );
};

/* ─── Card individual por cuota ─────────────────────── */
const CuotaCard = ({ cuota, i, cronograma, esVistaIntegrante, onHistorialModal, extraColumns }) => {
    const [expanded, setExpanded] = React.useState(false);

    const nro        = cuota.nro ?? (i + 1);
    const monto      = parseFloat(cuota.total_cuota ?? cuota.monto ?? 0);
    const capital    = parseFloat(cuota.capital ?? 0);
    const interes    = parseFloat(cuota.interes ?? 0);
    const seguro     = parseFloat(cuota.seguro ?? 0);
    
    // Todo directo del backend
    const segPagado  = parseFloat(cuota.seguro_pagado ?? 0);
    const segPend    = parseFloat(cuota.seguro_pendiente ?? 0);
    const capPagado  = parseFloat(cuota.capital_pagado ?? 0);
    const intPagado  = parseFloat(cuota.interes_pagado ?? 0);
    const capPend    = parseFloat(cuota.capital_pendiente ?? 0);
    const intPend    = parseFloat(cuota.interes_pendiente ?? 0);

    const moraTotal  = parseFloat(cuota.mora_total ?? cuota.mora ?? 0);
    const moraPagada = parseFloat(cuota.mora_pagada ?? 0);
    const moraPend   = parseFloat(cuota.mora_pendiente ?? Math.max(0, moraTotal - moraPagada));

    const abonado    = esVistaIntegrante
        ? parseFloat(cuota.pago_total_real ?? cuota.pago_acumulado ?? 0)
        : parseFloat(cuota.pago_realizado  ?? cuota.pago_acumulado ?? 0);
    const acumInd    = esVistaIntegrante ? parseFloat(cuota.pago_acumulado ?? 0) : 0;
    
    // Saldo directo del backend (ya tiene excedentes descontados y todo)
    const saldo      = parseFloat(cuota.saldo_pendiente ?? cuota.saldo_real ?? cuota.saldo ?? 0);
    const diasAtraso = cuota.dias_atraso || 0;

    // ── Excedentes (el backend ahora manda todo masticado en AMBAS vistas) ──
    const excAnt     = parseFloat(cuota.excedente_anterior || 0);
    const excConsInd = parseFloat(cuota.excedente_consumido || cuota.excedente_aplicado || 0);
    const excGen     = parseFloat(cuota.excedente_generado || 0);

    const esCancelada    = cuota.estado === 0;
    const esRefinanciada = cuota.estado === 6;
    const esInactiva     = esCancelada || esRefinanciada;
    const mostrarRecibido = abonado > 0;

    let estadoGlobal = cuota.estado;
    if (!esVistaIntegrante && cuota.integrantes?.length > 0 && !esInactiva) {
        if (saldo <= 0) estadoGlobal = 2;
        else if (abonado > 0 && saldo > 0) estadoGlobal = 5;
    }

    const borderColor = esCancelada
        ? 'border-l-slate-300'
        : esRefinanciada
            ? 'border-l-blue-400'
            : saldo <= 0
                ? 'border-l-green-400'
                : diasAtraso > 0
                    ? 'border-l-brand-red'
                    : 'border-l-slate-200';

    return (
        <div className={`relative bg-white rounded-2xl border border-slate-200 border-l-4 ${borderColor} shadow-sm overflow-hidden transition-all ${esInactiva ? 'opacity-55' : ''}`}>
            <button className="w-full text-left px-4 pt-3 pb-3" onClick={() => setExpanded(v => !v)}>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 font-mono bg-slate-100 rounded-lg px-2 py-0.5">
                            #{nro.toString().padStart(2, '0')}
                        </span>
                        <div>
                            <span className={`text-xs font-bold block ${esInactiva ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                                {cuota.vencimiento}
                            </span>
                            {diasAtraso > 0 && !esInactiva && (
                                <span className="text-[9px] font-black text-brand-red uppercase">{diasAtraso} días atraso</span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-sm font-black ${esInactiva ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                            S/ {monto.toFixed(2)}
                        </span>
                        {getStatusBadge(estadoGlobal)}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Saldo real</span>
                    {esInactiva ? (
                        <span className="text-sm font-black italic text-slate-400 line-through">S/ {saldo.toFixed(2)}</span>
                    ) : (
                        <span className={`text-sm font-black italic ${saldo > 0 ? 'text-brand-red underline' : 'text-green-600'}`}>
                            S/ {saldo.toFixed(2)}
                        </span>
                    )}
                </div>

                {excAnt > 0 && !esInactiva && (
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-[9px] font-black text-purple-500 uppercase">
                            {esVistaIntegrante ? 'Exc. anterior (tuyo)' : 'Exc. socios disponible'}
                        </span>
                        <span className="text-[9px] font-black text-purple-600">-S/ {excAnt.toFixed(2)}</span>
                    </div>
                )}

                {(esCancelada || esRefinanciada) && (
                    <span className={`mt-1.5 inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${esCancelada ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-500'}`}>
                        {esCancelada ? 'Cancelado' : 'Refinanciado'}
                    </span>
                )}
                <div className="absolute top-3 right-3 text-slate-300">
                    {expanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                </div>
            </button>

            {expanded && (
                <div className="px-4 pb-4 pt-1 bg-slate-50/60 border-t border-slate-100 space-y-0">
                    <CardRow label="Capital">
                        <CeldaFinanciera total={capital} pagado={capPagado} pendiente={esInactiva ? 0 : capPend} />
                    </CardRow>
                    <CardRow label="Interés">
                        <CeldaFinanciera total={interes} pagado={intPagado} pendiente={esInactiva ? 0 : intPend} />
                    </CardRow>
                    <CardRow label="Seguro" hidden={seguro <= 0}>
                        <CeldaFinanciera total={seguro} pagado={segPagado} pendiente={esInactiva ? 0 : segPend} />
                    </CardRow>

                    <CardRow label="Mora" hidden={moraTotal <= 0 || esInactiva}>
                        <div className="flex flex-col items-end gap-0.5">
                            <span className={`font-black text-[11px] whitespace-nowrap ${moraPend > 0 ? 'text-brand-red' : 'text-brand-red line-through'}`}>
                                {moraPend > 0 ? `+S/ ${moraPend.toFixed(2)}` : `S/ ${moraTotal.toFixed(2)}`}
                            </span>
                            <div className="flex items-center gap-1">
                                <span className={`text-[8px] font-bold whitespace-nowrap ${moraPend === 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                    {moraPend === 0 ? '✓ Cubierta' : `De S/ ${moraTotal.toFixed(2)}`}
                                </span>
                                {cuota.historial_mora?.length > 0 && (
                                    <button onClick={(e) => { e.stopPropagation(); onHistorialModal?.({ nro, historial: cuota.historial_mora, total: moraTotal }); }}
                                        className="text-slate-400 hover:text-brand-red transition-all p-0.5 rounded-full hover:bg-brand-red-light shrink-0">
                                        <ClockIcon className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </CardRow>

                    <CardRow label={esVistaIntegrante ? "Exc. Anterior (tuyo)" : "Exc. Socios disponible"} hidden={excAnt <= 0 || esInactiva}>
                        <span className="text-[11px] font-black text-purple-600 whitespace-nowrap">-S/ {excAnt.toFixed(2)}</span>
                    </CardRow>

                    {excConsInd > 0 && (
                        <CardRow label="Exc. Ya aplicado">
                            <span className="text-[11px] font-black text-purple-400 whitespace-nowrap">S/ {excConsInd.toFixed(2)}</span>
                        </CardRow>
                    )}

                    {(mostrarRecibido || acumInd > 0 || moraPagada > 0 || excGen > 0 || (!esVistaIntegrante && parseFloat(cuota.pago_acumulado || 0) > 0)) && (
                        <CardRow label="Abonos">
                            <div className="flex flex-col gap-0.5 items-end">
                                {mostrarRecibido && (
                                    <span className="text-[9px] font-bold text-brand-red uppercase whitespace-nowrap">Recibido: S/ {abonado.toFixed(2)}</span>
                                )}
                                {esVistaIntegrante && acumInd > 0 && (
                                    <span className="text-[9px] font-bold text-green-700 uppercase whitespace-nowrap">Acumulado: S/ {acumInd.toFixed(2)}</span>
                                )}
                                {!esVistaIntegrante && parseFloat(cuota.pago_acumulado || 0) > 0 && (
                                    <span className="text-[9px] font-bold text-green-700 uppercase whitespace-nowrap">Acumulado: S/ {parseFloat(cuota.pago_acumulado).toFixed(2)}</span>
                                )}
                                {moraPagada > 0 && (
                                    <span className="text-[9px] font-bold text-brand-gold-dark uppercase whitespace-nowrap">Mora cubierta: S/ {moraPagada.toFixed(2)}</span>
                                )}
                                {excGen > 0 && (
                                    <span className="text-[9px] font-bold text-orange-500 uppercase whitespace-nowrap">Excedente generado: +S/ {excGen.toFixed(2)}</span>
                                )}
                            </div>
                        </CardRow>
                    )}

                    {extraColumns.map((col) => (
                        <CardRow key={col.header} label={col.header}>
                            {col.render(cuota, i, cronograma)}
                        </CardRow>
                    ))}

                    {moraPend > 0 && saldo > 0 && (
                        <p className="text-[9px] text-slate-400 font-bold pt-1">
                            Cap: {parseFloat(cuota.saldo_capital ?? 0).toFixed(2)} | Mora: {moraPend.toFixed(2)}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════ */
const CronogramaTable = ({ cronograma = [], esVistaIntegrante = false, onHistorialModal, extraColumns = [] }) => {
    return (
        <>
            {/* ══════════════ VISTA MÓVIL — cards ══════════════ */}
            <div className="flex flex-col gap-3 md:hidden">
                {cronograma.map((cuota, i) => (
                    <CuotaCard key={cuota.nro ?? i} cuota={cuota} i={i} cronograma={cronograma}
                        esVistaIntegrante={esVistaIntegrante} onHistorialModal={onHistorialModal} extraColumns={extraColumns} />
                ))}
            </div>

            {/* ══════════════ VISTA DESKTOP — tabla ══════════════ */}
            <div className="hidden md:block overflow-hidden border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[860px]">
                    <thead className="bg-slate-50 text-[9px] font-black text-slate-500 uppercase border-b border-slate-100 whitespace-nowrap">
                        <tr>
                            <th className="px-3 py-4 text-center">N°</th>
                            <th className="px-3 py-4">Vencimiento</th>
                            <th className="px-3 py-4">Cuota</th>
                            <th className="px-3 py-4">Capital</th>
                            <th className="px-3 py-4">Interés</th>
                            <th className="px-3 py-4">Seguro</th>
                            <th className="px-3 py-4">Mora</th>
                            <th className="px-3 py-4">Excedente</th>
                            <th className="px-3 py-4">Abonos</th>
                            <th className="px-3 py-4">Saldo Real</th>
                            <th className="px-3 py-4 text-center">Estado</th>
                            {extraColumns.map((col) => (
                                <th key={col.header} className="px-3 py-4 text-center">{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {cronograma.map((cuota, i) => {
                            const nro        = cuota.nro ?? (i + 1);
                            const monto      = parseFloat(cuota.total_cuota ?? cuota.monto ?? 0);
                            const capital    = parseFloat(cuota.capital ?? 0);
                            const interes    = parseFloat(cuota.interes ?? 0);
                            const seguro     = parseFloat(cuota.seguro ?? 0);
                            
                            // Todo directo del backend
                            const segPagado  = parseFloat(cuota.seguro_pagado ?? 0);
                            const segPend    = parseFloat(cuota.seguro_pendiente ?? 0);
                            const capPagado  = parseFloat(cuota.capital_pagado ?? 0);
                            const intPagado  = parseFloat(cuota.interes_pagado ?? 0);
                            const capPend    = parseFloat(cuota.capital_pendiente ?? 0);
                            const intPend    = parseFloat(cuota.interes_pendiente ?? 0);

                            const moraTotal  = parseFloat(cuota.mora_total ?? cuota.mora ?? 0);
                            const moraPagada = parseFloat(cuota.mora_pagada ?? 0);
                            const moraPend   = parseFloat(cuota.mora_pendiente ?? Math.max(0, moraTotal - moraPagada));

                            const abonado    = esVistaIntegrante
                                ? parseFloat(cuota.pago_total_real ?? cuota.pago_acumulado ?? 0)
                                : parseFloat(cuota.pago_realizado  ?? cuota.pago_acumulado ?? 0);
                            const acumInd    = esVistaIntegrante ? parseFloat(cuota.pago_acumulado ?? 0) : 0;
                            
                            const saldo      = parseFloat(cuota.saldo_pendiente ?? cuota.saldo_real ?? cuota.saldo ?? 0);
                            const diasAtraso = cuota.dias_atraso || 0;

                            // ── Excedentes (todo directo del JSON en ambas vistas) ──
                            const excAnt     = parseFloat(cuota.excedente_anterior || 0);
                            const excConsInd = parseFloat(cuota.excedente_consumido || cuota.excedente_aplicado || 0);
                            const excGen     = parseFloat(cuota.excedente_generado || 0);

                            const esCancelada    = cuota.estado === 0;
                            const esRefinanciada = cuota.estado === 6;
                            const esInactiva     = esCancelada || esRefinanciada;
                            const mostrarRecibido = abonado > 0;

                            let estadoGlobal = cuota.estado;
                            if (!esVistaIntegrante && cuota.integrantes?.length > 0 && !esInactiva) {
                                if (saldo <= 0) estadoGlobal = 2;
                                else if (abonado > 0 && saldo > 0) estadoGlobal = 5;
                            }

                            return (
                                <tr key={nro} className={`transition-colors ${
                                    esCancelada ? 'bg-slate-50/80 opacity-50'
                                    : esRefinanciada ? 'bg-blue-50/60 opacity-60'
                                    : 'hover:bg-brand-red-light/30'}`}>
                                    <td className="px-3 py-4 text-xs font-black text-slate-400 text-center font-mono">
                                        #{nro.toString().padStart(2, '0')}
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        <span className={`text-xs font-bold block ${esInactiva ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                                            {cuota.vencimiento}
                                        </span>
                                        {diasAtraso > 0 && !esInactiva && (
                                            <span className="text-[9px] font-black text-brand-red uppercase">{diasAtraso} días atraso</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        <span className={`text-sm font-black ${esInactiva ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                            S/ {monto.toFixed(2)}
                                        </span>
                                        {esCancelada && <span className="block text-[9px] font-black text-slate-400 uppercase">Cancelado</span>}
                                        {esRefinanciada && <span className="block text-[9px] font-black text-blue-500 uppercase">Refinanciado</span>}
                                    </td>
                                    <td className="px-3 py-4">
                                        <CeldaFinanciera total={capital} pagado={capPagado} pendiente={esInactiva ? 0 : capPend} />
                                    </td>
                                    <td className="px-3 py-4">
                                        <CeldaFinanciera total={interes} pagado={intPagado} pendiente={esInactiva ? 0 : intPend} />
                                    </td>
                                    <td className="px-3 py-4">
                                        <CeldaFinanciera total={seguro} pagado={segPagado} pendiente={esInactiva ? 0 : segPend} />
                                    </td>
                                    <td className="px-3 py-4">
                                        {moraTotal <= 0 || esInactiva ? (
                                            <span className="text-slate-300 font-black text-[11px]">—</span>
                                        ) : (
                                            <div className="flex flex-col min-w-[70px]">
                                                <span className={`font-black text-[11px] whitespace-nowrap ${moraPend > 0 ? 'text-brand-red' : 'text-brand-red line-through'}`}>
                                                    {moraPend > 0 ? `+S/ ${moraPend.toFixed(2)}` : `S/ ${moraTotal.toFixed(2)}`}
                                                </span>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <span className={`text-[8px] font-bold whitespace-nowrap ${moraPend === 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                                        {moraPend === 0 ? '✓ Cubierta' : `De S/ ${moraTotal.toFixed(2)}`}
                                                    </span>
                                                    {cuota.historial_mora?.length > 0 && (
                                                        <button onClick={() => onHistorialModal?.({ nro, historial: cuota.historial_mora, total: moraTotal })}
                                                            className="text-slate-400 hover:text-brand-red transition-all p-0.5 rounded-full hover:bg-brand-red-light shrink-0">
                                                            <ClockIcon className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-3 py-4">
                                        {excAnt > 0 || excConsInd > 0 || excGen > 0 ? (
                                            <div className="flex flex-col gap-0.5 min-w-[90px]">
                                                {excAnt > 0 && !esInactiva && (
                                                    <span className="text-[9px] font-bold text-purple-600 uppercase whitespace-nowrap">
                                                        {esVistaIntegrante ? 'Anterior: ' : 'Disponible: '}
                                                        -S/ {excAnt.toFixed(2)}
                                                    </span>
                                                )}
                                                {excConsInd > 0 && (
                                                    <span className="text-[9px] font-bold text-purple-400 uppercase whitespace-nowrap">
                                                        Usado: -S/ {excConsInd.toFixed(2)}
                                                    </span>
                                                )}
                                                {excGen > 0 && (
                                                    <span className="text-[9px] font-bold text-orange-500 uppercase whitespace-nowrap">
                                                        Generado: +S/ {excGen.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 font-black text-[11px]">—</span>
                                        )}
                                    </td>

                                    <td className="px-3 py-4">
                                        <div className="flex flex-col gap-0.5 min-w-[90px]">
                                            {mostrarRecibido && (
                                                <span className="text-[9px] font-bold text-brand-red uppercase whitespace-nowrap">
                                                    Recibido: S/ {abonado.toFixed(2)}
                                                </span>
                                            )}
                                            {esVistaIntegrante && acumInd > 0 && (
                                                <span className="text-[9px] font-bold text-green-700 uppercase whitespace-nowrap">
                                                    Acumulado: S/ {acumInd.toFixed(2)}
                                                </span>
                                            )}
                                            {!esVistaIntegrante && parseFloat(cuota.pago_acumulado || 0) > 0 && (
                                                <span className="text-[9px] font-bold text-green-700 uppercase whitespace-nowrap">
                                                    Acumulado: S/ {parseFloat(cuota.pago_acumulado).toFixed(2)}
                                                </span>
                                            )}
                                            {moraPagada > 0 && (
                                                <span className="text-[9px] font-bold text-brand-gold-dark uppercase whitespace-nowrap">
                                                    Mora cubierta: S/ {moraPagada.toFixed(2)}
                                                </span>
                                            )}
                                            {!mostrarRecibido && acumInd === 0 && moraPagada === 0
                                                && !(!esVistaIntegrante && parseFloat(cuota.pago_acumulado || 0) > 0) && (
                                                <span className="text-[10px] text-slate-300 font-bold">—</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        {esInactiva ? (
                                            <span className="text-sm font-black italic text-slate-400 line-through whitespace-nowrap">
                                                S/ {saldo.toFixed(2)}
                                            </span>
                                        ) : (
                                            <>
                                                <span className={`text-sm font-black italic whitespace-nowrap ${saldo > 0 ? 'text-brand-red underline' : 'text-green-600'}`}>
                                                    S/ {saldo.toFixed(2)}
                                                </span>
                                                {moraPend > 0 && saldo > 0 && (
                                                    <span className="text-[9px] text-slate-400 font-bold block whitespace-nowrap">
                                                        Cap: {parseFloat(cuota.saldo_capital ?? 0).toFixed(2)} | Mora: {moraPend.toFixed(2)}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </td>
                                    <td className="px-3 py-4 text-center">{getStatusBadge(estadoGlobal)}</td>
                                    {extraColumns.map((col) => (
                                        <td key={col.header} className="px-3 py-4 text-center">
                                            {col.render(cuota, i, cronograma)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CronogramaTable;