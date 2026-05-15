import React from 'react';
import { CuotaCard } from './components/CuotaCard';
import { CuotaRow } from './components/CuotaRow';

const CronogramaTable = ({ cronograma = [], esVistaIntegrante = false, onHistorialModal, extraColumns = [] }) => {
    const sharedProps = { cronograma, esVistaIntegrante, onHistorialModal, extraColumns };

    return (
        <>
            {/* ── Móvil: cards ── */}
            <div className="flex flex-col gap-3 md:hidden">
                {cronograma.map((cuota, i) => (
                    <CuotaCard key={cuota.nro ?? i} cuota={cuota} i={i} {...sharedProps} />
                ))}
            </div>

            {/* ── Desktop: tabla ── */}
            <div className="hidden md:block overflow-hidden border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
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
                            <th className="px-3 py-4">Excedente</th>
                            <th className="px-3 py-4">Saldo Real</th>
                            <th className="px-3 py-4 text-center">Estado</th>
                            {extraColumns.map((col) => (
                                <th key={col.header} className="px-3 py-4 text-center">{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {cronograma.map((cuota, i) => (
                            <CuotaRow key={cuota.nro ?? i} cuota={cuota} i={i} {...sharedProps} />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CronogramaTable;