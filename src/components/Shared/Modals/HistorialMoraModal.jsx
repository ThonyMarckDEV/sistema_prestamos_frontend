import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const HistorialMoraModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
                <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Historial Mora - Cuota #{data.nro}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5">
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {data.historial.map((h, i) => (
                            <div key={i} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div>
                                    <p className="font-bold text-slate-700">{h.fecha}</p>
                                    <p className="text-[9px] font-black uppercase text-red-500 mt-0.5">{h.dias_atraso} días de atraso</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-red-600">+ S/ {parseFloat(h.monto_agregado).toFixed(2)}</p>
                                    <p className="text-[9px] font-bold text-slate-400">Escala: S/ {parseFloat(h.tarifa_total).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-500">Mora Total Generada</span>
                        <span className="text-lg font-black text-red-600">S/ {data.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistorialMoraModal;