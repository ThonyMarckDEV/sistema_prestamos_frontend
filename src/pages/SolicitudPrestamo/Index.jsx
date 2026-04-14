import React, { useMemo } from 'react';
import { useIndex } from 'hooks/SolicitudPrestamo/useIndex';
import { useAuth } from 'context/AuthContext';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { DocumentTextIcon, CheckIcon, XMarkIcon, PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import ViewSolicitudModal from './ViewSolicitudModal';
import ApproveSolicitudModal from 'components/Shared/Modals/ApproveSolicitudModal';

const Index = () => {
    const { can } = useAuth();
    const { 
        loading, solicitudes, paginationInfo, filters, alert, setAlert, 
        handleUpdateStatus, handleFilterChange, handleFilterSubmit, 
        handleFilterClear, fetchSolicitudes, handleView, 
        isViewOpen, setIsViewOpen, viewData, viewLoading,
        isApproveOpen, setIsApproveOpen, selectedSolicitud, openApproveModal
    } = useIndex();

    const canShow = can('solicitudPrestamo.show'); 
    const canUpdate = can('solicitudPrestamo.update');
    const canStatus = can('solicitudPrestamo.status');

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar Cliente / DNI', placeholder: 'Ej: Anthony...', colSpan: 'col-span-12 md:col-span-8' },
        { 
            name: 'estado', type: 'select', label: 'Estado', colSpan: 'col-span-12 md:col-span-4',
            options: [
                { value: '1', label: 'SOLO PENDIENTES' },
                { value: '2', label: 'APROBADAS' },
                { value: '3', label: 'RECHAZADAS' },
                { value: 'all', label: 'TODAS LAS SOLICITUDES' }
            ]
        }
    ], []);

    const columns = useMemo(() => [
        { header: 'Cliente', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-xs uppercase">{row.cliente_nombre}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">Asesor: {row.asesor_nombre}</span>
            </div>
        )},
        { header: 'Propuesta', render: (row) => (
            <div className="flex flex-col">
                <span className="font-black text-red-600 italic">S/ {row.monto_solicitado}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">{row.cuotas_solicitadas} cuotas | {row.frecuencia}</span>
            </div>
        )},
        { header: 'Producto / Tasa', render: (row) => (
            <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700 uppercase">{row.producto_nombre}</span>
                <span className="text-[10px] text-blue-600 font-black uppercase">Tasa: {row.tasa_interes}%</span>
            </div>
        )},
        { header: 'Estado', render: (row) => {
            const statusMap = { 1: 'bg-yellow-100 text-yellow-700 border-yellow-200', 2: 'bg-green-100 text-green-700 border-green-200', 3: 'bg-red-100 text-red-700 border-red-200' };
            const labelMap = { 1: 'PENDIENTE', 2: 'APROBADO', 3: 'RECHAZADO' };
            return <span className={`px-2 py-1 rounded-full text-[9px] font-black border ${statusMap[row.estado]}`}>{labelMap[row.estado]}</span>
        }},
        { header: 'Acciones', render: (row) => (
            <div className="flex gap-2">
                {canShow && (
                    <button onClick={() => handleView(row.id)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
                        <EyeIcon className="w-4 h-4" />
                    </button>
                )}
                {row.estado === 1 && (
                    <>
                        {canUpdate && (
                            <Link to={`/solicitudPrestamo/editar/${row.id}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                <PencilSquareIcon className="w-4 h-4"/>
                            </Link>
                        )}
                        {canStatus && (
                            <>
                                <button 
                                    type="button"
                                    onClick={() => openApproveModal(row)} 
                                    className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg shadow-sm border border-green-100"
                                >
                                    <CheckIcon className="w-4 h-4 font-bold"/>
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => handleUpdateStatus(row.id, 3)} 
                                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg border border-red-50"
                                >
                                    <XMarkIcon className="w-4 h-4"/>
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        )}
    ], [canShow, canUpdate, canStatus, handleView, openApproveModal, handleUpdateStatus]); // 🔥 Dependencias completas

    if (loading && solicitudes.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Solicitudes de Préstamo" icon={DocumentTextIcon} buttonText="+ Nueva Solicitud" buttonLink="/solicitudPrestamo/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={solicitudes} 
                loading={loading} 
                pagination={{ ...paginationInfo, onPageChange: fetchSolicitudes }} 
                onFilterChange={handleFilterChange} 
                onFilterSubmit={handleFilterSubmit} 
                onFilterClear={handleFilterClear} 
                filters={filters} 
                filterConfig={filterConfig}
            />

            {/* MODALES AL FINAL DEL DOM */}
            <ViewSolicitudModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} data={viewData} isLoading={viewLoading} />
            
            {isApproveOpen && (
                <ApproveSolicitudModal 
                    isOpen={isApproveOpen}
                    onClose={() => setIsApproveOpen(false)}
                    onConfirm={handleUpdateStatus}
                    solicitud={selectedSolicitud}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default Index;