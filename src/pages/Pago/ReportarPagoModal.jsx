import React, { useState, useEffect } from 'react';
import { TicketIcon, CloudArrowUpIcon, PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';

const ReportarPagoModal = ({ isOpen, onClose, cuota, onConfirm, loading }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setPreviewUrl(null);
            setSelectedFile(null);
        }
    }, [isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({ 
            numero_operacion: e.target.numero_operacion.value,
            monto_pagado: e.target.monto_pagado.value 
        }, selectedFile);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] overflow-hidden max-w-4xl w-full shadow-2xl animate-in zoom-in duration-300 flex flex-col md:flex-row">
                
                <div className="w-full md:w-1/2 p-8 border-r border-slate-100 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <TicketIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Reportar Pago</h2>
                            <p className="text-slate-400 text-[10px] font-bold uppercase">Cuota #{cuota?.nro} • Verificación de Saldo</p>
                        </div>
                    </div>

                    {/* RESUMEN DE PAGO (SOLO LECTURA DE BACKEND) */}
                    <div className={`mb-6 p-4 rounded-2xl border ${parseFloat(cuota?.mora_total) > 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Cuota Original</span>
                            <span className="text-sm font-bold text-slate-700">S/ {cuota?.monto}</span>
                        </div>
                        
                        {parseFloat(cuota?.mora_total) > 0 && (
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black text-red-400 uppercase">Mora Acumulada</span>
                                <span className="text-sm font-black text-red-600">+ S/ {cuota?.mora_total}</span>
                            </div>
                        )}

                        {parseFloat(cuota?.excedente_anterior) > 0 && (
                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-purple-200 border-dashed">
                                <div className="flex items-center gap-1">
                                    <SparklesIcon className="w-3 h-3 text-purple-500" />
                                    <span className="text-[10px] font-black text-purple-500 uppercase">Excedente anterior</span>
                                </div>
                                <span className="text-sm font-black text-purple-600">- S/ {cuota?.excedente_anterior}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-1">
                            <span className="text-xs font-black text-slate-800 uppercase">Total a Transferir</span>
                            <span className="text-2xl font-black text-blue-600 italic">S/ {parseFloat(cuota?.saldo_pendiente).toFixed(2)}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 ml-1 mb-1">Monto del Voucher</label>
                                <input 
                                    name="monto_pagado" 
                                    required 
                                    type="number" 
                                    step="0.01"
                                    defaultValue={parseFloat(cuota?.saldo_pendiente).toFixed(2)}
                                    className="w-full p-4 bg-slate-100 border-2 border-transparent rounded-2xl font-black text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 ml-1 mb-1">N° Operación</label>
                                <input name="numero_operacion" required type="text" className="w-full p-4 bg-slate-100 border-2 border-transparent rounded-2xl font-black text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="Ej: 832912" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 ml-1 mb-1">Voucher (Imagen)</label>
                            <div className="relative group">
                                <input name="comprobante" required type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                <div className="w-full p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-blue-100 transition-colors">
                                    <CloudArrowUpIcon className="w-5 h-5 text-blue-600" />
                                    <span className="text-xs font-black text-blue-700 uppercase">{selectedFile ? 'Cambiar Imagen' : 'Elegir Archivo'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-4 font-black uppercase text-xs text-slate-400 hover:text-slate-600 transition-colors">Cancelar</button>
                            <button type="submit" disabled={loading || !selectedFile} className="flex-1 py-4 bg-black text-white font-black uppercase text-xs rounded-2xl shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50">
                                {loading ? 'Enviando...' : 'Reportar Pago'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="w-full md:w-1/2 bg-slate-50 p-4 flex items-center justify-center relative min-h-[300px]">
                    {previewUrl ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Vista previa</p>
                            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain bg-slate-200" />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-3">
                            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto opacity-50">
                                <PhotoIcon className="w-10 h-10 text-slate-400" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-10 text-center">Selecciona una foto para previsualizar el voucher</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportarPagoModal;