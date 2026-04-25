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
    const { 
        loading, solicitudes, paginationInfo, filters, alert, setAlert, 
        handleUpdateStatus, handleFilterChange, handleFilterSubmit, 
        handleFilterClear, fetchSolicitudes, handleView, 
        isViewOpen, setIsViewOpen, viewData, viewLoading,
        isApproveOpen, setIsApproveOpen, selectedSolicitud, openApproveModal
    } = useIndex();

    const { can } = useAuth();

    const columns = useMemo(() => [
        { header: 'ID', render: (row) => <span className="font-black text-slate-600">#{row.id}</span> },
        { header: 'Sujeto / Grupo', render: (row) => (
            <div className="flex flex-col">
                <span className={`font-bold text-xs uppercase ${row.es_grupal ? 'text-brand-red' : 'text-slate-800'}`}>{row.cliente_nombre}</span>
                <span className="text-[9px] text-slate-400 font-medium">ASESOR: {row.asesor_nombre}</span>
            </div>
        )},
        { header: 'Monto', render: (row) => <span className="font-black text-brand-red italic underline">S/ {row.monto_solicitado}</span> },
        { header: 'Estado', render: (row) => {
            const colors = { 
                1: 'bg-brand-gold-light text-brand-gold-dark border border-brand-gold/30', // PENDIENTE (Dorado)
                2: 'bg-green-100 text-green-700 border border-green-200', // APROBADO (Verde se queda)
                3: 'bg-brand-red-light text-brand-red border border-brand-red/30' // RECHAZADO (Rojo corporativo)
            };
            const labels = { 1: 'PENDIENTE', 2: 'APROBADO', 3: 'RECHAZADO' };
            return <span className={`px-2 py-1 rounded-full text-[9px] font-black ${colors[row.estado]}`}>{labels[row.estado]}</span>
        }},
        { header: 'Acciones', render: (row) => (
            <div className="flex gap-1 justify-end">
                <button onClick={() => handleView(row.id)} className="p-1.5 text-slate-400 hover:text-brand-red hover:bg-brand-red-light rounded-lg transition-colors">
                    <EyeIcon className="w-4 h-4" />
                </button>
                
                {row.estado === 1 && (
                    <>
                        {/* PERMISO PARA EDITAR */}
                        {can('solicitudPrestamo.update') && (
                            <Link to={`/solicitudPrestamo/editar/${row.id}`} className="p-1.5 text-slate-400 hover:text-brand-gold-dark hover:bg-brand-gold-light rounded-lg transition-colors">
                                <PencilSquareIcon className="w-4 h-4"/>
                            </Link>
                        )}
                        
                        {/* PERMISO PARA APROBAR O RECHAZAR */}
                        {can('solicitudPrestamo.status') && (
                            <>
                                <button onClick={() => openApproveModal(row)} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                    <CheckIcon className="w-4 h-4 font-bold"/>
                                </button>
                                <button onClick={() => handleUpdateStatus(row.id, 3)} className="p-1.5 text-slate-400 hover:text-brand-red hover:bg-brand-red-light rounded-lg transition-colors">
                                    <XMarkIcon className="w-4 h-4"/>
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        )}
    ], [handleView, openApproveModal, handleUpdateStatus, can]);

    if (loading && solicitudes.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Solicitudes" icon={DocumentTextIcon} buttonText="+ Nueva" buttonLink="/solicitudPrestamo/agregar" />
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
                filterConfig={[
                    { name: 'search', type: 'text', label: 'Buscar...', colSpan: 'col-span-8' }, 
                    { name: 'estado', type: 'select', label: 'Estado', options: [{ value: '1', label: 'PENDIENTES' }, { value: '2', label: 'APROBADAS' }, { value: '3', label: 'RECHAZADAS' }], colSpan: 'col-span-4' }
                ]} 
            />
            
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