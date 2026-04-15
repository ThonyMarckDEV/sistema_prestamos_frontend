import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/Cliente/useIndex';

import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import FichaClienteModal from './FichaClienteModal';

import {
    UserGroupIcon, PencilSquareIcon, IdentificationIcon,
    BriefcaseIcon, EyeIcon, CalendarDaysIcon, BuildingOfficeIcon, 
    UserIcon
} from '@heroicons/react/24/outline';


const Index = () => {
    const {
        loading, clientes, paginationInfo, filters, alert, setAlert,
        isViewOpen, setIsViewOpen, viewData, viewLoading,
        showConfirm, setShowConfirm, setIdToToggle,
        fetchClientes, handleView, handleAskToggle, handleConfirmToggle,
        handleFilterChange, handleFilterSubmit, handleFilterClear
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar (Nombre/DNI/RUC/Razón Social)', placeholder: 'Ej: Juan, 12345678, Empresa SAC...', colSpan: 'col-span-12 md:col-span-5' },
        { name: 'tipo',   type: 'select', label: 'Tipo', colSpan: 'col-span-12 md:col-span-3',
          options: [{ value: '', label: 'Todos' }, { value: '1', label: 'Persona Natural' }, { value: '2', label: 'Empresa' }] },
        { name: 'estado', type: 'select', label: 'Estado', colSpan: 'col-span-12 md:col-span-4',
          options: [{ value: '', label: 'Todos' }, { value: '1', label: 'Activos' }, { value: '0', label: 'Inactivos' }] }
    ], []);

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
            header: 'Cliente',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full border ${row.tipo === 2 ? 'bg-amber-50 border-amber-200' : 'bg-slate-100 border-slate-200'}`}>
                        {row.tipo === 2
                            ? <BuildingOfficeIcon className="w-6 h-6 text-amber-600" />
                            : <UserIcon className="w-6 h-6 text-slate-600" />
                        }
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{row.nombre_completo}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <BriefcaseIcon className="w-3 h-3"/> {row.usuario || 'Sin usuario'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Tipo / Documento',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border w-fit ${
                        row.tipo === 2 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                        {row.tipo === 2 ? 'Empresa' : 'Persona Natural'}
                    </span>
                    <span className="text-sm font-bold text-slate-600 flex items-center gap-1">
                        <IdentificationIcon className="w-4 h-4 text-slate-400"/>
                        {row.documento || 'S/N'}
                    </span>
                </div>
            )
        },
        {
            header: 'Registro',
            render: (row) => (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <CalendarDaysIcon className="w-4 h-4"/> {row.created_at?.split(' ')[0]}
                </span>
            )
        },
        {
            header: 'Acceso Sistema',
            render: (row) => (
                <button
                    onClick={() => handleAskToggle(row.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer hover:scale-105 transition-transform shadow-sm
                        ${row.estado ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}
                >
                    {row.estado ? 'Activo' : 'Bloqueado'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2 justify-end">

                    {/* VER */}
                    <button 
                        onClick={() => handleView(row.id)}
                        title="Ver Detalle"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm"
                    >
                        <EyeIcon className="w-4 h-4" />
                    </button>

                    {/* EDITAR */}
                    <Link 
                        to={`/cliente/editar/${row.id}`}
                        title="Editar"
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm"
                    >
                        <PencilSquareIcon className="w-4 h-4" />
                    </Link>

                </div>
            )
        }
    ], [handleAskToggle, handleView]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader
                title="Gestión de Clientes"
                icon={UserGroupIcon}
                buttonText="+ Nuevo Cliente"
                buttonLink="/cliente/agregar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns} data={clientes} loading={loading}
                filterConfig={filterConfig} filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchClientes }}
            />

            {showConfirm && (
                <ConfirmModal
                    message="¿Estás seguro de cambiar el acceso al sistema de este cliente?"
                    confirmText="Sí, cambiar" cancelText="Cancelar"
                    onConfirm={handleConfirmToggle}
                    onCancel={() => { setShowConfirm(false); setIdToToggle(null); }}
                />
            )}

            <FichaClienteModal 
                isOpen={isViewOpen} 
                onClose={() => setIsViewOpen(false)} 
                data={viewData} 
                isLoading={viewLoading} 
            />

        </div>
    );
};

export default Index;