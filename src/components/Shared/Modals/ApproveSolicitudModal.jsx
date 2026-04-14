import React, { useState } from 'react';
import { BanknotesIcon, BuildingLibraryIcon, CheckBadgeIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ApproveSolicitudModal = ({ isOpen, onClose, onConfirm, solicitud, loading }) => {
    const [abonadoPor, setAbonadoPor] = useState('CAJA CHICA');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] overflow-y-auto">
            {/* Overlay oscuro */}
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Contenido del Modal */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 opacity-100">
                    
                    {/* Botón cerrar */}
                    <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 z-10">
                        <XMarkIcon className="w-6 h-6" />
                    </button>

                    {/* Header */}
                    <div className="p-6 text-center border-b border-slate-50 bg-slate-50/50">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <CheckBadgeIcon className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 uppercase">Aprobar Préstamo</h3>
                        <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-tight">
                            Cliente: <span className="text-red-600">{solicitud?.cliente_nombre}</span>
                        </p>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-6">
                            ¿De dónde sale el dinero?
                        </label>
                        
                        <div className="grid grid-cols-1 gap-3">
                            <button 
                                onClick={() => setAbonadoPor('CAJA CHICA')}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                                    abonadoPor === 'CAJA CHICA' ? 'border-green-600 bg-green-50 shadow-inner' : 'border-slate-100 hover:border-slate-200'
                                }`}
                            >
                                <BanknotesIcon className={`w-8 h-8 ${abonadoPor === 'CAJA CHICA' ? 'text-green-600' : 'text-slate-400'}`} />
                                <div className="text-left">
                                    <p className="font-black text-slate-800 text-sm uppercase">Caja Chica</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Efectivo en Oficina</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => setAbonadoPor('CUENTA CORRIENTE')}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                                    abonadoPor === 'CUENTA CORRIENTE' ? 'border-blue-600 bg-blue-50 shadow-inner' : 'border-slate-100 hover:border-slate-200'
                                }`}
                            >
                                <BuildingLibraryIcon className={`w-8 h-8 ${abonadoPor === 'CUENTA CORRIENTE' ? 'text-blue-600' : 'text-slate-400'}`} />
                                <div className="text-left">
                                    <p className="font-black text-slate-800 text-sm uppercase">Cta. Corriente</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Transferencia Bancaria</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-slate-50 flex gap-3">
                        <button onClick={onClose} className="flex-1 px-4 py-3 text-xs font-black text-slate-400 uppercase hover:text-slate-600 transition-colors">
                            Cancelar
                        </button>
                        <button 
                            disabled={loading}
                            onClick={() => onConfirm(solicitud.id, 2, abonadoPor)}
                            className="flex-[2] bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-xs shadow-xl hover:bg-black transition-all disabled:opacity-50 active:scale-95"
                        >
                            {loading ? 'Procesando...' : 'Confirmar Desembolso'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApproveSolicitudModal;