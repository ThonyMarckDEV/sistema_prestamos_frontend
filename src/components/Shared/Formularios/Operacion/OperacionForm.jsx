import React, { useMemo } from 'react';
import Table from 'components/Shared/Tables/Table';
import {
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';

// ── Fila de integrante ────────────────────────────────────────────────────────
const IntegranteRow = ({ integrante }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
        <span className="text-sm text-slate-800 font-semibold">
            {integrante.nombre}
            <span className="ml-2 text-[10px] font-bold text-brand-gold-dark uppercase">
                ({integrante.cargo})
            </span>
        </span>
        <span className="text-sm font-black text-brand-red shrink-0">
            S/ {parseFloat(integrante.monto).toFixed(2)}
        </span>
    </div>
);

// ── Resumen financiero ────────────────────────────────────────────────────────
const ResumenFinanciero = ({ datos }) => {
    if (!datos) return null;
    const items = [
        { label: 'Capital',   value: `S/ ${parseFloat(datos.monto).toFixed(2)}` },
        { label: `Interés (${datos.interes_porc}%)`, value: `S/ ${(parseFloat(datos.total_prestamo) - parseFloat(datos.monto)).toFixed(2)}` },
        { label: 'Total Cobrar', value: `S/ ${parseFloat(datos.total_prestamo).toFixed(2)}`, bold: true },
        { label: 'Cuota',        value: `S/ ${parseFloat(datos.valor_cuota).toFixed(2)}`,    bold: true },
    ];
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {items.map(({ label, value, bold }) => (
                <div key={label} className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                    <p className={`text-sm font-black ${bold ? 'text-brand-red' : 'text-slate-600'}`}>{value}</p>
                </div>
            ))}
        </div>
    );
};

// ── Sub-celda capital o interés ───────────────────────────────────────────────
const CeldaFinanciera = ({ label, total, pagado, pendiente }) => (
    <div className="flex flex-col min-w-[80px]">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{label}</span>
        <span className="text-xs font-black text-slate-800">S/ {parseFloat(total).toFixed(2)}</span>
        {parseFloat(pagado) > 0 && (
            <span className="text-[9px] font-bold text-green-700">PAGADO: S/ {parseFloat(pagado).toFixed(2)}</span>
        )}
        {parseFloat(pendiente) > 0 && (
            <span className="text-[9px] font-bold text-brand-red">PENDIENTE: S/ {parseFloat(pendiente).toFixed(2)}</span>
        )}
    </div>
);

// ── Componente principal ──────────────────────────────────────────────────────
const OperacionForm = ({ prestamoDetalle, loading, openPagoModal, onHistorialModal }) => {
    const esGrupal = prestamoDetalle?.es_grupal;

    const columns = useMemo(() => {
        const cols = [
            {
                header: 'N°',
                render: (row) => (
                    <span className="font-black text-slate-400 text-xs">#{row.nro}</span>
                ),
            },
            {
                header: 'Vencimiento',
                render: (row) => (
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-xs">{row.vencimiento}</span>
                        {row.dias_atraso > 0 && (
                            <span className="text-[9px] font-black text-red-600 uppercase">
                                {row.dias_atraso} días atraso
                            </span>
                        )}
                    </div>
                ),
            },
            {
                header: 'Cuota',
                render: (row) => (
                    <span className="font-black text-slate-700 text-sm">
                        S/ {parseFloat(row.monto ?? row.total_cuota ?? 0).toFixed(2)}
                    </span>
                ),
            },
            {
                header: 'Capital',
                render: (row) => (
                    <CeldaFinanciera
                        label=""
                        total={row.capital ?? 0}
                        pagado={row.capital_pagado ?? 0}
                        pendiente={row.capital_pendiente ?? 0}
                    />
                ),
            },
            {
                header: 'Interés',
                render: (row) => (
                    <CeldaFinanciera
                        label=""
                        total={row.interes ?? 0}
                        pagado={row.interes_pagado ?? 0}
                        pendiente={row.interes_pendiente ?? 0}
                    />
                ),
            },
            {
                header: 'Mora',
                render: (row) => {
                    const moraTotal     = parseFloat(row.mora_total || row.mora || 0);
                    const moraPagada    = parseFloat(row.mora_pagada || 0);
                    const moraPendiente = moraTotal - moraPagada;

                    if (moraTotal <= 0) return <span className="text-slate-300 font-black text-xs">—</span>;

                    return (
                        <div className="flex flex-col">
                            {moraPendiente > 0 ? (
                                <span className="font-black text-xs text-red-600">+S/ {moraPendiente.toFixed(2)}</span>
                            ) : (
                                <span className="font-black text-xs text-red-600 line-through">S/ {moraTotal.toFixed(2)}</span>
                            )}
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className={`text-[9px] font-bold ${moraPendiente === 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                    {moraPendiente === 0 ? '✓ Cubierta' : `De S/ ${moraTotal.toFixed(2)}`}
                                </span>
                                {row.historial_mora?.length > 0 && (
                                    <button
                                        onClick={() => onHistorialModal({ nro: row.nro, historial: row.historial_mora, total: moraTotal })}
                                        className="text-slate-400 hover:text-brand-red transition-all p-0.5 rounded-full hover:bg-brand-red-light active:scale-95"
                                    >
                                        <ClockIcon className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                header: 'Saldo a Cobrar',
                render: (row) => (
                    <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-sm">
                            S/ {parseFloat(row.saldo_pendiente).toFixed(2)}
                        </span>
                        {parseFloat(row.pago_realizado || 0) > 0 && (
                            <span className="text-[9px] font-bold text-brand-gold-dark uppercase">
                                Recibido: S/ {parseFloat(row.pago_realizado).toFixed(2)}
                            </span>
                        )}
                        {parseFloat(row.pago_acumulado || 0) > 0 && (
                            <span className="text-[9px] font-bold text-green-700 uppercase">
                                Acumulado: S/ {parseFloat(row.pago_acumulado).toFixed(2)}
                            </span>
                        )}
                        {parseFloat(row.mora_pagada || 0) > 0 && (
                            <span className="text-[9px] font-bold text-yellow-600 uppercase">
                                Mora Cubierta: S/ {parseFloat(row.mora_pagada).toFixed(2)}
                            </span>
                        )}
                        {parseFloat(row.excedente_consumido || 0) > 0 && (
                            <span className="text-[9px] font-bold text-purple-600 uppercase">
                                Excedente. usado: -S/ {parseFloat(row.excedente_consumido).toFixed(2)}
                            </span>
                        )}
                        {parseFloat(row.excedente_consumido || 0) === 0 && parseFloat(row.excedente_anterior || 0) > 0 && (
                            <span className="text-[9px] font-bold text-purple-600 uppercase">
                                Excedente. aplicado: -S/ {parseFloat(row.excedente_anterior).toFixed(2)}
                            </span>
                        )}
                        {parseFloat(row.excedente_generado || 0) > 0 && (
                            <span className="text-[9px] font-bold text-orange-500 uppercase">
                                Excedente: S/ {parseFloat(row.excedente_generado).toFixed(2)}
                            </span>
                        )}
                    </div>
                ),
            },
            {
                header: 'Estado',
                render: (row) => {
                    const estadoMap = {
                        1: { text: 'PENDIENTE',    style: 'bg-slate-100 text-slate-600 border-slate-200' },
                        2: { text: 'PAGADO',       style: 'bg-green-100 text-green-700 border-green-200' },
                        3: { text: 'VENCE HOY',    style: 'bg-brand-gold-light text-brand-gold-dark border-brand-gold/30' },
                        4: { text: 'VENCIDO',      style: 'bg-brand-red-light text-brand-red border-brand-red/30' },
                        5: { text: 'PAGO PARCIAL', style: 'bg-blue-100 text-blue-700 border-blue-200' },
                    };
                    const cur = estadoMap[row.estado] ?? estadoMap[1];
                    return (
                        <span className={`px-2 py-1 rounded-full text-[9px] font-black border ${cur.style}`}>
                            {cur.text}
                        </span>
                    );
                },
            },
            {
                header: 'Acción',
                render: (row, _col, allRows) => {
                    const hayAnteriorPendiente = allRows
                        .filter((r) => r.nro < row.nro)
                        .some((r) => r.estado !== 2);
                    const esPagable = [1, 3, 4, 5].includes(row.estado);
                    const bloqueada = !esPagable || hayAnteriorPendiente;

                    if (row.estado === 2)
                        return <span className="text-[10px] font-black text-green-600 uppercase italic">✓ Cobrado</span>;

                    return (
                        <div className="flex justify-end">
                            <button
                                onClick={() => !bloqueada && openPagoModal(row)}
                                disabled={bloqueada}
                                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${
                                    bloqueada
                                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                                        : 'bg-brand-red text-white hover:bg-brand-red-dark shadow-lg shadow-brand-red/30 active:scale-95'
                                }`}
                            >
                                {hayAnteriorPendiente
                                    ? '🔒 Bloqueada'
                                    : <><BanknotesIcon className="w-3.5 h-3.5" /> Cobrar</>
                                }
                            </button>
                        </div>
                    );
                },
            },
        ];

        return cols;
    }, [openPagoModal, onHistorialModal]);

    if (!prestamoDetalle) return null;

    const { datos_economicos, integrantes, cronograma } = prestamoDetalle;
    const tieneInteg = esGrupal && integrantes?.length > 0;

    return (
        <div className="mt-10 animate-in slide-in-from-bottom-6 duration-500 space-y-6">

            {/* ── Desglose de integrantes (solo grupos) ── */}
            {tieneInteg && (
                <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-xl">
                            <UserGroupIcon className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-black text-slate-800 uppercase text-xs tracking-[0.15em]">
                            Desglose de Integrantes
                        </h4>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="divide-y divide-slate-100">
                            {integrantes.map((int) => (
                                <IntegranteRow key={int.id} integrante={int} />
                            ))}
                        </div>
                        <ResumenFinanciero datos={datos_economicos} />
                    </div>
                </div>
            )}

            {/* ── Cronograma ── */}
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-xl">
                        <BanknotesIcon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-[0.15em]">
                        Cronograma de Pagos y Saldos
                    </h4>
                </div>
                <div className="p-2 overflow-x-auto">
                    <Table columns={columns} data={cronograma || []} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default OperacionForm;