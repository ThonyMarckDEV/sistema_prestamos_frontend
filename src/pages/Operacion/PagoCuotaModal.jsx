import React, { useState, useEffect } from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { BanknotesIcon, DevicePhoneMobileIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const PagoCuotaModal = ({ isOpen, onClose, cuota, onConfirm, loading }) => {
    const [metodo, setMetodo] = useState('EFECTIVO');
    const [recibido, setRecibido] = useState('');
    const [referencia, setReferencia] = useState('');
    
    // Cálculos matemáticos seguros
    const montoBase = parseFloat(cuota?.monto || 0);
    const mora = parseFloat(cuota?.mora || 0);
    const totalAPagar = (montoBase + mora).toFixed(2);
    const vuelto = recibido ? (parseFloat(recibido) - parseFloat(totalAPagar)).toFixed(2) : 0;

    // Resetear el modal cada vez que se abre
    useEffect(() => {
        if (isOpen) {
            setMetodo('EFECTIVO');
            setRecibido('');
            setReferencia('');
        }
    }, [isOpen]);

    // Autollenar el monto recibido si es Yape o Tarjeta (porque el pago es exacto)
    useEffect(() => {
        if (metodo !== 'EFECTIVO') {
            setRecibido(totalAPagar);
        } else {
            setRecibido('');
        }
    }, [metodo, totalAPagar]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({
            metodo_pago: metodo,
            monto_recibido: recibido,
            numero_operacion: referencia
        });
    };

    return (
        <ViewModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Cobro de Cuota N° ${cuota?.nro || ''}`}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Resumen de lo que se va a cobrar */}
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                    <p className="text-xs font-black text-red-500 uppercase tracking-widest">Total a Cobrar</p>
                    <h2 className="text-4xl font-black text-red-700 italic mt-1">S/ {totalAPagar}</h2>
                    {mora > 0 && (
                        <p className="text-[10px] text-red-500 font-bold mt-1">
                            (Incluye S/ {mora.toFixed(2)} de mora)
                        </p>
                    )}
                </div>

                {/* 2. Selector de Métodos de Pago */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Método de Pago</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['EFECTIVO', 'YAPE / PLIN', 'TARJETA'].map((m) => (
                            <button
                                key={m} 
                                type="button" 
                                onClick={() => setMetodo(m)}
                                className={`py-3 rounded-xl font-black text-[10px] flex flex-col items-center gap-2 border-2 transition-all ${
                                    metodo === m 
                                        ? 'border-slate-800 bg-slate-800 text-white shadow-md' 
                                        : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {m === 'EFECTIVO' && <BanknotesIcon className="w-6 h-6" />}
                                {m === 'YAPE / PLIN' && <DevicePhoneMobileIcon className="w-6 h-6" />}
                                {m === 'TARJETA' && <CreditCardIcon className="w-6 h-6" />}
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Inputs Dinámicos según el Método */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                    
                    {/* Input: Monto Recibido (Siempre visible, pero bloqueado si no es efectivo) */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Monto Recibido *</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            required 
                            min={totalAPagar}
                            value={recibido} 
                            onChange={e => setRecibido(e.target.value)}
                            disabled={metodo !== 'EFECTIVO'}
                            placeholder="Ej: 100.00"
                            className="w-full p-3 bg-white border border-slate-200 rounded-lg font-black text-lg text-slate-800 focus:ring-2 focus:ring-red-500 outline-none disabled:opacity-70 disabled:bg-slate-100"
                        />
                    </div>

                    {/* Vuelto (Si es Efectivo) o N° Operación (Si es Yape/Tarjeta) */}
                    {metodo === 'EFECTIVO' ? (
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vuelto a entregar</label>
                            <div className={`w-full p-3 border-2 rounded-lg font-black text-lg transition-colors ${
                                vuelto >= 0 && recibido !== '' 
                                    ? 'bg-green-50 border-green-200 text-green-700' 
                                    : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                                S/ {vuelto >= 0 && recibido !== '' ? vuelto : '0.00'}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">N° de Operación *</label>
                            <input 
                                type="text" 
                                required
                                value={referencia} 
                                onChange={e => setReferencia(e.target.value)}
                                placeholder="Ej: 00293848"
                                className="w-full p-3 bg-white border border-slate-200 rounded-lg font-bold text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>
                    )}
                </div>

                {/* 4. Botón de Confirmación */}
                <button 
                    type="submit" 
                    disabled={loading || (metodo === 'EFECTIVO' && (vuelto < 0 || recibido === ''))}
                    className="w-full bg-black text-white py-4 rounded-xl font-black uppercase text-sm shadow-xl shadow-slate-300 hover:bg-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Procesando...' : `Confirmar Pago - S/ ${totalAPagar}`}
                </button>
            </form>
        </ViewModal>
    );
};

export default PagoCuotaModal;