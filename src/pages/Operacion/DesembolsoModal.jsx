import React, { useState, useEffect } from 'react';
import Modal from 'components/Shared/Modals/ViewModal';
import { PhotoIcon, DocumentCheckIcon, ArrowsRightLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

const DesembolsoModal = ({ isOpen, onClose, prestamo, onConfirm, loading }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [nroOperacion, setNroOperacion] = useState('');

    useEffect(() => {
        if (prestamo) console.log('[DesembolsoModal] prestamo recibido:', JSON.stringify(prestamo));
    }, [prestamo]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setNroOperacion('');
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) return;

        const prestamoId = prestamo?.id ?? prestamo?.value ?? prestamo?.prestamo_id;
        if (!prestamoId) {
            console.error('[DesembolsoModal] prestamo sin id:', prestamo);
            return;
        }

        const fd = new FormData();
        fd.append('prestamo_id', prestamoId);
        fd.append('comprobante', file);
        fd.append('metodo_pago', 'TRANSFERENCIA');
        fd.append('numero_operacion', nroOperacion);

        onConfirm(fd);
    };

    if (!prestamo) return null;

    return (
        <Modal isOpen={isOpen} onClose={reset} title="Autorizar Salida de Dinero" size="5xl">
            <div className="flex flex-col md:flex-row -m-6 md:h-[580px] overflow-y-auto md:overflow-hidden">

                <div className="w-full md:w-[45%] p-8 flex flex-col bg-white border-r border-slate-100">
                    <div className="space-y-6 flex-1">
                        <div className="bg-slate-900 p-6 rounded-[28px] text-white shadow-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <ArrowsRightLeftIcon className="w-4 h-4 text-blue-400" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Importe Desembolso</span>
                            </div>
                            <h2 className="text-4xl font-black italic tracking-tighter text-blue-400">S/ {prestamo.monto}</h2>
                            <div className="mt-5 pt-5 border-t border-white/10">
                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Beneficiario / Titular:</p>
                                <p className="text-sm font-black uppercase leading-snug text-white break-words">
                                    {prestamo.cliente}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Nro de Operación Bancaria</label>
                                <input
                                    type="text"
                                    value={nroOperacion}
                                    onChange={(e) => setNroOperacion(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    placeholder="Ej: BCP-009283"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Evidencia del WhatsApp *</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="modal-desembolso-upload" />
                                <label
                                    htmlFor="modal-desembolso-upload"
                                    className={`flex items-center justify-center w-full p-5 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                                        file ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500'
                                    }`}
                                >
                                    <div className="flex flex-col items-center gap-1 font-black text-[10px] uppercase">
                                        <PhotoIcon className="w-6 h-6 mb-1" />
                                        {file ? 'Voucher Cargado ✓' : 'Subir Captura / Voucher'}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Vista previa en móvil */}
                    <div className="md:hidden mt-6 mb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Vista Previa:</p>
                        <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100 min-h-[200px]">
                            {preview ? (
                                <img src={preview} alt="Voucher Preview" className="max-h-[300px] rounded-lg shadow-sm" />
                            ) : (
                                <p className="text-[10px] font-black text-slate-300 uppercase italic">Sin archivo seleccionado</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 md:pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !file}
                            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <DocumentCheckIcon className="w-5 h-5" />
                            )}
                            Confirmar y Desembolsar
                        </button>
                    </div>
                </div>

                {/* Vista previa en escritorio */}
                <div className="hidden md:flex md:w-[55%] bg-slate-50 relative items-center justify-center p-6">
                    {preview ? (
                        <div className="relative w-full h-full flex items-center justify-center group">
                            <img
                                src={preview}
                                alt="Voucher Preview"
                                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl bg-white border border-slate-200"
                            />
                            <button
                                onClick={() => { setFile(null); setPreview(null); }}
                                className="absolute top-4 right-4 bg-white text-red-600 p-2 rounded-full shadow-xl hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <PhotoIcon className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin Vista Previa</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default DesembolsoModal;