import React from 'react';
import { useUpdate } from 'hooks/Feriado/useUpdate';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import Calendario from 'components/Shared/Calendars/Calendario';
import { toUpper } from 'utilities/Validations/validations';

const Update = () => {
    const { formData, loading, saving, alert, setAlert, handleChange, handleSubmit } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <PageHeader title="Editar Feriado" subtitle={`Fecha original: ${formData.fecha}`} buttonText="Volver" buttonLink="/feriados/index" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                <div className="flex flex-col items-center">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">Modificar Fecha</label>
                    <Calendario
                        mode="single"
                        selected={formData.fecha}
                        onSelect={(fecha) => handleChange('fecha', fecha)}
                    />
                </div>

                <div className="flex flex-col justify-center space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Nueva Fecha</label>
                        <input type="text" readOnly value={formData.fecha}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-red-600 text-center outline-none" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Descripción</label>
                        <input type="text"
                            value={formData.descripcion}
                            onChange={(e) => handleChange('descripcion', toUpper(e.target.value))}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-red-500"
                            required />
                    </div>

                    <button type="submit" disabled={saving}
                        className="w-full py-4 bg-slate-900 text-white font-black uppercase rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50">
                        {saving ? 'Guardando...' : 'Actualizar Feriado'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Update;