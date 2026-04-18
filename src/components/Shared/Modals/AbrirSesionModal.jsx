import React, { useState, useEffect } from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { BanknotesIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import CajaSearchSelect from 'components/Shared/Comboboxes/CajaSearchSelect';

const AbrirSesionModal = ({ isOpen, onClose, onConfirm, loading }) => {
    const [cajaId, setCajaId] = useState('');
    const [montoApertura, setMontoApertura] = useState('');
    const [observaciones, setObservaciones] = useState('');

    useEffect(() => {
        if (isOpen) {
            setCajaId('');
            setMontoApertura('');
            setObservaciones('');
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({
            caja_id: cajaId,
            monto_apertura: montoApertura || 0,
            observaciones: observaciones
        });
    };

    return (
        <ViewModal isOpen={isOpen} onClose={onClose} title="Aperturar Turno de Caja">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Seleccionar Caja Física *</label>
                    <CajaSearchSelect 
                        onSelect={(caja) => setCajaId(caja ? caja.id : '')}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Monto de Apertura (Sencillo) *</label>
                    <div className="relative">
                        <BanknotesIcon className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
                        <input 
                            type="number" 
                            step="0.01" 
                            min="0"
                            required
                            value={montoApertura} 
                            onChange={(e) => setMontoApertura(e.target.value)}
                            placeholder="Ej: 50.00"
                            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Notas de Apertura</label>
                    <div className="relative">
                        <ChatBubbleLeftEllipsisIcon className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
                        <textarea 
                            value={observaciones} 
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Ej: Se recibe con monedas de 1 y 5 soles..."
                            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all min-h-[80px]"
                            disabled={loading}
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading || !cajaId || montoApertura === ''}
                    className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase text-sm shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Procesando...' : 'Abrir Turno Ahora'}
                </button>
            </form>
        </ViewModal>
    );
};

export default AbrirSesionModal;