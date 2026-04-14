import React, { useState, useEffect } from 'react';
import { TicketIcon, CloudArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

const ReportarPagoModal = ({ isOpen, onClose, cuota, onConfirm, loading }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Limpiar previsualización al cerrar
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
        const data = { numero_operacion: e.target.numero_operacion.value };
        onConfirm(data, selectedFile);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] overflow-hidden max-w-4xl w-full shadow-2xl animate-in zoom-in duration-300 flex flex-col md:flex-row">
                
                {/* LADO IZQUIERDO: FORMULARIO */}
                <div className="w-full md:w-1/2 p-8 border-r border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <TicketIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Reportar Pago</h2>
                            <p className="text-slate-400 text-[10px] font-bold uppercase">Cuota #{cuota?.nro} • S/ {cuota?.monto}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 ml-1 mb-1">N° de Operación</label>
                            <input 
                                name="numero_operacion" 
                                required 
                                type="text" 
                                className="w-full p-4 bg-slate-100 border-2 border-transparent rounded-2xl font-black text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" 
                                placeholder="Ej: 832912" 
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 ml-1 mb-1">Subir Comprobante</label>
                            <div className="relative group">
                                <input 
                                    name="comprobante" 
                                    required 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="w-full p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-blue-100 transition-colors">
                                    <CloudArrowUpIcon className="w-5 h-5 text-blue-600" />
                                    <span className="text-xs font-black text-blue-700 uppercase">
                                        {selectedFile ? 'Cambiar Imagen' : 'Seleccionar Archivo'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="flex-1 py-4 font-black uppercase text-xs text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading || !selectedFile} 
                                className="flex-1 py-4 bg-black text-white font-black uppercase text-xs rounded-2xl shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Subiendo...' : 'Enviar Pago'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* LADO DERECHO: PREVIEW */}
                <div className="w-full md:w-1/2 bg-slate-50 p-4 flex items-center justify-center relative min-h-[300px]">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-slate-400 hover:text-red-500 z-20 md:hidden"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>

                    {previewUrl ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Vista previa del boucher</p>
                            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                                <img 
                                    src={previewUrl} 
                                    alt="Preview" 
                                    className="w-full h-full object-contain bg-slate-200"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-3">
                            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto opacity-50">
                                <PhotoIcon className="w-10 h-10 text-slate-400" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-10">
                                Sube una foto para previsualizar el comprobante aquí
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ReportarPagoModal;