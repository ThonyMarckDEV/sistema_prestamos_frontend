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
                header: 'Tipo de Operación',
                render: (row) => (
                    <div className={`flex items-center gap-3 ${row.estado === 0 ? 'opacity-50' : ''}`}>
                        {row.categoria === 'desembolso' ? (
                            <div className={`p-2 rounded-xl border ${row.estado === 0 ? 'bg-slate-100 border-slate-300' : 'bg-blue-100 border-blue-200'}`}>
                                <ArrowUpRightIcon className={`w-5 h-5 ${row.estado === 0 ? 'text-slate-500' : 'text-blue-600'}`} />
                            </div>
                        ) : (
                            <div className={`p-2 rounded-xl border ${row.estado === 0 ? 'bg-slate-100 border-slate-300' : 'bg-green-100 border-green-200'}`}>
                                <ArrowDownRightIcon className={`w-5 h-5 ${row.estado === 0 ? 'text-slate-500' : 'text-green-600'}`} />
                            </div>
                        )}
                        <span className={`font-black text-xs uppercase tracking-wider ${row.estado === 0 ? 'text-slate-500 line-through' : (row.categoria === 'desembolso' ? 'text-blue-700' : 'text-green-700')}`}>
                            {row.categoria === 'desembolso' ? 'DESEMBOLSO' : 'COBRO CUOTA'}
                        </span>
                    </div>
                )
            },
            {
                header: 'Detalle y Código',
                render: (row) => (
                    <div className="text-xs font-medium">
                        <span className={`block ${row.estado === 0 ? 'text-red-500 line-through' : 'text-slate-800'}`}>
                            {row.motivo}
                        </span>
                        {row.estado === 0 && <span className="text-[10px] text-red-600 font-bold uppercase mt-1 block">Anulado</span>}
                    </div>
                )
            },
            {
                header: 'Cajero',
                render: (row) => (
                    <div className={`text-xs font-bold uppercase ${row.estado === 0 ? 'text-slate-400' : 'text-slate-600'}`}>
                        {row.cajero}
                    </div>
                )
            },
            {
                header: 'Fecha y Hora',
                render: (row) => (
                    <div className={`text-xs font-bold ${row.estado === 0 ? 'text-slate-400' : 'text-slate-500'}`}>
                        {new Date(row.fecha).toLocaleString('es-PE', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit', hour12: true
                        })}
                    </div>
                )
            },
            {
                header: 'Monto',
                render: (row) => (
                    <div className={`text-sm font-black italic text-right ${row.estado === 0 ? 'text-slate-400 line-through' : (row.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600')}`}>
                        {row.tipo === 'ingreso' ? '+' : '-'} S/ {row.monto}
                    </div>
                )
            }
        ];

        // 3. Agregamos la columna de Acciones SOLO si tiene algún permiso
        if (canGeneratePdf || canDelete) {
            baseColumns.push({
                header: 'Acciones',
                render: (row) => (
                    <div className="flex items-center gap-2 justify-end">
                        
                        {/* Botón Ver Comprobante */}
                        {canGeneratePdf && (
                            <button 
                                onClick={() => handleViewPdf(row.id)}
                                disabled={pdfLoading || row.estado === 0}
                                title="Ver Comprobante"
                                className={`p-2 rounded-lg transition-all border shadow-sm ${row.estado === 0 ? 'bg-slate-50 text-slate-300 border-transparent cursor-not-allowed' : 'bg-slate-100 text-slate-500 hover:text-black hover:bg-slate-200 border-slate-200'}`}
                            >
                                <PrinterIcon className="w-5 h-5" />
                            </button>
                        )}

                        {/* Botón Anular */}
                        {canDelete && row.estado !== 0 && (
                            <button 
                                onClick={() => openAnularModal(row.id)}
                                title="Anular Operación"
                                className="p-2 bg-red-50 text-red-500 hover:text-white hover:bg-red-600 rounded-lg transition-all border border-red-100 shadow-sm"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )
            });
        }

        return baseColumns;
    }, [handleViewPdf, openAnularModal, pdfLoading, canGeneratePdf, canDelete]);

    const filterConfig = [
        { name: 'search', type: 'text', label: 'Buscar por Código (C001, D001) o Motivo', colSpan: 'col-span-8' },
        { name: 'tipo', type: 'select', label: 'Filtrar Tipo', colSpan: 'col-span-4', options: [
            { value: '', label: 'Todas las Operaciones' }, 
            { value: 'desembolso', label: 'Solo Desembolsos' }, 
            { value: 'cobro', label: 'Solo Cobros' }
        ]}
    ];

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            <PageHeader 
                title="Historial de Operaciones" 
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

            {/* Modal para Ver PDF */}
            <PdfModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} title={pdfTitle} base64={pdfBase64} />

            {/* Modal para Anular */}
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