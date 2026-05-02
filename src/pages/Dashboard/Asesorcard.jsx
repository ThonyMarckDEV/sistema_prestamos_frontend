import React, { useState } from 'react';
import { useDashboardAsesores } from 'hooks/Dashboard/useDashboardAsesores';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const fmt  = n => parseFloat(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });
const fmtN = n => parseInt(n || 0).toLocaleString('es-PE');

const Chevron = ({ collapsed }) => (
    <div className={`w-6 h-6 flex items-center justify-center text-slate-400 flex-shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
    </div>
);

const AsesorCard = () => {
    const { loading, data } = useDashboardAsesores();
    const [collapsed, setCollapsed] = useState(false);
    const filas   = data?.filas   ?? [];
    const totales = data?.totales ?? {};

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div
                className="flex items-center justify-between px-6 py-4 border-b border-slate-100 cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
                onClick={() => setCollapsed(v => !v)}
            >
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-brand-red-light rounded-xl">
                        <UserGroupIcon className="w-5 h-5 text-brand-red" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Producción por Asesor</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Monto desembolsado y cartera</p>
                    </div>
                </div>
                <Chevron collapsed={collapsed} />
            </div>

            {!collapsed && (
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="w-8 h-8 border-4 border-brand-red-light border-t-brand-red rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[640px]">
                                <thead className="bg-slate-50 text-[9px] font-black text-slate-500 uppercase border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3">Asesor</th>
                                        <th className="px-4 py-3 text-right">Monto Desembolsado</th>
                                        <th className="px-4 py-3 text-right">Clientes Ind.</th>
                                        <th className="px-4 py-3 text-right">Integrantes Grup.</th>
                                        <th className="px-4 py-3 text-right">Grupos</th>
                                        <th className="px-4 py-3 text-right">Total Personas</th>
                                        <th className="px-4 py-3 text-right">Ticket Prom.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filas.map((f, i) => (
                                        <tr key={f.asesor_id} className={`hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-brand-red-light flex items-center justify-center flex-shrink-0">
                                                        <span className="text-[9px] font-black text-brand-red">{f.abrev}</span>
                                                    </div>
                                                    <span className="text-xs font-black text-slate-700 uppercase">{f.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right"><span className="text-sm font-black text-slate-900">S/ {fmt(f.monto)}</span></td>
                                            <td className="px-4 py-3 text-right"><span className="text-sm font-black text-slate-600">{fmtN(f.clientes)}</span></td>
                                            <td className="px-4 py-3 text-right"><span className="text-sm font-black text-slate-600">{fmtN(f.integrantes)}</span></td>
                                            <td className="px-4 py-3 text-right"><span className="text-sm font-black text-slate-600">{fmtN(f.grupos)}</span></td>
                                            <td className="px-4 py-3 text-right"><span className="text-sm font-black text-brand-red">{fmtN(f.total_pers)}</span></td>
                                            <td className="px-4 py-3 text-right"><span className="text-sm font-black text-brand-gold-dark">S/ {fmt(f.ticket)}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-900 text-white">
                                    <tr>
                                        <td className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">TOTAL</td>
                                        <td className="px-4 py-3 text-right text-sm font-black text-brand-gold">S/ {fmt(totales.monto)}</td>
                                        <td className="px-4 py-3 text-right text-sm font-black">{fmtN(totales.clientes)}</td>
                                        <td className="px-4 py-3 text-right text-sm font-black">{fmtN(totales.integrantes)}</td>
                                        <td className="px-4 py-3 text-right text-sm font-black">{fmtN(totales.grupos)}</td>
                                        <td className="px-4 py-3 text-right text-sm font-black text-brand-gold">{fmtN(totales.total_pers)}</td>
                                        <td className="px-4 py-3 text-right text-sm font-black text-brand-gold">S/ {fmt(totales.ticket)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AsesorCard;