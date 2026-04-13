import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/EntidadBancaria/useIndex';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';

import { BuildingLibraryIcon, PencilSquareIcon, HashtagIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, entidades, paginationInfo, filters, alert, setAlert,
        showConfirm, setShowConfirm, setIdToToggle,
        fetchEntidades, handleAskToggle, handleConfirmToggle,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar Banco', placeholder: 'Ej: BCP, Interbank...', colSpan: 'col-span-12 md:col-span-8' },
        { name: 'estado', type: 'select', label: 'Estado', colSpan: 'col-span-12 md:col-span-4',
          options: [{ value: '', label: 'Todos' }, { value: '1', label: 'Activos' }, { value: '0', label: 'Inactivos' }] }
    ], []);

    const columns = useMemo(() => [
        {
            header: 'Entidad Bancaria',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                        <BuildingLibraryIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-black text-slate-800 text-sm uppercase">{row.nombre}</span>
                </div>
            )
        },
        {
            header: 'Reglas de Validación',
            render: (row) => (
                <div className="flex flex-col gap-1.5 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1"><HashtagIcon className="w-3.5 h-3.5"/> Cuenta: <b className="text-black">{row.longitud_cuenta} dígitos</b></span>
                    <span className="flex items-center gap-1"><HashtagIcon className="w-3.5 h-3.5"/> CCI: <b className="text-black">{row.longitud_cci} dígitos</b></span>
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button
                    onClick={() => handleAskToggle(row.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase cursor-pointer hover:scale-105 transition-transform shadow-sm
                        ${row.estado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
                >
                    {row.estado ? 'Activo' : 'Inactivo'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Link to={`/entidadBancaria/editar/${row.id}`}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100">
                        <PencilSquareIcon className="w-5 h-5" />
                    </Link>
                </div>
            )
        }
    ], [handleAskToggle]);

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader
                title="Entidades Bancarias"
                icon={BuildingLibraryIcon}
                buttonText="+ Nuevo Banco"
                buttonLink="/entidadBancaria/agregar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <Table
                columns={columns} data={entidades} loading={loading}
                filterConfig={filterConfig} filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchEntidades }}
            />

            {showConfirm && (
                <ConfirmModal
                    message="¿Estás seguro de cambiar el estado de esta entidad bancaria?"
                    confirmText="Sí, cambiar" cancelText="Cancelar"
                    onConfirm={handleConfirmToggle}
                    onCancel={() => { setShowConfirm(false); setIdToToggle(null); }}
                />
            )}
        </div>
    );
};

export default Index;