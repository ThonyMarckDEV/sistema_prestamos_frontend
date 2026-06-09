import React from 'react';
import CronogramaTable from 'components/Shared/Tables/CronogramaTable';
import DatosEconomicosCards from 'components/Shared/Tables/components/DatosEconomicosCards';
import {
    BanknotesIcon,
    UserGroupIcon,
    ChartPieIcon,
    LockClosedIcon,
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

// ── Helper: integrante pagó su parte en una cuota ────────────────────────────
const integrantePagoSuParte = (intDet) => {
    if (!intDet) return false;
    if (intDet.pagado === true) return true;
    const saldo = parseFloat(intDet.saldo ?? intDet.saldo_real ?? 1);
    return saldo <= 0;
};

// ── Componente principal ──────────────────────────────────────────────────────
const OperacionForm = ({ prestamoDetalle, openPagoModal, onHistorialModal }) => {
    if (!prestamoDetalle) return null;

    const { datos_economicos, integrantes, cronograma } = prestamoDetalle;
    const esGrupal   = prestamoDetalle.es_grupal;
    const tieneInteg = esGrupal && integrantes?.length > 0;

    // ── Columna Cobrar ────────────────────────────────────────────────────────
    const accionColumn = [{
        header: 'Acción',
        render: (row, i, allRows) => {
            const esPagable   = [1, 3, 4, 5].includes(row.estado);
            const saldoGlobal = parseFloat(row.saldo_pendiente ?? row.saldo_real ?? 0);

            if (row.estado === 2 || saldoGlobal <= 0)
                return <span className="text-[10px] font-black text-green-600 uppercase italic">✓ Cobrado</span>;

            if (!esPagable) return null;

            // ── Individual ────────────────────────────────────────────────────
            if (!esGrupal) {
                const hayAnteriorPendiente = allRows
                    .filter(r => r.nro < row.nro)
                    .some(r => r.estado !== 2);
                
                // Inyectamos el flag es_grupal: false
                const rowIndividual = { ...row, es_grupal: false };

                return (
                    <button
                        onClick={() => !hayAnteriorPendiente && openPagoModal(rowIndividual)}
                        disabled={hayAnteriorPendiente}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${
                            hayAnteriorPendiente
                                ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                                : 'bg-brand-red text-white hover:bg-brand-red-dark shadow-lg shadow-brand-red/30 active:scale-95'
                        }`}
                    >
                        {hayAnteriorPendiente
                            ? <><LockClosedIcon className="w-3.5 h-3.5" /> Bloqueada</>
                            : <><BanknotesIcon  className="w-3.5 h-3.5" /> Cobrar</>}
                    </button>
                );
            }

            // ── Grupal ────────────────────────────────────────────────────────
            const cuotaAnterior = allRows.find(r => r.nro === row.nro - 1);

            const integrantesPueden = (row.integrantes ?? []).filter(int => {
                if (integrantePagoSuParte(int)) return false;
                if (!cuotaAnterior) return true;
                const detAnt = (cuotaAnterior.integrantes ?? []).find(d => d.id === int.id);
                if (!detAnt) return true;
                return integrantePagoSuParte(detAnt);
            });

            const integrantesBloqueados = (row.integrantes ?? []).filter(int => {
                if (integrantePagoSuParte(int)) return false;
                if (!cuotaAnterior) return false;
                const detAnt = (cuotaAnterior.integrantes ?? []).find(d => d.id === int.id);
                if (!detAnt) return false;
                return !integrantePagoSuParte(detAnt);
            });

            if (integrantesPueden.length === 0) {
                return (
                    <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-slate-300 uppercase">
                            <LockClosedIcon className="w-3 h-3" /> Todos bloqueados
                        </span>
                        <span className="text-[8px] text-slate-400 font-bold">
                            Deben pagar cuota anterior
                        </span>
                    </div>
                );
            }

            // Inyectamos el flag es_grupal: true para que el hook lo detecte
            const rowFiltrado = { 
                ...row, 
                integrantes: integrantesPueden,
                es_grupal: true 
            };

            return (
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => openPagoModal(rowFiltrado)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-[10px] uppercase bg-brand-red text-white hover:bg-brand-red-dark shadow-lg shadow-brand-red/30 active:scale-95 transition-all"
                    >
                        <BanknotesIcon className="w-3.5 h-3.5" />
                        Cobrar ({integrantesPueden.length})
                    </button>
                    {integrantesBloqueados.length > 0 && (
                        <span className="text-[8px] font-bold text-slate-400 flex items-center gap-0.5">
                            <LockClosedIcon className="w-2.5 h-2.5" />
                            {integrantesBloqueados.length} bloqueado{integrantesBloqueados.length > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            );
        },
    }];

    return (
        <div className="mt-10 animate-in slide-in-from-bottom-6 duration-500 space-y-6">

            {/* Desglose integrantes */}
            {tieneInteg && (
                <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-xl"><UserGroupIcon className="w-4 h-4 text-white" /></div>
                        <h4 className="font-black text-slate-800 uppercase text-xs tracking-[0.15em]">Desglose de Integrantes</h4>
                    </div>
                    <div className="p-5 divide-y divide-slate-100">
                        {integrantes.map(int => <IntegranteRow key={int.id} integrante={int} />)}
                    </div>
                </div>
            )}

            {/* Resumen Económico — DatosEconomicosCards */}
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-xl"><ChartPieIcon className="w-4 h-4 text-white" /></div>
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-[0.15em]">Resumen Económico</h4>
                </div>
                <div className="p-5">
                    <DatosEconomicosCards
                        eco={datos_economicos}
                        estadoPrestamo={prestamoDetalle.estado}
                        esVistaIntegrante={false}
                    />
                </div>
            </div>

            {/* Cronograma */}
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-xl"><BanknotesIcon className="w-4 h-4 text-white" /></div>
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-[0.15em]">Cronograma de Pagos y Saldos</h4>
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