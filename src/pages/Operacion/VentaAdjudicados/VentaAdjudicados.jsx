import React from 'react';
import { useVentaAdjudicados } from 'hooks/Operacion/useVentaAdjudicados';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoteCard from './components/LoteCard';
import LoteDetalleModal from './components/LoteDetalleModal';
import CarritoSidebar from './components/CarritoSidebar';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';

const VentaAdjudicados = () => {
    const {
        lotes, loading, alert, setAlert,
        loteDetalle, loadingDetalle, modalLoteOpen, abrirDetalleLote, cerrarDetalleLote,
        carrito, enCarrito, agregarAlCarrito, quitarDelCarrito, totalCarrito,
        clienteGenerico, setClienteGenerico, clienteNombre, setClienteNombre,
        metodoPago, setMetodoPago,
        procesarVenta,
    } = useVentaAdjudicados();

    return (
        <div className="mt-6 animate-in fade-in duration-300">
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Grilla de lotes (estilo minimarket) ── */}
                <div className="lg:col-span-2">
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-4 border-brand-red/20 dark:border-brand-gold/20 border-t-brand-red dark:border-t-brand-gold rounded-full animate-spin" />
                        </div>
                    )}

                    {!loading && lotes.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <ArchiveBoxIcon className="w-10 h-10 text-slate-300 dark:text-dark-text-muted/50 mb-3" />
                            <p className="text-sm font-black text-slate-400 dark:text-dark-text-muted uppercase">No hay lotes adjudicados disponibles</p>
                        </div>
                    )}

                    {!loading && lotes.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                            {lotes.map(lote => (
                                <LoteCard
                                    key={lote.lote}
                                    lote={lote}
                                    enCarrito={enCarrito(lote.lote)}
                                    onVerDetalle={abrirDetalleLote}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Carrito ── */}
                <div className="lg:col-span-1">
                    <CarritoSidebar
                        carrito={carrito}
                        quitarDelCarrito={quitarDelCarrito}
                        totalCarrito={totalCarrito}
                        clienteGenerico={clienteGenerico}
                        setClienteGenerico={setClienteGenerico}
                        clienteNombre={clienteNombre}
                        setClienteNombre={setClienteNombre}
                        metodoPago={metodoPago}
                        setMetodoPago={setMetodoPago}
                        onProcesar={procesarVenta}
                    />
                </div>
            </div>

            <LoteDetalleModal
                isOpen={modalLoteOpen}
                onClose={cerrarDetalleLote}
                loading={loadingDetalle}
                lote={loteDetalle}
                enCarrito={loteDetalle ? enCarrito(loteDetalle.lote) : false}
                onAgregarCarrito={agregarAlCarrito}
            />
        </div>
    );
};

export default VentaAdjudicados;