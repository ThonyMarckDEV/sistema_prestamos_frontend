import React, { useMemo } from 'react';
import { useIndex } from 'hooks/Prestamo/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { BanknotesIcon, EyeIcon } from '@heroicons/react/24/outline';
import ViewPrestamoModal from './ViewPrestamoModal';

const Index = () => {
    const {
        loading, prestamos, paginationInfo, filters, alert, setAlert,
        handleFilterChange, handleFilterSubmit, handleFilterClear, fetchPrestamos,
        handleView, isViewOpen, setIsViewOpen, viewData, viewLoading
    } = useIndex();

    const filterConfig = useMemo(() => [
        { name: 'search', type: 'text', label: 'Buscar Cliente / DNI', placeholder: 'Ej: Mendoza...', colSpan: 'col-span-12 md:col-span-8' },
        { 
            name: 'estado', type: 'select', label: 'Estado Préstamo', colSpan: 'col-span-12 md:col-span-4',
            options: [
                { value: '1', label: 'VIGENTES' },
                { value: '2', label: 'CANCELADOS' },
                { value: '3', label: 'LIQUIDADOS' },
                { value: 'all', label: 'TODOS' }
            ]
        }
    ], []);

    const columns = useMemo(() => [
        { header: 'Cliente / Producto', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-xs uppercase">{row.cliente}</span>
                <span className="text-[10px] text-blue-600 font-black uppercase">{row.producto}</span>
            </div>
        )},
        { header: 'Financiero', render: (row) => (
            <div className="flex flex-col">
                <span className="font-black text-red-600 italic">S/ {row.monto}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total: S/ {row.total_pagar}</span>
            </div>
        )},
        { header: 'Progreso Cuotas', render: (row) => (
            <div className="flex flex-col">
                <span className="text-xs font-black text-slate-700">{row.cuotas_detalle}</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">{row.frecuencia} - S/ {row.valor_cuota} c/u</span>
            </div>
        )},
        { header: 'Estado', render: (row) => {
            const colors = { 1: 'bg-green-100 text-green-700 border-green-200', 2: 'bg-slate-100 text-slate-600 border-slate-200', 3: 'bg-blue-100 text-blue-700 border-blue-200' };
            const labels = { 1: 'VIGENTE', 2: 'CANCELADO', 3: 'LIQUIDADO' };
            return <span className={`px-2 py-1 rounded-full text-[9px] font-black border ${colors[row.estado]}`}>{labels[row.estado]}</span>
        }},
        { header: 'Acciones', render: (row) => (
            <div className="flex gap-2">
                <button onClick={() => handleView(row.id)} title="Ver Cronograma" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 transition-all">
                    <EyeIcon className="w-4 h-4" />
                </button>
            </div>
        )}
    ], [handleView]);

    if (loading && prestamos.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Cartera de Préstamos" icon={BanknotesIcon} />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={prestamos} 
                loading={loading} 
                pagination={{ ...paginationInfo, onPageChange: fetchPrestamos }} 
                onFilterChange={handleFilterChange} 
                onFilterSubmit={handleFilterSubmit} 
                onFilterClear={handleFilterClear} 
                filters={filters} 
                filterConfig={filterConfig}
            />

            <ViewPrestamoModal  
                isOpen={isViewOpen} 
                onClose={() => setIsViewOpen(false)} 
                data={viewData} 
                isLoading={viewLoading} 
            />
        </div>
    );
};

export default Index;