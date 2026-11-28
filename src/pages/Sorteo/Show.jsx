import React from 'react';
import { Link } from 'react-router-dom';
import {
    TicketIcon, PrinterIcon, LockClosedIcon, SparklesIcon, PencilSquareIcon,
    UsersIcon, UserIcon, UserGroupIcon, ArrowPathIcon, InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useShow } from 'hooks/Sorteo/useShow';
import { useAuth } from 'context/AuthContext';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import PdfModal from 'components/Shared/Modals/PdfModal';
import LoadingScreen from 'components/Shared/LoadingScreen';
import {
    ESTADO, ESTADO_BADGE, TIPO_LABEL, formatFecha, describirCriterios,
} from 'components/Shared/Formularios/Sorteo/sorteoUtils';

const TIPO_BADGE = {
    INDIVIDUAL: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30',
    GRUPAL:     'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30',
    AMBOS:      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30',
};

const StatCard = ({ icon: Icon, label, value, accent }) => (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${accent}`}><Icon className="w-5 h-5" /></div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-dark-text-muted">{label}</p>
            <p className="text-2xl font-black text-slate-800 dark:text-dark-text tabular-nums leading-tight">{value ?? '—'}</p>
        </div>
    </div>
);

const Show = () => {
    const { can } = useAuth();
    const {
        sorteo, loadingSorteo,
        lista, resumen, fuente, loadingLista, paginationInfo, fetchLista,
        filters, handleFilterChange, handleFilterSubmit, handleFilterClear,
        alert, setAlert,
        confirm, setConfirm, working, handleConfirm,
        pdf, setPdf, pdfLoading, handleImprimir,
    } = useShow();

    if (loadingSorteo) return <LoadingScreen />;
    if (!sorteo) {
        return (
            <div className="container mx-auto p-6">
                <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            </div>
        );
    }

    const estado     = sorteo.estado;
    const conBoletos = estado !== ESTADO.CONFIGURACION;
    const criterios  = describirCriterios(sorteo);

    const columns = [
        {
            header: 'N° Boleto',
            render: (r) => <span className="font-mono font-black text-brand-red dark:text-brand-gold">{r.numero_boleto}</span>,
        },
        {
            header: 'Cliente',
            render: (r) => (
                <div>
                    <p className="font-bold text-slate-800 dark:text-dark-text uppercase text-sm">{r.nombre_completo}</p>
                    <p className="text-xs text-slate-500 dark:text-dark-text-muted">DNI {r.dni || '—'}</p>
                </div>
            ),
        },
        {
            header: 'Tipo',
            render: (r) => (
                <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-black uppercase ${TIPO_BADGE[r.tipo]}`}>
                    {r.tipo}
                </span>
            ),
        },
        { header: 'Grupo', render: (r) => <span className="text-xs font-bold text-slate-600 dark:text-dark-text uppercase">{r.grupos || '—'}</span> },
        {
            header: 'Contacto',
            render: (r) => (
                <div className="text-xs text-slate-600 dark:text-dark-text-muted">
                    <p>{[r.telefono_movil, r.telefono_fijo].filter(Boolean).join(' / ') || '—'}</p>
                    {r.direccion && <p className="truncate max-w-[220px]" title={r.direccion}>{r.direccion}</p>}
                </div>
            ),
        },
        {
            header: 'Préstamos',
            render: (r) => (
                <span className="text-xs text-slate-600 dark:text-dark-text-muted whitespace-nowrap">
                    <b className="text-slate-800 dark:text-dark-text">{r.prestamos_activos}</b> vig. · <b className="text-slate-800 dark:text-dark-text">{r.prestamos_liquidados}</b> liq.
                </span>
            ),
        },
        ...(conBoletos && can('sorteo.generatePDF') ? [{
            header: '',
            render: (r) => (
                <div className="flex justify-end">
                    <button
                        onClick={() => handleImprimir(r.cliente_id)}
                        disabled={pdfLoading !== null}
                        title="Reimprimir este boleto"
                        className="p-2 text-slate-400 dark:text-dark-text-muted hover:text-brand-red dark:hover:text-brand-gold hover:bg-brand-red-light dark:hover:bg-dark-surface-alt rounded-xl transition-all disabled:opacity-40"
                    >
                        {pdfLoading === r.cliente_id
                            ? <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            : <PrinterIcon className="w-4 h-4" />}
                    </button>
                </div>
            ),
        }] : []),
    ];

    const filterConfig = [
        { name: 'search', type: 'text', label: 'Buscar', placeholder: 'Nombre, DNI, N° boleto o grupo...', colSpan: 'col-span-12 md:col-span-6' },
        {
            name: 'tipo', type: 'select', label: 'Tipo', colSpan: 'col-span-12 md:col-span-4',
            options: [
                { value: '', label: 'Todos' },
                { value: 'INDIVIDUAL', label: 'Sólo individual' },
                { value: 'GRUPAL', label: 'Sólo grupal' },
                { value: 'AMBOS', label: 'Ambos' },
            ],
        },
    ];

    const btn = 'flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50';

    return (
        <div className="container mx-auto p-6 transition-colors">
            <PageHeader title={sorteo.nombre} subtitle={sorteo.premio ? `Premio: ${sorteo.premio}` : undefined} icon={TicketIcon} buttonText="Volver" buttonLink="/sorteo/listar" />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            {/* ── Info + acciones ───────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white dark:bg-dark-surface p-6 rounded-3xl border border-slate-100 dark:border-dark-border shadow-sm">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${ESTADO_BADGE[estado]}`}>{sorteo.estado_label}</span>
                        <span className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-dark-border text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-dark-text-muted">
                            {TIPO_LABEL[sorteo.tipo_prestamo]}
                        </span>
                        {sorteo.fecha_generacion && (
                            <span className="text-[10px] font-bold text-slate-400 dark:text-dark-text-muted uppercase">Generado: {sorteo.fecha_generacion}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-dark-text-muted">Fecha de cierre</p>
                            <p className="font-black text-slate-800 dark:text-dark-text">{formatFecha(sorteo.fecha_cierre)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-dark-text-muted">Fecha del sorteo</p>
                            <p className="font-black text-slate-800 dark:text-dark-text">{formatFecha(sorteo.fecha_sorteo)}</p>
                        </div>
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-dark-text-muted mb-1">Criterios</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                        {criterios.map((c) => (
                            <li key={c} className="text-xs font-bold text-slate-600 dark:text-dark-text flex gap-2"><span className="text-brand-red dark:text-brand-gold">•</span>{c}</li>
                        ))}
                    </ul>
                    {sorteo.descripcion && (
                        <p className="mt-4 text-sm text-slate-600 dark:text-dark-text-muted whitespace-pre-line">{sorteo.descripcion}</p>
                    )}
                </div>

                <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-slate-100 dark:border-dark-border shadow-sm flex flex-col gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-dark-text-muted">Acciones</p>

                    {can('sorteo.generar') && estado !== ESTADO.CERRADO && (
                        <button onClick={() => setConfirm('generar')} disabled={working}
                            className={`${btn} bg-brand-red dark:bg-brand-red-glow text-white dark:text-black hover:bg-brand-red-dark dark:hover:brightness-110`}>
                            <SparklesIcon className="w-4 h-4" /> {conBoletos ? 'Regenerar boletos' : 'Generar boletos'}
                        </button>
                    )}

                    {can('sorteo.generatePDF') && conBoletos && (
                        <button onClick={() => handleImprimir()} disabled={pdfLoading !== null}
                            className={`${btn} bg-slate-800 dark:bg-dark-surface-alt text-white dark:text-dark-text hover:bg-slate-900 border border-transparent dark:border-dark-border`}>
                            {pdfLoading === 'all'
                                ? <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Generando PDF...</>
                                : <><PrinterIcon className="w-4 h-4" /> Imprimir todos los boletos</>}
                        </button>
                    )}

                    {can('sorteo.update') && estado !== ESTADO.CERRADO && (
                        <Link to={`/sorteo/editar/${sorteo.id}`}
                            className={`${btn} bg-white dark:bg-dark-surface text-slate-700 dark:text-dark-text border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-surface-alt`}>
                            <PencilSquareIcon className="w-4 h-4" /> Editar configuración
                        </Link>
                    )}

                    {can('sorteo.cerrar') && estado === ESTADO.GENERADO && (
                        <button onClick={() => setConfirm('cerrar')} disabled={working}
                            className={`${btn} bg-white dark:bg-dark-surface text-slate-700 dark:text-dark-text border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-surface-alt`}>
                            <LockClosedIcon className="w-4 h-4" /> Cerrar sorteo
                        </button>
                    )}

                    {estado === ESTADO.CERRADO && (
                        <p className="text-xs text-slate-500 dark:text-dark-text-muted text-center">Sorteo cerrado: sólo lectura e impresión.</p>
                    )}
                    {pdfLoading === 'all' && (
                        <p className="text-[10px] text-slate-400 dark:text-dark-text-muted text-center">Con cientos de boletos puede tardar unos segundos.</p>
                    )}
                </div>
            </div>

            {/* ── Resumen ───────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <StatCard icon={UsersIcon}     label="Total"      value={resumen?.total}      accent="bg-brand-red-light text-brand-red dark:bg-brand-gold/10 dark:text-brand-gold" />
                <StatCard icon={UserIcon}      label="Individual" value={resumen?.individual} accent="bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300" />
                <StatCard icon={UserGroupIcon} label="Grupal"     value={resumen?.grupal}     accent="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300" />
                <StatCard icon={TicketIcon}    label="Ambos"      value={resumen?.ambos}      accent="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300" />
            </div>

            {fuente === 'EN_VIVO' && (
                <div className="flex gap-2 items-start p-3 mb-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-xs font-medium text-amber-800 dark:text-amber-300">
                    <InformationCircleIcon className="w-5 h-5 shrink-0" />
                    Vista previa en vivo: esta lista cambia según los pagos de los clientes. Cuando la fecha de cierre llegue, pulsa "Generar boletos" para congelarla y asignar los números.
                </div>
            )}

            <Table
                columns={columns}
                data={lista}
                loading={loadingLista}
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchLista }}
            />

            {confirm && (
                <ConfirmModal
                    title={confirm === 'generar' ? (conBoletos ? '¿Regenerar boletos?' : '¿Generar boletos?') : '¿Cerrar sorteo?'}
                    message={confirm === 'generar'
                        ? (conBoletos
                            ? 'Se recalcula la lista con los datos de hoy y se reemplazan los boletos actuales. Clientes que ya no cumplen saldrán de la lista.'
                            : `Se congelará la lista con los ${resumen?.total ?? 0} clientes que cumplen hoy y se les asignará su número de boleto.`)
                        : 'Una vez cerrado ya no se podrá editar ni regenerar los boletos.'}
                    confirmText={confirm === 'generar' ? 'Sí, generar' : 'Sí, cerrar'}
                    loading={working}
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}

            <PdfModal isOpen={!!pdf} onClose={() => setPdf(null)} title={pdf?.title} base64={pdf?.base64} />
        </div>
    );
};

export default Show;
