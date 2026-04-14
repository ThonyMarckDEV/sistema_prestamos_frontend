import React, { useMemo } from 'react';
import { useIndex } from 'hooks/Pago/useIndex';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { EyeIcon, CheckIcon, XMarkIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const { loading, pagos, paginationInfo, filters, setFilters, alert, setAlert, fetchPagos, handleStatusChange } = useIndex();

    const columns = useMemo(() => [
        {
            header: 'Cliente / Cuota',
            render: (row) => (
                <div className="text-xs uppercase">
                    <p className="font-black text-slate-800">{row.cuota?.prestamo?.cliente?.datos_cliente?.nombre} {row.cuota?.prestamo?.cliente?.datos_cliente?.apellidoPaterno}</p>
                    <p className="text-slate-500 font-bold">Cuota #{row.cuota?.numero_cuota} - Prest. #{row.cuota?.prestamo_id}</p>
                </div>
            )
        },
        {
            header: 'Monto',
            render: (row) => <span className="font-black text-sm">S/ {row.monto_pagado}</span>
        },
        {
            header: 'Operación',
            render: (row) => <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs font-bold">{row.numero_operacion}</span>
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex gap-2 justify-end">
                    <button onClick={() => window.open(row.comprobante_url, '_blank')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                        <EyeIcon className="w-5 h-5" />
                    </button>
                    {row.estado === 0 && (
                        <>
                            <button onClick={() => handleStatusChange(row.id, 1)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all">
                                <CheckIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => {
                                const m = prompt("Motivo del rechazo:");
                                if(m) handleStatusChange(row.id, 2, m);
                            }} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ], [handleStatusChange]);

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Revisión de Pagos Virtuales" icon={BanknotesIcon} />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            <Table 
                columns={columns} data={pagos} loading={loading}
                filters={filters} onFilterChange={(n,v) => setFilters(p => ({...p, [n]:v}))}
                onFilterSubmit={() => fetchPagos(1)}
                pagination={{...paginationInfo, onPageChange: fetchPagos}}
            />
        </div>
    );
};

export default Index;