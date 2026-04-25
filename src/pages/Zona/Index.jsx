import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/Zona/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { MapIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, zonas, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, showDelete, setShowDelete,
        fetchZonas, handleAskStatus, handleConfirmStatus, handleAskDelete, handleConfirmDelete,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const columns = useMemo(() => [
        {
            header: 'Zona Comercial',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl border bg-brand-red-light/50 border-brand-red/20">
                        <MapIcon className="w-5 h-5 text-brand-red" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm uppercase">{row.nombre}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button onClick={() => handleAskStatus(row.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all hover:scale-105
                        ${row.activo ? 'bg-green-50 text-green-700 border-green-200' : 'bg-brand-red-light text-brand-red border-brand-red/30'}`}>
                    {row.activo ? 'Activa' : 'Inactiva'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2 justify-end">
                    {/* 🔥 Hover corporativo */}
                    <Link 
                        to={`/zona/editar/${row.id}`}
                        title="Editar"
                        className="p-2 text-slate-400 hover:text-brand-red hover:bg-brand-red-light rounded-xl transition-all border border-transparent hover:border-brand-red/20 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" />
                    </Link>

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
            <PageHeader title="Gestión de Zonas" icon={MapIcon} buttonText="+ Nueva Zona" buttonLink="/zona/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns} data={zonas} loading={loading}
                filterConfig={[
                    { name: 'search', type: 'text', label: 'Buscar Zona', colSpan: 'col-span-8' }, 
                    { name: 'activo', type: 'select', label: 'Estado', colSpan: 'col-span-4', options: [{ value: '', label: 'Todas' }, { value: '1', label: 'Activas' }, { value: '0', label: 'Inactivas' }] }
                ]} 
                filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchZonas }}
            />

            {showConfirm && <ConfirmModal message="¿Cambiar el estado de esta zona?" onConfirm={handleConfirmStatus} onCancel={() => setShowConfirm(false)} />}
            {showDelete && <ConfirmModal title="¿Eliminar Zona?" message="Esta acción no se puede deshacer. No podrás eliminarla si tiene clientes asignados." confirmText="Sí, Eliminar" onConfirm={handleConfirmDelete} onCancel={() => setShowDelete(false)} />}
        </div>
    );
};

export default Index;