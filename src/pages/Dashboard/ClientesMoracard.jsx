import React, { useState } from 'react';
import { useDashboardClientesMora } from 'hooks/Dashboard/useDashboardClientesMora';
import Pagination from 'components/Shared/Pagination';
import {
    UserGroupIcon, UserIcon, ExclamationTriangleIcon,
    ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon,
} from '@heroicons/react/24/outline';

const fmt = n => parseFloat(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

// ── Fila de cuota expandida ───────────────────────────────────────────────────
const FilaCuota = ({ cuota }) => (
    <tr className="bg-slate-50/80 border-l-4 border-brand-red/20">
        <td className="pl-14 pr-4 py-2 text-[10px] font-bold text-slate-500">Cuota #{cuota.numero}</td>
        <td />
        <td className="px-4 py-2 text-right text-[10px] font-bold text-slate-500">S/ {fmt(cuota.monto)}</td>
        <td />
        <td className="px-4 py-2 text-right text-xs font-black text-brand-red">S/ {fmt(cuota.capital)}</td>
        <td className="px-4 py-2 text-right text-[10px] font-bold text-brand-red/70">
            {cuota.mora > 0 ? `+S/ ${fmt(cuota.mora)}` : '—'}
        </td>
        <td className="px-4 py-2 text-right">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                cuota.dias_mora > 30 ? 'bg-brand-red text-white border-brand-red' : 'bg-brand-red-light text-brand-red border-brand-red/30'
            }`}>{cuota.dias_mora} días</span>
        </td>
        <td className="px-4 py-2 text-xs font-bold text-slate-500">{cuota.fecha_venc}</td>
    </tr>
);

// ── Fila principal del cliente ────────────────────────────────────────────────
const FilaCliente = ({ f }) => {
    const [abierta, setAbierta]      = useState(false);
    const tieneMasDeUnaCuota         = f.cuotas_mora.length > 1;

    return (
        <>
            <tr
                className={`hover:bg-brand-red-light/20 transition-colors ${tieneMasDeUnaCuota ? 'cursor-pointer' : ''}`}
                onClick={() => tieneMasDeUnaCuota && setAbierta(v => !v)}
            >
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg flex-shrink-0">
                            {f.es_grupal
                                ? <UserGroupIcon className="w-3.5 h-3.5 text-slate-500" />
                                : <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                            }
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-black text-slate-800 uppercase">{f.nombre}</p>
                            {f.documento && <p className="text-[9px] text-slate-400 font-bold">{f.documento}</p>}
                            {f.grupo && <p className="text-[9px] text-brand-red/70 font-bold">GRUPO: {f.grupo}</p>}
                            {f.direccion && <p className="text-[9px] text-slate-400 font-bold">{f.direccion}</p>}
                        </div>
                        {tieneMasDeUnaCuota && (
                            <ChevronDownIcon className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform ${abierta ? 'rotate-180' : ''}`} />
                        )}
                    </div>
                </td>
                <td className="px-4 py-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase">{f.asesor}</span>
                    <p className="text-[9px] text-slate-400 font-bold">Préstamo #{String(f.prestamo_id).padStart(5, '0')}</p>
                </td>
                <td className="px-4 py-3 text-right">
                    <span className="text-xs font-black text-slate-600">S/ {fmt(f.monto_desemb)}</span>
                </td>
                <td className="px-4 py-3 text-right">
                    <span className="text-xs font-black text-slate-600">{f.cuotas_pagadas}/{f.total_cuotas}</span>
                    <p className="text-[9px] text-slate-400 font-bold">pagadas</p>
                </td>
                <td className="px-4 py-3 text-right">
                    <span className="text-sm font-black text-brand-red">S/ {fmt(f.total_capital)}</span>
                    {f.cuotas_mora.length > 1 && <p className="text-[9px] text-slate-400 font-bold">{f.cuotas_mora.length} cuotas</p>}
                    {f.cuotas_mora.length === 1 && <p className="text-[9px] text-slate-400 font-bold">Cuota #{f.cuotas_mora[0].numero}</p>}
                </td>
                <td className="px-4 py-3 text-right">
                    {f.total_mora > 0
                        ? <span className="text-xs font-black text-brand-red/70">+S/ {fmt(f.total_mora)}</span>
                        : <span className="text-slate-300">—</span>
                    }
                </td>
                <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                        f.max_dias > 30 ? 'bg-brand-red text-white border-brand-red' : 'bg-brand-red-light text-brand-red border-brand-red/30'
                    }`}>{f.max_dias} días</span>
                </td>
                <td className="px-4 py-3">
                    <span className="text-xs font-bold text-slate-600">{f.cuotas_mora[0]?.fecha_venc}</span>
                    {f.cuotas_mora.length > 1 && <p className="text-[9px] text-slate-400 font-bold">más antiguo</p>}
                </td>
            </tr>
            {abierta && f.cuotas_mora.map((c, i) => <FilaCuota key={i} cuota={c} />)}
        </>
    );
};

// ── Card principal ────────────────────────────────────────────────────────────
const ClientesMoraCard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        loading, data,
        busqueda,    setBusqueda,
        fechaInicio, setFechaInicio,
        fechaFin,    setFechaFin,
        handleFiltrar, handleLimpiar, handlePageChange,
    } = useDashboardClientesMora();

    const filas      = data?.data ?? [];
    const tieneFiltro = busqueda || fechaInicio || fechaFin;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header colapsable */}
            <div
                className="flex items-center justify-between px-6 py-4 border-b border-slate-100 cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
                onClick={() => setCollapsed(v => !v)}
            >
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-brand-red-light rounded-xl">
                        <ExclamationTriangleIcon className="w-5 h-5 text-brand-red" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Clientes en Mora</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Capital adeudado · ordenado por deuda
                            {data?.total ? ` · ${data.total} clientes` : ''}
                        </p>
                    </div>
                </div>
                <div className={`w-6 h-6 flex items-center justify-center text-slate-400 flex-shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>

            {!collapsed && (
                <>
                    {/* Filtros */}
                    <div className="px-6 py-3 border-b border-slate-50 bg-slate-50/50 flex flex-wrap items-end gap-3" onClick={e => e.stopPropagation()}>
                        {/* Búsqueda */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Buscar cliente / DNI / RUC / Grupo</label>
                            <input
                                type="text"
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleFiltrar()}
                                placeholder="Nombre, DNI, RUC o grupo..."
                                className="w-full p-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                            />
                        </div>
                        {/* Fecha inicio */}
                        <div>
                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vence desde</label>
                            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)}
                                className="p-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" />
                        </div>
                        {/* Fecha fin */}
                        <div>
                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vence hasta</label>
                            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)}
                                className="p-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" />
                        </div>
                        <button onClick={handleFiltrar} disabled={loading}
                            className="flex items-center gap-1.5 px-4 py-2 bg-brand-red text-white text-[10px] font-black uppercase rounded-lg hover:bg-brand-red-dark transition-all disabled:opacity-50">
                            <MagnifyingGlassIcon className="w-3.5 h-3.5" /> Filtrar
                        </button>
                        {tieneFiltro && (
                            <button onClick={handleLimpiar}
                                className="flex items-center gap-1 px-3 py-2 text-slate-400 hover:text-brand-red text-[10px] font-black uppercase rounded-lg border border-slate-200 hover:border-brand-red/30 transition-all">
                                <XMarkIcon className="w-3.5 h-3.5" /> Limpiar
                            </button>
                        )}
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex items-center justify-center h-40">
                                <div className="w-8 h-8 border-4 border-brand-red-light border-t-brand-red rounded-full animate-spin" />
                            </div>
                        ) : filas.length === 0 ? (
                            <div className="flex items-center justify-center h-32 text-slate-300 text-xs font-bold uppercase tracking-widest">
                                Sin clientes en mora
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[900px]">
                                        <thead className="bg-slate-50 text-[9px] font-black text-slate-500 uppercase border-b border-slate-100">
                                            <tr>
                                                <th className="px-4 py-3">Cliente</th>
                                                <th className="px-4 py-3">Asesor / Préstamo</th>
                                                <th className="px-4 py-3 text-right">Desembolsado</th>
                                                <th className="px-4 py-3 text-right">Cuotas</th>
                                                <th className="px-4 py-3 text-right">Capital Adeudado</th>
                                                <th className="px-4 py-3 text-right">Mora</th>
                                                <th className="px-4 py-3 text-right">Días Atraso</th>
                                                <th className="px-4 py-3">Vencimiento</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {filas.map((f, i) => (
                                                <FilaCliente key={`${f.prestamo_id}-${f.nombre}-${i}`} f={f} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    currentPage={data?.current_page}
                                    totalPages={data?.last_page}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ClientesMoraCard;