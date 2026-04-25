import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/Caja/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { InboxStackIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, cajas, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, showDelete, setShowDelete,
        fetchCajas, handleAskStatus, handleConfirmStatus, handleAskDelete, handleConfirmDelete,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const columns = useMemo(() => [
        {
            header: 'Caja / Identificador',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl border bg-brand-red-light/50 border-brand-red/20">
                        <InboxStackIcon className="w-5 h-5 text-brand-red" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm uppercase">{row.nombre}</span>
                        <span className="text-[10px] text-slate-400 font-bold italic">{row.descripcion || 'Sin descripción'}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Estado Turno',
            render: (row) => (
                row.sesion_activa ? 
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[9px] font-black rounded-full border border-green-200 uppercase">Turno Abierto</span> :
                    <span className="px-2 py-1 bg-slate-50 text-slate-500 text-[9px] font-black rounded-full border border-slate-200 uppercase">Disponible</span>
            )
        },
        {
            header: 'Visibilidad',
            render: (row) => (
                <button onClick={() => handleAskStatus(row.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all hover:scale-105
                        ${row.activo ? 'bg-green-50 text-green-700 border-green-200' : 'bg-brand-red-light text-brand-red border-brand-red/30'}`}>
                    {row.activo ? 'Activo' : 'Inactivo'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2 justify-end">
                    {/* EDITAR - Hover corporativo */}
                    <Link 
                        to={`/caja/editar/${row.id}`}
                        title="Editar"
                        className="p-2 text-slate-400 hover:text-brand-red hover:bg-brand-red-light rounded-xl transition-all border border-transparent hover:border-brand-red/20 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" />
                    </Link>

                    {/* ELIMINAR - Hover corporativo */}
                    <button 
                        onClick={() => handleAskDelete(row.id)}
                        title="Eliminar"
                        className="p-2 text-slate-400 hover:text-brand-red hover:bg-brand-red-light rounded-xl transition-all border border-transparent hover:border-brand-red/20 shadow-sm"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ], [handleAskStatus, handleAskDelete]);

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader title="Gestión de Cajas" icon={InboxStackIcon} buttonText="+ Nueva Caja" buttonLink="/caja/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns} data={cajas} loading={loading}
                filterConfig={[
                    { name: 'search', type: 'text', label: 'Buscar Caja', colSpan: 'col-span-8' }, 
                    { name: 'activo', type: 'select', label: 'Estado', colSpan: 'col-span-4', options: [{ value: '', label: 'Todos' }, { value: '1', label: 'Activos' }, { value: '0', label: 'Inactivos' }] }
                ]} 
                filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchCajas }}
            />

            {showConfirm && <ConfirmModal message="¿Cambiar la disponibilidad de esta caja?" onConfirm={handleConfirmStatus} onCancel={() => setShowConfirm(false)} />}
            {showDelete && <ConfirmModal title="¿Eliminar Caja?" message="Esta acción no se puede deshacer. Se borrará el historial si no tiene movimientos." confirmText="Sí, Eliminar" onConfirm={handleConfirmDelete} onCancel={() => setShowDelete(false)} />}
        </div>
    );
};

export default Index;