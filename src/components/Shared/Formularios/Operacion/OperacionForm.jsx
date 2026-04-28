import React from 'react';
import CronogramaTable from 'components/Shared/Tables/CronogramaTable';
import {
    BanknotesIcon,
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

// ── Componente principal ──────────────────────────────────────────────────────
const OperacionForm = ({ prestamoDetalle, openPagoModal, onHistorialModal }) => {

    if (!prestamoDetalle) return null;

    const { datos_economicos, integrantes, cronograma } = prestamoDetalle;
    const esGrupal   = prestamoDetalle.es_grupal;
    const tieneInteg = esGrupal && integrantes?.length > 0;

    // Columna extra exclusiva de OperacionForm — botón Cobrar
    const accionColumn = [{
        header: 'Acción',
        render: (row, i, allRows) => {
            const hayAnteriorPendiente = allRows
                .filter((r) => r.nro < row.nro)
                .some((r) => r.estado !== 2);
            const esPagable = [1, 3, 4, 5].includes(row.estado);
            const bloqueada = !esPagable || hayAnteriorPendiente;

            if (row.estado === 2)
                return <span className="text-[10px] font-black text-green-600 uppercase italic">✓ Cobrado</span>;

            return (
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
            );
        },
    }];

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
                <div className="p-2">
                    <CronogramaTable
                        cronograma={cronograma}
                        esVistaIntegrante={false}
                        onHistorialModal={onHistorialModal}
                        extraColumns={accionColumn}
                    />
                </div>
            </div>
        </div>
    );
};

export default OperacionForm;