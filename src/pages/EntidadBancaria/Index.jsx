import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/EntidadBancaria/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { BuildingLibraryIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, entidades, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, showDeleteConfirm, setShowDeleteConfirm,
        fetchEntidades, handleAskToggle, handleConfirmToggle, handleAskDelete, handleConfirmDelete,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const columns = useMemo(() => [
        {
            header: 'Entidad Bancaria',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-brand-red-light/50 border border-brand-red/20">
                        <BuildingLibraryIcon className="w-5 h-5 text-brand-red" />
                    </div>
                    <span className="font-black text-slate-800 text-sm uppercase">{row.nombre}</span>
                </div>
            )
        },
        {
            header: 'Validaciones',
            render: (row) => (
                <div className="text-xs text-slate-600 font-medium">
                    <p>Cta: <b className="text-black">{row.longitud_cuenta} díg.</b></p>
                    <p>CCI: <b className="text-black">{row.longitud_cci} díg.</b></p>
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button
                    onClick={() => handleAskToggle(row.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-transform hover:scale-105 shadow-sm border
                        ${row.estado ? 'bg-green-50 text-green-700 border-green-200' : 'bg-brand-red-light text-brand-red border-brand-red/30'}`}
                >
                    {row.estado ? 'Activo' : 'Inactivo'}
                </button>
            )
        },
       {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2 justify-end">

                    {/* EDITAR - Hover corporativo */}
                    <Link 
                        to={`/entidadBancaria/editar/${row.id}`}
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
    ], [handleAskToggle, handleAskDelete]);

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader title="Entidades Bancarias" icon={BuildingLibraryIcon} buttonText="+ Nueva Entidad" buttonLink="/entidadBancaria/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns} data={entidades} loading={loading}
                filterConfig={[{ name: 'search', type: 'text', label: 'Buscar Entidad', colSpan: 'col-span-8' }, { name: 'estado', type: 'select', label: 'Estado', colSpan: 'col-span-4', options: [{ value: '', label: 'Todos' }, { value: '1', label: 'Activos' }, { value: '0', label: 'Inactivos' }] }]} 
                filters={filters} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchEntidades }}
            />

            {/* Modal para Cambio de Estado */}
            {showConfirm && (
                <ConfirmModal
                    message="¿Deseas cambiar el estado de esta entidad?"
                    onConfirm={handleConfirmToggle}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {/* Modal para Eliminación */}
            {showDeleteConfirm && (
                <ConfirmModal
                    title="¿Eliminar Banco?"
                    message="Esta acción es irreversible. Si el banco tiene cuentas asociadas, el sistema bloqueará la eliminación."
                    confirmText="Sí, Eliminar"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </div>
    );
};

export default Index;