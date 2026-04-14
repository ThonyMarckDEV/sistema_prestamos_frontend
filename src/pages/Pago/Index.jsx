import React, { useMemo, useState } from 'react';
import { useIndex } from 'hooks/Pago/useIndex';
import { useAuth } from 'context/AuthContext';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { CheckIcon, XMarkIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { FileSearch } from 'lucide-react';

const Index = () => {
    const { loading, pagos, paginationInfo, filters, setFilters, alert, setAlert, fetchPagos, handleStatusChange } = useIndex();
    const { can } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    const openVoucher = (url) => {
        setSelectedVoucher(url);
        setIsModalOpen(true);
    };

    const filterConfig = [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Operación / Observación', 
            placeholder: 'Ej: 20332932...',
            colSpan: 'col-span-12 md:col-span-7' 
        },
        { 
            name: 'estado', 
            type: 'select', 
            label: 'Estado de Verificación', 
            colSpan: 'col-span-12 md:col-span-5',
            options: [
                { value: '', label: 'TODOS LOS ESTADOS' },
                { value: '0', label: 'PENDIENTES' },
                { value: '1', label: 'APROBADOS' },
                { value: '2', label: 'RECHAZADOS' }
            ]
        }
    ];

    const columns = useMemo(() => [
        {
            header: 'Cliente / Cuota',
            render: (row) => (
                <div className="text-[11px] uppercase">
                    <p className="font-black text-slate-800">{row.cliente || 'N/A'}</p>
                    <p className="text-slate-500 font-bold text-[10px]">
                        Cuota #{row.cuota_nro} - Préstamo #{row.prestamo_id}
                    </p>
                </div>
            )
        },
        {
            header: 'Monto',
            render: (row) => <span className="font-black text-slate-700 text-sm">S/ {row.monto}</span>
        },
        {
            header: 'Operación',
            render: (row) => (
                <span className="font-mono text-[10px] font-bold bg-slate-100 px-2 py-1 rounded border">
                    {row.numero_operacion}
                </span>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-[9px] font-black border ${
                    row.estado === 1 ? 'bg-green-100 text-green-700 border-green-200' :
                    row.estado === 2 ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                }`}>
                    {row.estado === 1 ? 'APROBADO' : row.estado === 2 ? 'RECHAZADO' : 'PENDIENTE'}
                </span>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex gap-2 justify-end">
                    {row.comprobante_url && (
                        <button 
                            onClick={() => openVoucher(row.comprobante_url)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="Ver Voucher"
                        >
                            <FileSearch className="w-4 h-4" />
                        </button>
                    )}

                    {row.estado === 0 && can('pago.status') && (
                        <>
                            <button 
                                onClick={() => handleStatusChange(row.id, 1)} 
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            >
                                <CheckIcon className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => {
                                    const m = prompt("Motivo del rechazo:");
                                    if(m) handleStatusChange(row.id, 2, m);
                                }} 
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ], [handleStatusChange, can]);

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <PageHeader title="Revisión de Pagos" icon={BanknotesIcon} />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={pagos} 
                loading={loading}
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={(n, v) => setFilters(p => ({ ...p, [n]: v }))}
                onFilterSubmit={() => fetchPagos(1)}
                onFilterClear={() => {
                    const reset = { search: '', estado: '' };
                    setFilters(reset);
                    fetchPagos(1);
                }}
                pagination={{
                    currentPage: paginationInfo.currentPage,
                    totalPages: paginationInfo.totalPages,
                    total: paginationInfo.total,
                    onPageChange: (page) => fetchPagos(page)
                }}
            />

            <ViewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Comprobante de Pago Virtual"
            >
                <div className="flex justify-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    {selectedVoucher ? (
                        <img 
                            src={selectedVoucher} 
                            alt="Voucher de pago" 
                            className="max-w-full h-auto object-contain"
                            style={{ maxHeight: '70vh' }}
                        />
                    ) : (
                        <p className="py-20 text-gray-400 font-bold">No se pudo cargar la imagen.</p>
                    )}
                </div>
            </ViewModal>
        </div>
    );
};

export default Index;