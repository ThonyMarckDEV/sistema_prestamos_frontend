import React, { useMemo } from 'react';
import { useIndex } from 'hooks/Operacion/useIndex';
import { useAuth } from 'context/AuthContext';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PdfModal from 'components/Shared/Modals/PdfModal'; 
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { DocumentTextIcon, ArrowDownRightIcon, ArrowUpRightIcon, PrinterIcon, TrashIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const { can } = useAuth();

    const {
        loading, operaciones, paginationInfo, filters, alert, setAlert,
        fetchOperaciones, handleFilterChange, handleFilterSubmit, handleFilterClear,
        handleViewPdf, isPdfModalOpen, setIsPdfModalOpen, pdfTitle, pdfBase64, pdfLoading,
        isAnularModalOpen, setIsAnularModalOpen, openAnularModal, handleConfirmAnular
    } = useIndex();

    const canGeneratePdf = can('operacion.generatePDF');
    const canDelete = can('operacion.delete');

    const columns = useMemo(() => {
        const baseColumns = [
            {
                header: 'Tipo y Cód.',
                render: (row) => (
                    <div className={`flex flex-col gap-1 ${row.estado === 0 ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-1.5">
                            {row.categoria === 'desembolso' ? (
                                // Desembolso: Rojo porque sale plata
                                <div className={`p-1 rounded-md border ${row.estado === 0 ? 'bg-slate-100 border-slate-300' : 'bg-red-50 border-red-200'}`}>
                                    <ArrowUpRightIcon className={`w-3.5 h-3.5 ${row.estado === 0 ? 'text-slate-500' : 'text-red-600'}`} />
                                </div>
                            ) : (
                                // Cobro: Verde porque entra plata
                                <div className={`p-1 rounded-md border ${row.estado === 0 ? 'bg-slate-100 border-slate-300' : 'bg-green-50 border-green-200'}`}>
                                    <ArrowDownRightIcon className={`w-3.5 h-3.5 ${row.estado === 0 ? 'text-slate-500' : 'text-green-600'}`} />
                                </div>
                            )}
                            <span className={`font-black text-[10px] uppercase tracking-wide ${row.estado === 0 ? 'text-slate-400 line-through' : (row.categoria === 'desembolso' ? 'text-red-700' : 'text-green-700')}`}>
                                {row.categoria === 'desembolso' ? 'Desemb.' : 'Cobro'}
                            </span>
                        </div>
                        <span className={`font-mono text-[12px] font-bold px-1.5 py-0.5 rounded w-fit ${row.estado === 0 ? 'text-slate-500 bg-slate-100' : 'text-slate-600 bg-slate-100 border border-slate-200'}`}>
                            {row.numero_comprobante}
                        </span>
                    </div>
                )
            },
            {
                header: 'Detalle',
                render: (row) => (
                    <div className="flex flex-col min-w-0">
                        <span 
                            className={`text-[11px] font-bold truncate max-w-[160px] lg:max-w-[280px] xl:max-w-[350px] ${row.estado === 0 ? 'text-red-400 line-through' : 'text-slate-800'}`} 
                            title={row.motivo}
                        >
                            {row.motivo}
                        </span>
                        {row.estado === 0 && (
                            <span className="text-[9px] text-brand-red font-bold uppercase mt-0.5 block tracking-widest">
                                Anulado
                            </span>
                        )}
                    </div>
                )
            },
            {
                header: 'Cajero',
                render: (row) => (
                    <div 
                        className={`text-[10px] font-bold uppercase truncate max-w-[100px] lg:max-w-[140px] ${row.estado === 0 ? 'text-slate-400' : 'text-slate-600'}`}
                        title={row.cajero}
                    >
                        {row.cajero === 'SISTEMA AUTOMATIZADO PRESTAMOS' ? 'SISTEMA AUTO.' : row.cajero}
                    </div>
                )
            },
            {
                header: 'Fecha',
                render: (row) => {
                    const d = new Date(row.fecha);
                    return (
                        <div className={`text-[10px] ${row.estado === 0 ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span className="font-bold block whitespace-nowrap">
                                {d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                            <span className="uppercase font-medium whitespace-nowrap">
                                {d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </span>
                        </div>
                    );
                }
            },
            {
                header: 'Monto',
                render: (row) => (
                    <div className={`text-[13px] font-black italic text-right whitespace-nowrap ${row.estado === 0 ? 'text-slate-400 line-through' : (row.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600')}`}>
                        {row.tipo === 'ingreso' ? '+' : '-'} S/ {parseFloat(row.monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </div>
                )
            }
        ];

        if (canGeneratePdf || canDelete) {
            baseColumns.push({
                header: 'Acciones',
                render: (row) => (
                    <div className="flex items-center gap-1.5 justify-end">
                        {canGeneratePdf && (
                            <button
                                onClick={() => handleViewPdf(row.id)}
                                disabled={pdfLoading || row.estado === 0}
                                title="Ver Comprobante"
                                className={`p-1.5 rounded-lg transition-all border border-transparent shadow-sm
                                ${row.estado === 0
                                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                    : 'text-slate-500 hover:text-brand-red hover:bg-brand-red-light hover:border-brand-red/20'
                                }`}
                            >
                                <PrinterIcon className={`w-4 h-4 ${pdfLoading ? 'animate-spin' : ''}`} />
                            </button>
                        )}

                        {canDelete && row.estado !== 0 && (
                            <button
                                onClick={() => openAnularModal(row.id)}
                                title="Anular Operación"
                                className="p-1.5 text-slate-500 hover:text-brand-red hover:bg-brand-red-light rounded-lg transition-all border border-transparent hover:border-brand-red/20 shadow-sm"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )
            });
        }

        return baseColumns;
    }, [handleViewPdf, openAnularModal, pdfLoading, canGeneratePdf, canDelete]);

    const filterConfig = [
        { name: 'search', type: 'text', label: 'Buscar por Código o Motivo', colSpan: 'col-span-12 sm:col-span-8' },
        { name: 'tipo', type: 'select', label: 'Filtrar Tipo', colSpan: 'col-span-12 sm:col-span-4', options: [
            { value: '', label: 'Todos los Movimientos' }, 
            { value: 'desembolso', label: 'Solo Desembolsos' }, 
            { value: 'cobro', label: 'Solo Cobros' }
        ]}
    ];

    return (
        <div className="container mx-auto p-4 sm:p-6 w-full max-w-full xl:max-w-7xl">
            <PageHeader 
                title="Historial de Movimientos" 
                icon={DocumentTextIcon} 
                buttonText="Ir a Caja Operativa" 
                buttonLink="/operacion/caja" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <Table
                columns={columns} data={operaciones} loading={loading}
                filterConfig={filterConfig} filters={filters} 
                onFilterChange={handleFilterChange} onFilterSubmit={handleFilterSubmit} 
                onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchOperaciones }}
            />

            <PdfModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} title={pdfTitle} base64={pdfBase64} />

            {isAnularModalOpen && (
                <ConfirmModal
                    title="¿Anular Operación?"
                    message="Esta acción realizará un extorno de caja y revertirá los estados del préstamo o la cuota. No se puede deshacer."
                    confirmText="Sí, Anular Operación"
                    onConfirm={handleConfirmAnular}
                    onCancel={() => setIsAnularModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Index;