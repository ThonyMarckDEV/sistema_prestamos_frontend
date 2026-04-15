import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/Grupo/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { UserGroupIcon, PencilSquareIcon, TrashIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, grupos, paginationInfo, filters, alert, setAlert,
        showDelete, setShowDelete,
        fetchGrupos, handleAskDelete, handleConfirmDelete,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const columns = useMemo(() => [
        { 
            header: 'ID', 
            render: (row) => (
                <span className="font-mono text-[15px] font-black px-2 py-1 rounded text-slate-600">
                    {row.id}
                </span>
            )
        },
        {
            header: 'Grupo Solidario',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl border bg-slate-100 border-slate-200">
                        <UserGroupIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm uppercase">{row.nombre}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Actividad',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <ChartBarIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">
                        {row.solicitudes_count} Solicitudes
                    </span>
                </div>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2 justify-end">
                    <Link 
                        to={`/grupo/editar/${row.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" />
                    </Link>
                    <button 
                        onClick={() => handleAskDelete(row.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ], [handleAskDelete]);

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader title="Grupos Solidarios" icon={UserGroupIcon} buttonText="+ Nuevo Grupo" buttonLink="/grupo/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <Table
                columns={columns} data={grupos} loading={loading}
                filterConfig={[
                    { name: 'search', type: 'text', label: 'Buscar Grupo', colSpan: 'col-span-8' }, 
                    { name: 'activo', type: 'select', label: 'Estado', colSpan: 'col-span-4', options: [{ value: '', label: 'Todos' }, { value: '1', label: 'Activos' }, { value: '0', label: 'Inactivos' }] }
                ]} 
                filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchGrupos }}
            />
            {showDelete && <ConfirmModal title="¿Eliminar Grupo?" message="Esta acción solo es posible si el grupo no tiene historial de préstamos." confirmText="Sí, Eliminar" onConfirm={handleConfirmDelete} onCancel={() => setShowDelete(false)} />}
        </div>
    );
};

export default Index;