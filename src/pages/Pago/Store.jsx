import React, { useMemo } from 'react';
import { useStore } from 'hooks/Pago/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import Table from 'components/Shared/Tables/Table';
import ReportarPagoModal from './ReportarPagoModal';
import { CreditCardIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const {
        loading, alert, setAlert,
        misPrestamos, prestamoSeleccionado, handleSelectPrestamo,
        isModalOpen, setIsModalOpen, cuotaParaPagar, setCuotaParaPagar,
        handleConfirmarPagoVirtual
    } = useStore();

    const columns = useMemo(() => [
        { 
            header: 'N°', 
            render: (row) => <span className="font-bold text-slate-400">#{row.nro}</span> 
        },
        { 
            header: 'Vencimiento', 
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-800">{row.vencimiento}</span>
                    {row.dias_atraso > 0 && (
                        <span className="text-[9px] font-black text-red-600 uppercase">
                            {row.dias_atraso} días atraso
                        </span>
                    )}
                </div>
            ) 
        },
        { 
            header: 'Cuota Base', 
            render: (row) => <span className="font-bold text-slate-500 text-xs">S/ {row.monto}</span> 
        },
        { 
            header: 'Gestión Mora',
            render: (row) => (
                <div className="flex flex-col">
                    <span className={`font-black text-xs ${parseFloat(row.mora_total) > 0 ? 'text-red-600' : 'text-slate-300'}`}>
                        {parseFloat(row.mora_total) > 0 ? `+ S/ ${row.mora_total}` : 'S/ 0.00'}
                    </span>
                    {parseFloat(row.mora_pagada) > 0 && (
                        <span className="text-[9px] font-bold text-green-600 italic">
                            Pagado: S/ {row.mora_pagada}
                        </span>
                    )}
                </div>
            )
        },
        { 
            header: 'Saldo a Pagar', // Cambiamos el nombre a algo directo
            render: (row) => {
                const pagoTotal = parseFloat(row.pago_realizado) || 0;
                const excedenteAnterior = parseFloat(row.excedente_anterior) || 0;
                const saldoPendiente = parseFloat(row.saldo_pendiente) || 0;
                const totalOriginal = parseFloat(row.total_con_mora) || 0;
                
                return (
                    <div className="flex flex-col min-w-[120px]">
                        {/* 1. EL MONTO FINAL (LO QUE IMPORTA) */}
                        <div className="flex items-baseline gap-1">
                            {saldoPendiente > 0 && totalOriginal > saldoPendiente && (
                                <span className="text-[15px] text-slate-700 line-through decoration-slate-300">
                                    S/ {totalOriginal.toFixed(2)}
                                </span>
                            )}
                            <span className={`text-lg font-black ${saldoPendiente > 0 ? 'text-slate-900' : 'text-green-600'}`}>
                                S/ {saldoPendiente.toFixed(2)}
                            </span>
                        </div>

                        {/* 2. EL DESGLOSE (SOLO SI HAY ALGO QUE MOSTRAR) */}
                        <div className="flex flex-wrap gap-1 mt-1">
                            {excedenteAnterior > 0 && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black bg-purple-50 text-purple-600 border border-purple-100 uppercase tracking-tighter">
                                    Saldo a favor: S/ {excedenteAnterior.toFixed(2)}
                                </span>
                            )}
                            
                            {pagoTotal > 0 && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-tighter">
                                    Abonado: S/ {pagoTotal.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                )
            }
        },
        { 
            header: 'Estado', 
            render: (row) => {
                const estadoMap = {
                    1: { text: 'PENDIENTE', style: 'bg-slate-100 text-slate-600 border-slate-200' },
                    2: { text: 'PAGADO', style: 'bg-green-100 text-green-700 border-green-200' },
                    3: { text: 'VENCE HOY', style: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                    4: { text: 'VENCIDA', style: 'bg-red-100 text-red-700 border-red-200' },
                    5: { text: 'EN REVISIÓN', style: 'bg-blue-100 text-blue-700 border-blue-200' },
                    6: { text: 'PAGO PARCIAL', style: 'bg-orange-100 text-orange-700 border-orange-200' }
                };
                const current = estadoMap[row.estado] || estadoMap[1];

                return (
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black border ${current.style}`}>
                        {current.text}
                    </span>
                );
            }
        },
        { 
            header: 'Acción', 
            render: (row, _col, allRows) => {
                const hayAnteriorPendiente = allRows
                    .filter(r => r.nro < row.nro)
                    .some(r => ![2].includes(r.estado)); 

                const esPagable = [1, 3, 4, 6].includes(row.estado);
                const bloqueada = !esPagable || hayAnteriorPendiente;

                if (row.estado === 2) return (
                    <div className="flex justify-end pr-2">
                        <span className="text-green-500">✓</span>
                    </div>
                ); 

                return (
                    <div className="flex justify-end">
                        <button 
                            onClick={() => { if (!bloqueada) { setCuotaParaPagar(row); setIsModalOpen(true); }}}
                            disabled={bloqueada}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-wide transition-all duration-150 ${
                                row.estado === 5
                                    ? 'bg-blue-50 text-blue-600 border border-blue-200 cursor-not-allowed'
                                    : bloqueada
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-black text-white hover:scale-105 shadow-md active:scale-95'
                            }`}
                        >
                            {row.estado === 5 
                                ? <><span>⏳</span> Revisando</>
                                : hayAnteriorPendiente 
                                    ? <><span>🔒</span> Bloqueada</>
                                    : <><CloudArrowUpIcon className="w-3.5 h-3.5" /> Pagar Ahora</>
                            }
                        </button>
                    </div>
                );
            }
        }
    ], [setIsModalOpen, setCuotaParaPagar]);

    if (loading && misPrestamos.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
            <PageHeader title="Mi Portal de Pagos" icon={CreditCardIcon} />
            
            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                details={alert?.details}
                onClose={() => setAlert(null)} 
            />

            <div className="space-y-6 mt-6">
                {/* 1. SELECCIÓN DE PRÉSTAMO */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
                        Selecciona un préstamo activo
                    </label>
                    <select 
                        onChange={(e) => handleSelectPrestamo(e.target.value)}
                        value={prestamoSeleccionado?.id || ''}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                        <option value="">-- Elige el préstamo que deseas pagar --</option>
                        {misPrestamos.map(p => (
                            <option key={p.id} value={p.id}>
                                Préstamo #{p.id} - Monto: S/ {p.monto} (Inicia: {p.fecha_desembolso || p.fecha_inicio})
                            </option>
                        ))}
                    </select>
                </div>

                {/* 2. CRONOGRAMA DE CUOTAS */}
                {prestamoSeleccionado && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-3 flex justify-between items-center px-2">
                             <h3 className="font-black text-slate-800 uppercase text-xs tracking-tight">Mi Cronograma de Pagos</h3>
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                                    ID PRÉSTAMO: {prestamoSeleccionado.id}
                                </span>
                             </div>
                        </div>
                        
                        <Table 
                            columns={columns} 
                            data={prestamoSeleccionado.cronograma || []} 
                            loading={loading} 
                        />
                    </div>
                )}
            </div>

            {/* 3. MODAL DE REPORTE */}
            <ReportarPagoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cuota={cuotaParaPagar}
                onConfirm={handleConfirmarPagoVirtual}
                loading={loading}
            />
        </div>
    );
};

export default Store;