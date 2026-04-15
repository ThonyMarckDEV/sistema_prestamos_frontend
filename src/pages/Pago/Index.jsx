import React, { useMemo, useState } from 'react';
import { useIndex } from 'hooks/Pago/useIndex';
import { useAuth } from 'context/AuthContext';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ViewModal from 'components/Shared/Modals/ViewModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import RechazarPagoModal from './RechazarPagoModal';
import PdfModal from 'components/Shared/Modals/PdfModal';
import { CheckIcon, XMarkIcon, BanknotesIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { FileSearch } from 'lucide-react';

const Index = () => {
    const { 
        loading, pagos, paginationInfo, filters, setFilters, alert, setAlert, fetchPagos, handleStatusChange,
        handleFilterSubmit, handleFilterClear,
        handleViewPdf, pdfLoading, isPdfModalOpen, setIsPdfModalOpen, pdfTitle, pdfBase64 
    } = useIndex();
    const { can } = useAuth();

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isRechazarOpen, setIsRechazarOpen] = useState(false);
    const [activePagoId, setActivePagoId] = useState(null);

    const openVoucher = (url) => {
        setSelectedVoucher(url);
        setIsViewModalOpen(true);
    };

    const filterConfig = useMemo(() => [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Nombre / Dni / Ruc / Op.', 
            placeholder: 'Ej: 20332932...',
            colSpan: 'col-span-12 md:col-span-4' 
        },
        { 
            name: 'estado', 
            type: 'select', 
            label: 'Estado', 
            colSpan: 'col-span-12 md:col-span-3',
            options: [
                { value: '', label: 'TODOS LOS PAGOS' },
                { value: '0', label: 'PENDIENTES' },
                { value: '1', label: 'APROBADOS' },
                { value: '2', label: 'RECHAZADOS' }
            ]
        }
    ], []);

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
            render: (row) => <span className="font-mono text-[10px] font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200">{row.numero_operacion}</span>
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
                <div className="flex gap-2 items-center justify-end">

                    {/* 👁️ VER VOUCHER */}
                    {row.comprobante_url && (
                        <button 
                            onClick={() => openVoucher(row.comprobante_url)}
                            title="Ver Voucher"
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl border border-transparent hover:border-emerald-100 transition-all shadow-sm"
                        >
                            <FileSearch className="w-4 h-4" />
                        </button>
                    )}

                    {/* 🖨️ IMPRIMIR PDF */}
                    {row.estado === 1 && can('pago.generatePDF') && (
                        <button 
                            onClick={() => handleViewPdf(row.id)}
                            disabled={pdfLoading}
                            title="Imprimir Recibo"
                            className={`p-2 rounded-xl transition-all border border-transparent shadow-sm 
                            ${pdfLoading 
                                ? 'bg-slate-50 text-slate-300' 
                                : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100'
                            }`}
                        >
                            <PrinterIcon className={`w-4 h-4 ${pdfLoading ? 'animate-spin' : ''}`} />
                        </button>
                    )}

                    {/* ✅❌ APROBAR / RECHAZAR */}
                    {row.estado === 0 && can('pago.status') && (
                        <>
                            <button 
                                onClick={() => { setActivePagoId(row.id); setIsConfirmOpen(true); }}
                                title="Aprobar Pago"
                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all border border-transparent hover:border-green-100 shadow-sm"
                            >
                                <CheckIcon className="w-4 h-4" />
                            </button>

                            <button 
                                onClick={() => { setActivePagoId(row.id); setIsRechazarOpen(true); }}
                                title="Rechazar Pago"
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </>
                    )}

                </div>
            )
        }
    ], [can, pdfLoading, handleViewPdf]);

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <PageHeader title="Control de Pagos" icon={BanknotesIcon} />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={pagos} 
                loading={loading}
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={(n, v) => setFilters(p => ({ ...p, [n]: v }))}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchPagos }} 
            />

            {/* Modal Imagen Voucher */}
            <ViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Voucher de Pago">
                <div className="flex justify-center bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                    <img src={selectedVoucher} alt="Voucher" className="max-w-full h-auto object-contain" style={{ maxHeight: '70vh' }} />
                </div>
            </ViewModal>

            {/* Modal Confirmar Aprobación */}
            {isConfirmOpen && (
                <ConfirmModal 
                    title="Aprobar Pago" 
                    message="¿Confirmar este pago virtual? Se registrará el ingreso en caja." 
                    onConfirm={async () => { await handleStatusChange(activePagoId, 1); setIsConfirmOpen(false); }} 
                    onCancel={() => setIsConfirmOpen(false)} 
                />
            )}

            {/* Modal Rechazo */}
            <RechazarPagoModal 
                isOpen={isRechazarOpen} 
                onClose={() => setIsRechazarOpen(false)} 
                onConfirm={async (m) => { await handleStatusChange(activePagoId, 2, m); setIsRechazarOpen(false); }} 
                loading={loading} 
            />

            <PdfModal 
                isOpen={isPdfModalOpen} 
                onClose={() => setIsPdfModalOpen(false)} 
                title={pdfTitle} 
                base64={pdfBase64} 
            />
        </div>
    );
};

export default Index;