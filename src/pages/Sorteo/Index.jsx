import React from 'react';
import { Link } from 'react-router-dom';
import { TicketIcon, TrashIcon, PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useIndex } from 'hooks/Sorteo/useIndex';
import { useAuth } from 'context/AuthContext';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { ESTADO, ESTADO_BADGE, TIPO_LABEL, formatFecha } from 'components/Shared/Formularios/Sorteo/sorteoUtils';

const actionBtn = 'p-2 text-slate-400 dark:text-dark-text-muted hover:text-brand-red dark:hover:text-brand-gold hover:bg-brand-red-light dark:hover:bg-dark-surface-alt rounded-xl transition-all border border-transparent hover:border-brand-red/20 dark:hover:border-brand-gold/20 shadow-sm';

const Index = () => {
    const { can } = useAuth();
    const {
        loading, sorteos, paginationInfo, filters, alert, setAlert,
        deleteId, setDeleteId, handleConfirmDelete, fetchSorteos,
        handleFilterChange, handleFilterSubmit, handleFilterClear,
    } = useIndex();

    const columns = [
        {
            header: 'Sorteo',
            render: (r) => (
                <div>
                    <p className="font-black text-slate-800 dark:text-dark-text">{r.nombre}</p>
                    {r.premio && <p className="text-xs text-slate-500 dark:text-dark-text-muted">🎁 {r.premio}</p>}
                </div>
            ),
        },
        { header: 'Tipo', render: (r) => <span className="text-xs font-bold uppercase text-slate-500 dark:text-dark-text-muted">{TIPO_LABEL[r.tipo_prestamo]}</span> },
        { header: 'Cierre', render: (r) => <span className="text-sm font-bold text-slate-700 dark:text-dark-text">{formatFecha(r.fecha_cierre)}</span> },
        { header: 'Fecha sorteo', render: (r) => <span className="text-sm font-bold text-slate-700 dark:text-dark-text">{formatFecha(r.fecha_sorteo)}</span> },
        {
            header: 'Estado',
            render: (r) => (
                <span className={`inline-block px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${ESTADO_BADGE[r.estado]}`}>
                    {r.estado_label}
                </span>
            ),
        },
        {
            header: 'Boletos',
            render: (r) => r.estado === ESTADO.CONFIGURACION
                ? <span className="text-xs text-slate-400 dark:text-dark-text-muted">—</span>
                : <span className="font-black text-brand-red dark:text-brand-gold">{r.participantes_count}</span>,
        },
        {
            header: 'Acciones',
            render: (r) => (
                <div className="flex justify-end gap-2">
                    {can('sorteo.show') && (
                        <Link to={`/sorteo/ver/${r.id}`} className={actionBtn} title="Ver participantes"><EyeIcon className="w-4 h-4" /></Link>
                    )}
                    {can('sorteo.update') && r.estado !== ESTADO.CERRADO && (
                        <Link to={`/sorteo/editar/${r.id}`} className={actionBtn} title="Editar"><PencilSquareIcon className="w-4 h-4" /></Link>
                    )}
                    {can('sorteo.delete') && r.estado !== ESTADO.CERRADO && (
                        <button onClick={() => setDeleteId(r.id)} className={actionBtn} title="Eliminar"><TrashIcon className="w-4 h-4" /></button>
                    )}
                </div>
            ),
        },
    ];

    const filterConfig = [
        { name: 'search', type: 'text', label: 'Buscar', placeholder: 'Nombre o premio...', colSpan: 'col-span-12 md:col-span-4' },
        {
            name: 'estado', type: 'select', label: 'Estado', colSpan: 'col-span-12 md:col-span-3',
            options: [
                { value: '', label: 'Todos' },
                { value: '1', label: 'En configuración' },
                { value: '2', label: 'Boletos generados' },
                { value: '3', label: 'Cerrado' },
            ],
        },
        {
            name: 'tipo_prestamo', type: 'select', label: 'Tipo', colSpan: 'col-span-12 md:col-span-3',
            options: [
                { value: '', label: 'Todos' },
                { value: 'INDIVIDUAL', label: 'Individual' },
                { value: 'GRUPAL', label: 'Grupal' },
                { value: 'AMBOS', label: 'Ambos' },
            ],
        },
    ];

    return (
        <div className="container mx-auto p-6 transition-colors">
            <PageHeader
                title="Sorteos"
                icon={TicketIcon}
                buttonText={can('sorteo.store') ? '+ Nuevo Sorteo' : undefined}
                buttonLink="/sorteo/agregar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns}
                data={sorteos}
                loading={loading}
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchSorteos }}
            />

            {deleteId && (
                <ConfirmModal
                    title="¿Eliminar sorteo?"
                    message="Se borrarán también los boletos generados."
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
};

export default Index;
