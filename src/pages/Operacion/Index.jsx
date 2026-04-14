import React, { useMemo } from 'react';
import { useIndex } from 'hooks/Operacion/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PdfModal from 'components/Shared/Modals/PdfModal'; 
import { DocumentTextIcon, ArrowDownRightIcon, ArrowUpRightIcon, PrinterIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const {
        loading, operaciones, paginationInfo, filters, alert, setAlert,
        fetchOperaciones, handleFilterChange, handleFilterSubmit, handleFilterClear,
        handleViewPdf, isPdfModalOpen, setIsPdfModalOpen, pdfTitle, pdfBase64, pdfLoading
    } = useIndex();

    const columns = useMemo(() => [
        {
            header: 'Tipo de Operación',
            render: (row) => (
                <div className="flex items-center gap-3">
                    {row.categoria === 'desembolso' ? (
                        <div className="p-2 rounded-xl bg-blue-100 border border-blue-200">
                            <ArrowUpRightIcon className="w-5 h-5 text-blue-600" />
                        </div>
                    ) : (
                        <div className="p-2 rounded-xl bg-green-100 border border-green-200">
                            <ArrowDownRightIcon className="w-5 h-5 text-green-600" />
                        </div>
                    )}
                    <span className={`font-black text-xs uppercase tracking-wider ${row.categoria === 'desembolso' ? 'text-blue-700' : 'text-green-700'}`}>
                        {row.categoria === 'desembolso' ? 'DESEMBOLSO' : 'COBRO CUOTA'}
                    </span>
                </div>
            )
        },
        {
            header: 'Detalle y Código',
            render: (row) => (
                <div className="text-xs text-slate-600 font-medium">
                    <span className="block text-slate-800">{row.motivo}</span>
                </div>
            )
        },
        {
            header: 'Cajero',
            render: (row) => (
                <div className="text-xs text-slate-600 font-bold uppercase">
                    {row.cajero}
                </div>
            )
        },
        {
            header: 'Fecha y Hora',
            render: (row) => (
                <div className="text-xs font-bold text-slate-500">
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
                <div className={`text-sm font-black italic text-right ${row.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                    {row.tipo === 'ingreso' ? '+' : '-'} S/ {row.monto}
                </div>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-2 justify-end">
                    <button 
                        onClick={() => handleViewPdf(row.id)}
                        disabled={pdfLoading}
                        title="Ver Comprobante"
                        className="p-2 bg-slate-100 text-slate-500 hover:text-black hover:bg-slate-200 rounded-lg transition-all border border-slate-200 shadow-sm disabled:opacity-50"
                    >
                        <PrinterIcon className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ], [handleViewPdf, pdfLoading]);

    const filterConfig = [
        { 
            name: 'search', 
            type: 'text', 
            label: 'Buscar por Código (C001, D001) o Motivo', 
            colSpan: 'col-span-8' 
        },
        { 
            name: 'tipo', 
            type: 'select', 
            label: 'Filtrar Tipo', 
            colSpan: 'col-span-4', 
            options: [
                { value: '', label: 'Todas las Operaciones' }, 
                { value: 'desembolso', label: 'Solo Desembolsos' }, 
                { value: 'cobro', label: 'Solo Cobros' }
            ] 
        }
    ];

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            <PageHeader 
                title="Historial de Operaciones" 
                icon={DocumentTextIcon} 
                buttonText="Ir a Caja Operativa" 
                buttonLink="/operacion/caja" 
            />
            
            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                details={alert?.details}
                onClose={() => setAlert(null)} 
            />

            <Table
                columns={columns} 
                data={operaciones} 
                loading={loading}
                filterConfig={filterConfig} 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onFilterSubmit={handleFilterSubmit} 
                onFilterClear={handleFilterClear}
                pagination={{ ...paginationInfo, onPageChange: fetchOperaciones }}
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