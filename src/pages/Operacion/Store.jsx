import React, { useMemo, useState } from 'react';
import { useStore } from 'hooks/Operacion/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import PrestamoSearchSelect from 'components/Shared/Comboboxes/PrestamoSearchSelect';
import PagoCuotaModal from './PagoCuotaModal'; 
import DesembolsoModal from './DesembolsoModal';
import AbrirSesionModal from 'components/Shared/Modals/AbrirSesionModal';
import CerrarSesionModal from 'components/Shared/Modals/CerrarSesionModal';
import PdfModal from 'components/Shared/Modals/PdfModal'; 
import HistorialMoraModal from 'components/Shared/Modals/HistorialMoraModal'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import Table from 'components/Shared/Tables/Table';
import { 
    CurrencyDollarIcon, 
    LockClosedIcon, 
    LockOpenIcon, 
    BanknotesIcon, 
    ArrowUpCircleIcon, 
    ArrowDownCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const Store = () => {
    const { 
        loading, sesionActiva, alert, setAlert, tipoOperacion, setTipoOperacion,
        prestamoSeleccionado, handleSelectPrestamo, prestamoDetalle, handleDesembolsar,
        isPagoModalOpen, setIsPagoModalOpen, cuotaSeleccionada, openPagoModal, handleConfirmarPago,
        isAbrirModalOpen, setIsAbrirModalOpen, isCerrarModalOpen, setIsCerrarModalOpen,
        handleAbrirSesion, handleCerrarSesion, isPdfModalOpen, setIsPdfModalOpen, pdfTitle, pdfBase64 
    } = useStore();

    const [isDesembolsoModalOpen, setIsDesembolsoModalOpen] = useState(false);
    const [historialModal, setHistorialModal] = useState(null);

    const columns = useMemo(() => [
        { 
            header: 'N°', 
            render: (row) => <span className="font-black text-slate-400">#{row.nro}</span> 
        },
        { 
            header: 'Vencimiento', 
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{row.vencimiento}</span>
                    {row.dias_atraso > 0 && (
                        <span className="text-[9px] font-black text-red-600 uppercase">
                            {row.dias_atraso} días atraso
                        </span>
                    )}
                </div>
            ) 
        },
        { 
            header: 'Monto Cuota', 
            render: (row) => <span className="font-bold text-slate-500 text-xs">S/ {row.monto}</span> 
        },
        { 
            header: 'Mora Gen.',
            render: (row) => {
                const moraTotal     = parseFloat(row.mora_total || row.mora || 0);
                const moraPagada    = parseFloat(row.mora_pagada || 0);
                const moraPendiente = moraTotal - moraPagada;

                if (moraTotal <= 0) return <span className="text-slate-300 font-black text-xs">—</span>;

                return (
                    <div className="flex flex-col">
                        {moraPendiente > 0 ? (
                            <span className="font-black text-xs text-red-600">+ S/ {moraPendiente.toFixed(2)}</span>
                        ) : (
                            <span className="font-black text-xs text-red-600 line-through">S/ {moraTotal.toFixed(2)}</span>
                        )}
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] font-bold ${moraPendiente === 0 ? 'text-green-600' : 'text-slate-400'}`}>
                                {moraPendiente === 0 ? '✓ Cubierta' : `De S/ ${moraTotal.toFixed(2)}`}
                            </span>
                            
                            {row.historial_mora && row.historial_mora.length > 0 && (
                                <button
                                    onClick={() => setHistorialModal({ nro: row.nro, historial: row.historial_mora, total: moraTotal })}
                                    className="text-slate-400 hover:text-blue-500 transition-all p-0.5 rounded-full hover:bg-blue-50 active:scale-95"
                                    title="Ver historial de mora"
                                >
                                    <ClockIcon className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                );
            }
        },
        { 
            header: 'Saldo a Cobrar', 
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-sm">
                        S/ {parseFloat(row.saldo_pendiente).toFixed(2)}
                    </span>
                    {parseFloat(row.pago_realizado || 0) > 0 && (
                        <span className="text-[9px] font-bold text-blue-500 uppercase">
                            Recibido: S/ {parseFloat(row.pago_realizado).toFixed(2)}
                        </span>
                    )}
                    {parseFloat(row.pago_acumulado || 0) > 0 && (
                        <span className="text-[9px] font-bold text-green-700 uppercase">
                            Acumulado: S/ {parseFloat(row.pago_acumulado).toFixed(2)}
                        </span>
                    )}
                    {parseFloat(row.mora_pagada || 0) > 0 && (
                        <span className="text-[9px] font-bold text-yellow-600 uppercase">
                            Mora Cubierta: S/ {parseFloat(row.mora_pagada).toFixed(2)}
                        </span>
                    )}
                    {parseFloat(row.excedente_consumido || 0) > 0 && (
                        <span className="text-[9px] font-bold text-purple-600 uppercase">
                            Excedente. usado: -S/ {parseFloat(row.excedente_consumido).toFixed(2)}
                        </span>
                    )}
                    {parseFloat(row.excedente_consumido || 0) === 0 && parseFloat(row.excedente_anterior || 0) > 0 && (
                        <span className="text-[9px] font-bold text-purple-600 uppercase">
                            Excedente. aplicado: -S/ {parseFloat(row.excedente_anterior).toFixed(2)}
                        </span>
                    )}
                    {parseFloat(row.excedente_generado || 0) > 0 && (
                        <span className="text-[9px] font-bold text-orange-500 uppercase">
                            Excedente: S/ {parseFloat(row.excedente_generado).toFixed(2)}
                        </span>
                    )}
                </div>
            )
        },
        { 
            header: 'Estado', 
            render: (row) => {
                const estadoMap = {
                    1: { text: 'PENDIENTE',    style: 'bg-slate-100 text-slate-600 border-slate-200' },
                    2: { text: 'PAGADO',       style: 'bg-green-100 text-green-700 border-green-200' },
                    3: { text: 'VENCE HOY',    style: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                    4: { text: 'VENCIDA',      style: 'bg-red-100 text-red-700 border-red-200' },
                    5: { text: 'PAGO PARCIAL', style: 'bg-blue-100 text-blue-700 border-blue-200' }
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
                    .some(r => r.estado !== 2);

                const esPagable = [1, 3, 4, 5].includes(row.estado);
                const bloqueada = !esPagable || hayAnteriorPendiente;

                if (row.estado === 2) return (
                    <span className="text-[10px] font-black text-green-600 uppercase italic">✓ Cobrado</span>
                );

                return (
                    <div className="flex justify-end">
                        <button 
                            onClick={() => !bloqueada && openPagoModal(row)} 
                            disabled={bloqueada}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${
                                bloqueada
                                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                                    : 'bg-slate-900 text-white hover:bg-black shadow-lg active:scale-95'
                            }`}
                        >
                            {hayAnteriorPendiente ? '🔒 Bloqueada' : <><BanknotesIcon className="w-3.5 h-3.5" /> Cobrar</>}
                        </button>
                    </div>
                );
            }
        }
    ], [openPagoModal]);

    if (loading && sesionActiva === undefined) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
            <PageHeader title="Caja Operativa" icon={CurrencyDollarIcon} />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            {!sesionActiva && !loading ? (
                <div className="mt-10 bg-white p-12 rounded-[40px] border border-slate-100 shadow-2xl text-center max-w-xl mx-auto">
                    <div className="bg-red-50 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 transform -rotate-6 shadow-inner">
                        <LockClosedIcon className="w-12 h-12 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-3">Turno Cerrado</h2>
                    <p className="text-slate-500 text-sm font-medium mb-10 px-6 leading-relaxed">
                        Para registrar cobros de cuotas o autorizar desembolsos, es necesario que realices la apertura de tu turno físico.
                    </p>
                    <button onClick={() => setIsAbrirModalOpen(true)} className="bg-red-600 text-white px-12 py-4 rounded-2xl font-black uppercase text-xs shadow-xl shadow-red-200 hover:bg-red-700 transition-all active:scale-95 flex items-center gap-2 mx-auto">
                        <LockOpenIcon className="w-4 h-4" /> Aperturar Turno de Caja
                    </button>
                </div>
            ) : (
                <div className="mt-6 space-y-6 animate-in fade-in duration-500">
                    {/* (Cabecera y Botones de acción igual que antes) */}
                    <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900 p-6 md:p-8 rounded-[32px] shadow-2xl text-white gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl">
                                <BanknotesIcon className="w-8 h-8 text-green-400" />
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Cajero de Turno</span>
                                <span className="text-lg font-black">{sesionActiva?.usuario?.datos_empleado?.nombre_completo || 'Usuario del Sistema'}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 w-full md:w-auto justify-between md:justify-start">
                            <div className="text-right">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Saldo en Efectivo</span>
                                <span className="text-3xl font-black text-green-400 tracking-tighter">S/ {parseFloat(sesionActiva?.saldo_esperado || 0).toFixed(2)}</span>
                            </div>
                            <button onClick={() => setIsCerrarModalOpen(true)} className="bg-white/5 hover:bg-red-600 px-6 py-3 rounded-xl font-black uppercase text-[10px] transition-all border border-white/10 hover:border-red-500 active:scale-95">Cerrar Turno</button>
                        </div>
                    </div>

                    <div className="bg-white p-4 md:p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-fit mx-auto border border-slate-200">
                            <button 
                                onClick={() => { setTipoOperacion('cobro'); handleSelectPrestamo(null); }} 
                                className={`flex-1 sm:px-10 py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${tipoOperacion === 'cobro' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <ArrowUpCircleIcon className="w-4 h-4" /> Cobrar Cuota
                            </button>
                            <button 
                                onClick={() => { setTipoOperacion('desembolso'); handleSelectPrestamo(null); }} 
                                className={`flex-1 sm:px-10 py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${tipoOperacion === 'desembolso' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <ArrowDownCircleIcon className="w-4 h-4" /> Desembolsar
                            </button>
                        </div>

                        <PrestamoSearchSelect tipoOperacion={tipoOperacion} onSelect={handleSelectPrestamo} disabled={loading} />

                        {prestamoSeleccionado && tipoOperacion === 'desembolso' && (
                            <div className="mt-8 p-10 bg-blue-50/50 rounded-[32px] border-2 border-dashed border-blue-200 text-center animate-in zoom-in-95 duration-300">
                                <h4 className="font-black text-blue-900 uppercase text-lg mb-1 tracking-tight">Autorizar Desembolso</h4>
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">{prestamoSeleccionado.cliente}</p>
                                <div className="my-10">
                                    <span className="text-[10px] font-black text-blue-400 uppercase block mb-2 tracking-[0.3em]">Importe Neto a Entregar</span>
                                    <h2 className="text-7xl font-black text-blue-600 italic tracking-tighter">S/ {prestamoSeleccionado.monto}</h2>
                                </div>
                                <button 
                                    onClick={() => setIsDesembolsoModalOpen(true)} 
                                    disabled={loading} 
                                    className="px-16 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-sm shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3 mx-auto"
                                >
                                    {loading ? 'Procesando...' : 'Siguiente: Adjuntar Voucher'}
                                </button>
                            </div>
                        )}

                        {prestamoSeleccionado && tipoOperacion === 'cobro' && prestamoDetalle && (
                            <div className="mt-10 animate-in slide-in-from-bottom-6 duration-500">
                                <div className="flex items-center justify-between mb-6 px-4">
                                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">Cronograma de Pagos</h4>
                                </div>
                                <Table columns={columns} data={prestamoDetalle.cronograma || []} loading={loading} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <PagoCuotaModal 
                isOpen={isPagoModalOpen} 
                onClose={() => setIsPagoModalOpen(false)} 
                cuota={cuotaSeleccionada} 
                onConfirm={handleConfirmarPago} 
                loading={loading} 
            />

            <DesembolsoModal 
                isOpen={isDesembolsoModalOpen} 
                onClose={() => setIsDesembolsoModalOpen(false)} 
                prestamo={prestamoSeleccionado}
                onConfirm={async (fd) => {
                    await handleDesembolsar(fd);
                    setIsDesembolsoModalOpen(false);
                }}
                loading={loading}
            />

            <AbrirSesionModal isOpen={isAbrirModalOpen} onClose={() => setIsAbrirModalOpen(false)} onConfirm={handleAbrirSesion} loading={loading} />
            <CerrarSesionModal isOpen={isCerrarModalOpen} onClose={() => setIsCerrarModalOpen(false)} onConfirm={handleCerrarSesion} sesionActiva={sesionActiva} loading={loading} />
            <PdfModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} title={pdfTitle} base64={pdfBase64} />
                
            <HistorialMoraModal 
                isOpen={!!historialModal} 
                onClose={() => setHistorialModal(null)} 
                data={historialModal} 
            />
        </div>
    );
};

export default Store;