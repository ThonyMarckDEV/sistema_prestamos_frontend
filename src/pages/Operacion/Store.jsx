import React, { useState } from 'react';
import { useStore } from 'hooks/Operacion/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import PrestamoSearchSelect from 'components/Shared/Comboboxes/PrestamoSearchSelect';
import OperacionForm from 'components/Shared/Formularios/Operacion/OperacionForm';
import PagoCuotaModal from './PagoCuotaModal';
import DesembolsoModal from './DesembolsoModal';
import AbrirSesionModal from 'components/Shared/Modals/AbrirSesionModal';
import CerrarSesionModal from 'components/Shared/Modals/CerrarSesionModal';
import PdfModal from 'components/Shared/Modals/PdfModal';
import HistorialMoraModal from 'components/Shared/Modals/HistorialMoraModal';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import {
    CurrencyDollarIcon,
    LockClosedIcon,
    LockOpenIcon,
    BanknotesIcon,
    ArrowUpCircleIcon,
    ArrowDownCircleIcon,
} from '@heroicons/react/24/outline';

const Store = () => {
    const {
        loading, sesionActiva, alert, setAlert, tipoOperacion, setTipoOperacion,
        prestamoSeleccionado, handleSelectPrestamo, prestamoDetalle, handleDesembolsar,
        isPagoModalOpen, setIsPagoModalOpen, cuotaSeleccionada, openPagoModal, handleConfirmarPago,
        isAbrirModalOpen, setIsAbrirModalOpen, isCerrarModalOpen, setIsCerrarModalOpen,
        handleAbrirSesion, handleCerrarSesion, isPdfModalOpen, setIsPdfModalOpen, pdfTitle, pdfBase64,
    } = useStore();

    const [isDesembolsoModalOpen, setIsDesembolsoModalOpen] = useState(false);
    const [historialModal, setHistorialModal] = useState(null);

    if (loading && sesionActiva === undefined) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            <PageHeader title="Caja Operativa" icon={CurrencyDollarIcon} />
            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                details={alert?.details}
                onClose={() => setAlert(null)}
            />

            {/* ── Sesión cerrada ── */}
            {!sesionActiva && !loading ? (
                <div className="mt-10 bg-white p-12 rounded-[40px] border border-slate-100 shadow-2xl text-center max-w-xl mx-auto">
                    <div className="bg-brand-red-light w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 transform -rotate-6 shadow-inner">
                        <LockClosedIcon className="w-12 h-12 text-brand-red" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-3">Turno Cerrado</h2>
                    <p className="text-slate-500 text-sm font-medium mb-10 px-6 leading-relaxed">
                        Para registrar cobros de cuotas o autorizar desembolsos, es necesario que realices la apertura de tu turno físico.
                    </p>
                    <button
                        onClick={() => setIsAbrirModalOpen(true)}
                        className="bg-brand-red text-white px-12 py-4 rounded-2xl font-black uppercase text-xs shadow-xl shadow-brand-red/30 hover:bg-brand-red-dark transition-all active:scale-95 flex items-center gap-2 mx-auto"
                    >
                        <LockOpenIcon className="w-4 h-4" /> Aperturar Turno de Caja
                    </button>
                </div>
            ) : (
                <div className="mt-6 space-y-6 animate-in fade-in duration-500">

                    {/* ── Header cajero ── */}
                    <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900 p-6 md:p-8 rounded-[32px] shadow-2xl text-white gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl">
                                <BanknotesIcon className="w-8 h-8 text-green-400" />
                            </div>
                            <div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Cajero de Turno</span>
                                <span className="text-lg font-black">
                                    {sesionActiva?.usuario?.datos_empleado?.nombre_completo || 'Usuario del Sistema'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 w-full md:w-auto justify-between md:justify-start">
                            <div className="text-right">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Saldo en Efectivo</span>
                                <span className="text-3xl font-black text-green-400 tracking-tighter">
                                    S/ {parseFloat(sesionActiva?.saldo_esperado || 0).toFixed(2)}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCerrarModalOpen(true)}
                                className="bg-white/5 hover:bg-brand-red px-6 py-3 rounded-xl font-black uppercase text-[10px] transition-all border border-white/10 hover:border-brand-red active:scale-95"
                            >
                                Cerrar Turno
                            </button>
                        </div>
                    </div>

                    {/* ── Panel operación ── */}
                    <div className="bg-white p-4 md:p-8 rounded-[40px] border border-slate-100 shadow-sm">

                        {/* Toggle cobro / desembolso */}
                        <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-fit mx-auto border border-slate-200">
                            <button
                                onClick={() => { setTipoOperacion('cobro'); handleSelectPrestamo(null); }}
                                className={`flex-1 sm:px-10 py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${
                                    tipoOperacion === 'cobro'
                                        ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200'
                                        : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                <ArrowUpCircleIcon className="w-4 h-4" /> Cobrar Cuota
                            </button>
                            <button
                                onClick={() => { setTipoOperacion('desembolso'); handleSelectPrestamo(null); }}
                                className={`flex-1 sm:px-10 py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${
                                    tipoOperacion === 'desembolso'
                                        ? 'bg-white text-brand-red shadow-md ring-1 ring-brand-red/20'
                                        : 'text-slate-400 hover:text-brand-red'
                                }`}
                            >
                                <ArrowDownCircleIcon className="w-4 h-4" /> Desembolsar
                            </button>
                        </div>

                        {/* Buscador */}
                        <PrestamoSearchSelect
                            tipoOperacion={tipoOperacion}
                            onSelect={handleSelectPrestamo}
                            disabled={loading}
                        />

                        {/* Desembolso */}
                        {prestamoSeleccionado && tipoOperacion === 'desembolso' && (
                            <div className="mt-8 p-10 bg-brand-gold-light/30 rounded-[32px] border-2 border-dashed border-brand-gold/50 text-center animate-in zoom-in-95 duration-300">
                                <h4 className="font-black text-brand-gold-dark uppercase text-lg mb-1 tracking-tight">Autorizar Desembolso</h4>
                                <p className="text-xs font-bold text-brand-red uppercase tracking-widest">{prestamoSeleccionado.cliente}</p>
                                <div className="my-10">
                                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 tracking-[0.3em]">Importe Neto a Entregar</span>
                                    <h2 className="text-7xl font-black text-brand-red italic tracking-tighter">S/ {prestamoSeleccionado.monto}</h2>
                                </div>
                                <button
                                    onClick={() => setIsDesembolsoModalOpen(true)}
                                    disabled={loading}
                                    className="px-16 py-5 bg-brand-red text-white rounded-2xl font-black uppercase text-sm shadow-xl shadow-brand-red/30 hover:bg-brand-red-dark transition-all active:scale-95 flex items-center gap-3 mx-auto"
                                >
                                    {loading ? 'Procesando...' : 'Siguiente: Adjuntar Voucher'}
                                </button>
                            </div>
                        )}

                        {/* Cobro — OperacionForm */}
                        {prestamoSeleccionado && tipoOperacion === 'cobro' && prestamoDetalle && (
                            <OperacionForm
                                prestamoDetalle={prestamoDetalle}
                                loading={loading}
                                openPagoModal={openPagoModal}
                                onHistorialModal={setHistorialModal}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* ── Modales (Mantenemos los mismos, cambian en sus archivos) ── */}
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
            <AbrirSesionModal
                isOpen={isAbrirModalOpen}
                onClose={() => setIsAbrirModalOpen(false)}
                onConfirm={handleAbrirSesion}
                loading={loading}
            />
            <CerrarSesionModal
                isOpen={isCerrarModalOpen}
                onClose={() => setIsCerrarModalOpen(false)}
                onConfirm={handleCerrarSesion}
                sesionActiva={sesionActiva}
                loading={loading}
            />
            <PdfModal
                isOpen={isPdfModalOpen}
                onClose={() => setIsPdfModalOpen(false)}
                title={pdfTitle}
                base64={pdfBase64}
            />
            <HistorialMoraModal
                isOpen={!!historialModal}
                onClose={() => setHistorialModal(null)}
                data={historialModal}
            />
        </div>
    );
};

export default Store;