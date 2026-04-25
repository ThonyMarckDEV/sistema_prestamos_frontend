import React from 'react';

const ParametroForm = ({ formData, clave, handleChange, handleSubmit, saving }) => {

    const handleValor = (e) => {
        // Solo números y punto decimal — máx 2 decimales
        const raw = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        handleChange('valor', raw);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">

            {/* Clave — solo lectura */}
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                    Clave del Parámetro
                </label>
                <input
                    type="text"
                    readOnly
                    value={clave}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-400 outline-none cursor-not-allowed"
                />
            </div>

            {/* Valor — solo números */}
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                    Valor *
                </label>
                <input
                    type="text"
                    inputMode="decimal"
                    value={formData.valor}
                    onChange={handleValor}
                    placeholder="Ej: 3.00"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-brand-red text-center outline-none focus:ring-2 focus:border-brand-red focus:ring-brand-red transition-all text-lg"
                    required
                />
                <p className="text-[9px] text-slate-400 font-bold mt-1 ml-1 uppercase tracking-wide">
                    Solo se permiten números y punto decimal.
                </p>
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">
                    Descripción
                </label>
                <input
                    type="text"
                    value={formData.descripcion}
                    onChange={(e) => handleChange('descripcion', e.target.value)}
                    placeholder="Descripción del parámetro"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:border-brand-red focus:ring-brand-red transition-all"
                />
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={saving || !formData.valor}
                    className="w-full py-4 bg-brand-red text-white font-black uppercase rounded-2xl hover:bg-brand-red-dark transition-all shadow-lg shadow-brand-red/30 disabled:opacity-50 tracking-widest"
                >
                    {saving ? 'Guardando...' : 'Actualizar Parámetro'}
                </button>
            </div>
        </form>
    );
};

export default ParametroForm;