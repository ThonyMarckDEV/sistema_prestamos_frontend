import React, { useMemo } from 'react';
import { useIndex } from 'hooks/SolicitudPrestamo/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { DocumentTextIcon, CheckIcon, XMarkIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import ViewSolicitudModal from './ViewSolicitudModal';
import { EyeIcon } from 'lucide-react';

const Index = () => {
    const { loading, solicitudes, paginationInfo, filters, alert, setAlert, 
        handleUpdateStatus, handleFilterChange, handleFilterSubmit, 
        handleFilterClear, fetchSolicitudes , handleView, 
        isViewOpen, setIsViewOpen, viewData, viewLoading,
    } = useIndex();

    const columns = useMemo(() => [
        { 
            header: 'Cliente', 
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-xs uppercase">{row.cliente_nombre}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Asesor: {row.asesor_nombre}</span>
                </div>
            ) 
        },
        { 
            header: 'Propuesta', 
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-black text-red-600">S/ {row.monto_solicitado}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{row.cuotas_solicitadas} cuotas | {row.frecuencia}</span>
                </div>
            ) 
        },
        { 
            header: 'Producto / Tasa', 
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">{row.producto_nombre}</span>
                    <span className="text-[10px] text-blue-600 font-black">Tasa: {row.tasa_interes}%</span>
                </div>
            ) 
        },
        { 
            header: 'Modalidad', 
            render: (row) => (
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-black text-slate-600">
                    {row.modalidad}
                </span>
            ) 
        },
        { 
            header: 'Estado', 
            render: (row) => {
                const statusMap = { 1: 'bg-yellow-100 text-yellow-700 border-yellow-200', 2: 'bg-green-100 text-green-700 border-green-200', 3: 'bg-red-100 text-red-700 border-red-200' };
                const labelMap = { 1: 'PENDIENTE', 2: 'APROBADO', 3: 'RECHAZADO' };
                return <span className={`px-2 py-1 rounded-full text-[9px] font-black border ${statusMap[row.estado]}`}>{labelMap[row.estado]}</span>
            }
        },
        { 
            header: 'Acciones', 
            render: (row) => (
                <div className="flex gap-2">
                    <button onClick={() => handleView(row.id)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
                        <EyeIcon className="w-4 h-4" />
                    </button>
                    <Link to={`/solicitudPrestamo/editar/${row.id}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <PencilSquareIcon className="w-4 h-4"/>
                    </Link>
                    {row.estado === 1 && (
                        <>
                            <button title="Aprobar" onClick={() => handleUpdateStatus(row.id, 2)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg"><CheckIcon className="w-4 h-4"/></button>
                            <button title="Rechazar" onClick={() => handleUpdateStatus(row.id, 3)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><XMarkIcon className="w-4 h-4"/></button>
                        </>
                    )}
                </div>
            )
        }
    ], [handleUpdateStatus, handleView]);

    if (loading && solicitudes.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Solicitudes" icon={DocumentTextIcon} buttonText="+ Nueva Solicitud" buttonLink="/solicitudPrestamo/agregar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <Table columns={columns} data={solicitudes} loading={loading} pagination={{ ...paginationInfo, onPageChange: fetchSolicitudes }} onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} onFilterClear={handleFilterClear} filters={filters} filterConfig={[{name: 'search', type: 'text', label: 'Buscar Cliente', colSpan: 'col-span-12'}]} />
            <ViewSolicitudModal 
                isOpen={isViewOpen} 
                onClose={() => setIsViewOpen(false)} 
                data={viewData} 
                isLoading={viewLoading} 
            />
        </div>
    );
};
export default Index;