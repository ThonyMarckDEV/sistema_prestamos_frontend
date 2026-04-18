import React, { useState, useEffect } from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { BanknotesIcon, DevicePhoneMobileIcon, PhotoIcon } from '@heroicons/react/24/outline';

const PagoCuotaModal = ({ isOpen, onClose, cuota, onConfirm, loading }) => {
    const [metodo, setMetodo] = useState('DEPOSITO');
    const [recibido, setRecibido] = useState('');
    const [referencia, setReferencia] = useState('');
    const [archivo, setArchivo] = useState(null);
    
    const montoBase = parseFloat(cuota?.monto || 0);
    const mora = parseFloat(cuota?.mora || 0);
    const totalAPagar = (montoBase + mora).toFixed(2);

    useEffect(() => {
        if (isOpen) {
            setMetodo('DEPOSITO');
            setRecibido(totalAPagar);
            setReferencia('');
            setArchivo(null);
        }
    }, [isOpen, totalAPagar]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('cuota_id', cuota.id);
        formData.append('metodo_pago', metodo);
        formData.append('monto_recibido', recibido);
        formData.append('numero_operacion', referencia);
        if (archivo) formData.append('comprobante', archivo);

        onConfirm(formData);
    };

    return (
        <ViewModal isOpen={isOpen} onClose={onClose} title={`Cobrar Cuota N° ${cuota?.nro}`}>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-slate-900 p-6 rounded-2xl text-center text-white">
                    <p className="text-[10px] font-black uppercase opacity-60">Total Deuda</p>
                    <h2 className="text-3xl font-black">S/ {totalAPagar}</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {['DEPOSITO', 'EFECTIVO'].map((m) => (
                        <button key={m} type="button" onClick={() => setMetodo(m)}
                            className={`p-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 border-2 transition-all ${metodo === m ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-400'}`}>
                            {m === 'EFECTIVO' ? <BanknotesIcon className="w-5 h-5"/> : <DevicePhoneMobileIcon className="w-5 h-5"/>}
                            {m}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Monto a Registrar *</label>
                        <input type="number" step="0.01" required value={recibido} onChange={e => setRecibido(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg outline-none focus:ring-2 focus:ring-red-500" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">N° Operación / Referencia</label>
                        <input type="text" value={referencia} onChange={e => setReferencia(e.target.value)} placeholder="Ej: 002938"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none" />
                    </div>

                    <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 transition-colors relative">
                        <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white shadow-sm rounded-lg"><PhotoIcon className="w-6 h-6 text-slate-400" /></div>
                            <span className="text-xs font-bold text-slate-500">{archivo ? archivo.name : 'Subir Comprobante'}</span>
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase text-sm shadow-lg hover:bg-red-700 transition-all disabled:opacity-50">
                    {loading ? 'Procesando...' : 'Registrar Pago de Cuota'}
                </button>
            </form>
        </ViewModal>
    );
};
export default PagoCuotaModal;