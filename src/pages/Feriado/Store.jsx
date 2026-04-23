import React from 'react';
import { useStore } from 'hooks/Feriado/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import Calendario from 'components/Shared/Calendars/Calendario';
import { toUpper } from 'utilities/Validations/validations';

const Store = () => {
    const { formData, feriados, loading, alert, setAlert, handleChange, handleSubmit } = useStore();

    // Normalizar fechas para el calendario
    const feriadosCalendario = feriados.map(f => ({
        ...f,
        fecha: f.fecha?.includes('/') ? f.fecha.split('/').reverse().join('-') : f.fecha,
    }));

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <PageHeader title="Agregar Feriado" buttonText="Volver" buttonLink="/feriados/index" />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                <div className="flex flex-col items-center">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">
                        1. Selecciona la Fecha del Calendario
                    </label>
                    <Calendario
                        mode="single"
                        selected={formData.fecha || null}
                        onSelect={(iso) => { if (iso) handleChange('fecha', iso); }}
                        feriados={feriadosCalendario}
                    />
                    {feriadosCalendario.length > 0 && (
                        <p className="text-[9px] text-slate-600 uppercase tracking-widest mt-4">
                            Días en naranja = feriados registrados (no seleccionables)
                        </p>
                    )}
                </div>

                <div className="flex flex-col justify-center space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Fecha Seleccionada</label>
                        <input type="text" readOnly
                            value={formData.fecha || 'NADA SELECCIONADO'}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-red-600 text-center outline-none" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Descripción del Feriado</label>
                        <input type="text"
                            value={formData.descripcion}
                            onChange={(e) => handleChange('descripcion', toUpper(e.target.value))}
                            placeholder="EJ: COMBATE DE ANGAMOS"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-red-500 transition-all"
                            required />
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={loading || !formData.fecha}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-black uppercase rounded-2xl hover:from-red-700 hover:to-red-800 transition-all shadow-xl shadow-red-500/30 disabled:opacity-50 tracking-widest">
                            {loading ? 'Procesando...' : 'Registrar Feriado'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Store;