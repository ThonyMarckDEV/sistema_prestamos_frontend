import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/Caja/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { InboxStackIcon, PencilSquareIcon, TrashIcon, CpuChipIcon } from '@heroicons/react/24/outline';

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
                    <div className={`p-2.5 rounded-xl border ${row.is_virtual ? 'bg-purple-50 border-purple-200' : 'bg-slate-100 border-slate-200'}`}>
                        {row.is_virtual ? 
                            <CpuChipIcon className="w-5 h-5 text-purple-600" /> : 
                            <InboxStackIcon className="w-5 h-5 text-slate-600" />
                        }
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-black text-slate-800 text-sm uppercase">{row.nombre}</span>
                            {row.is_virtual && (
                                <span className="text-[8px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-black uppercase">Sistema</span>
                            )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold italic">{row.descripcion || 'Sin descripción'}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Estado Turno',
            render: (row) => (
                row.is_virtual ? 
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[9px] font-black rounded-full border border-purple-200 uppercase">Siempre Activo</span> :
                (row.sesion_activa ? 
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[9px] font-black rounded-full border border-blue-200 uppercase">Turno Abierto</span> :
                    <span className="px-2 py-1 bg-slate-100 text-slate-400 text-[9px] font-black rounded-full border border-slate-200 uppercase">Disponible</span>
                )
            )
        },
        {
            header: 'Visibilidad',
            render: (row) => (
                /* 🔥 Si es virtual, es solo un span, no tiene onClick */
                row.is_virtual ? (
                    <div className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase border bg-green-50 text-green-700 border-green-200 w-fit cursor-default">
                        Activo
                    </div>
                ) : (
                    <button onClick={() => handleAskStatus(row.id)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all hover:scale-105
                            ${row.activo ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-600 border-red-200'}`}>
                        {row.activo ? 'Activo' : 'Inactivo'}
                    </button>
                )
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {/* 🔥 Si NO es virtual, mostramos los botones de editar y eliminar */}
                    {!row.is_virtual ? (
                        <>
                            <Link to={`/caja/editar/${row.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100">
                                <PencilSquareIcon className="w-5 h-5" />
                            </Link>
                            <button onClick={() => handleAskDelete(row.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        /* 🔥 Mensaje sutil si es virtual */
                        <span className="text-[10px] text-slate-400 font-bold italic px-2">Solo lectura</span>
                    )}
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