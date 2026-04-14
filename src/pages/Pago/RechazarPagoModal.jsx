import React, { useState, useEffect } from 'react';
import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const RechazarPagoModal = ({ isOpen, onClose, onConfirm, loading }) => {
    const [motivo, setMotivo] = useState('');

    // Limpiar el campo cuando se cierra/abre
    useEffect(() => {
        if (isOpen) setMotivo('');
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!motivo.trim()) return;
        onConfirm(motivo);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                onClick={!loading ? onClose : null}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 border border-slate-100">
                
                <div className="p-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-5">
                        <XCircleIcon className="h-8 w-8 text-red-600" aria-hidden="true" />
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                            Rechazar Pago
                        </h3>
                        <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
                            Indica el motivo por el cual el comprobante no es válido. Este mensaje le llegará al cliente.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6">
                        <textarea
                            required
                            rows="3"
                            className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-red-500 focus:bg-white transition-all resize-none"
                            placeholder="Ej: Monto incorrecto, imagen borrosa..."
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            disabled={loading}
                        />

                        <div className="mt-6 flex flex-col-reverse sm:flex-row justify-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="w-full px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all uppercase tracking-wide"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !motivo.trim()}
                                className="w-full inline-flex justify-center rounded-xl bg-red-600 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all active:scale-95 uppercase tracking-wide disabled:opacity-50 disabled:scale-100"
                            >
                                {loading ? 'Procesando...' : 'Confirmar Rechazo'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RechazarPagoModal;