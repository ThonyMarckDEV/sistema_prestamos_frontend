import React from 'react';
import { ShoppingBagIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';

const ProductoForm = ({ data, handleChange }) => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-6 uppercase tracking-wide border-b border-slate-100 pb-3">
                <ShoppingBagIcon className="w-6 h-6 text-red-600" /> Información del Producto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre del Producto *</label>
                    <input 
                        type="text" 
                        value={data.nombre || ''} 
                        onChange={(e) => handleChange('nombre', e.target.value)} 
                        className="w-full p-3.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" 
                        placeholder="Ej: Préstamo Personal Consumo" 
                        required 
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rango de Tasa Sugerida *</label>
                    <div className="relative">
                        <PresentationChartLineIcon className="w-5 h-5 absolute left-3 top-3.5 text-slate-400"/>
                        <input 
                            type="text" 
                            value={data.rango_tasa || ''} 
                            onChange={(e) => handleChange('rango_tasa', e.target.value)} 
                            className="w-full pl-10 p-3.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" 
                            placeholder="Ej: 15% - 25% anual" 
                            required 
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 uppercase">Referencia visual para el asesor de créditos.</p>
                </div>
            </div>
        </div>
    );
};

export default ProductoForm;