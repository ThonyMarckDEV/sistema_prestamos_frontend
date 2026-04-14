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

    // --- Definición de Columnas para el Cronograma ---
    const columns = useMemo(() => [
        { 
            header: 'N°', 
            render: (row) => <span className="font-bold text-slate-400">#{row.nro}</span> 
        },
        { 
            header: 'Vencimiento', 
            render: (row) => <span className="font-medium">{row.vencimiento}</span> 
        },
        { 
            header: 'Monto', 
            render: (row) => <span className="font-black text-slate-900 text-sm">S/ {row.monto}</span> 
        },
        { 
            header: 'Mora',
            render: (row) => (
                <span className={`font-black text-sm ${parseFloat(row.mora) > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                    {parseFloat(row.mora) > 0 ? `S/ ${row.mora}` : '—'}
                </span>
            )
        },
        { 
            header: 'Estado', 
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-[9px] font-black border ${
                    row.estado === 2 ? 'bg-green-100 text-green-700 border-green-200' : 
                    row.estado === 5 ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                }`}>
                    {row.estado === 2 ? 'PAGADO' : row.estado === 5 ? 'EN REVISIÓN' : 'PENDIENTE'}
                </span>
            )
        },
        { 
            header: 'Acción', 
            render: (row, _col, allRows) => {
                // Lógica de bloqueo: No puede pagar si hay una anterior que no esté PAGADA (estado 2)
                const hayAnteriorPendiente = allRows
                    .filter(r => r.nro < row.nro)
                    .some(r => r.estado !== 2);

                const bloqueada = row.estado !== 1 || hayAnteriorPendiente;

                if (row.estado === 2) return null;

                return (
                    <div className="flex justify-end">
                        <button 
                            onClick={() => { if (!bloqueada) { setCuotaParaPagar(row); setIsModalOpen(true); }}}
                            disabled={bloqueada}
                            title={hayAnteriorPendiente ? 'Paga la cuota anterior primero' : row.estado === 5 ? 'En revisión' : 'Pagar cuota'}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-wide transition-all duration-150 ${
                                row.estado === 5
                                    ? 'bg-blue-50 text-blue-600 border border-blue-200 cursor-not-allowed'
                                    : bloqueada
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-black text-white hover:scale-105 shadow-md active:scale-95'
                            }`}
                        >
                            {row.estado === 5 
                                ? <><span>⏳</span> En revisión</>
                                : hayAnteriorPendiente 
                                    ? <><span>🔒</span> Bloqueada</>
                                    : <><CloudArrowUpIcon className="w-3.5 h-3.5" /> Pagar Cuota</>
                            }
                        </button>
                    </div>
                );
            }
        }
    ], [setIsModalOpen, setCuotaParaPagar]);

    // Pantalla de carga inicial
    if (loading && misPrestamos.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
            {/* Cabecera Principal */}
            <PageHeader title="Mi Portal de Pagos" icon={CreditCardIcon} />
            
            {/* Alertas del Sistema */}
            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                onClose={() => setAlert(null)} 
            />

            <div className="space-y-6 mt-6">
                
                {/* --- 1. SELECCIÓN DE PRÉSTAMO --- */}
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

                {/* --- 2. CRONOGRAMA DE CUOTAS --- */}
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
                        
                        {/* Tabla estandarizada */}
                        <Table 
                            columns={columns} 
                            data={prestamoSeleccionado.cronograma || []} 
                            loading={loading} 
                        />
                    </div>
                )}
            </div>

            {/* --- 3. MODAL DE REPORTE (SPLIT SCREEN) --- */}
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