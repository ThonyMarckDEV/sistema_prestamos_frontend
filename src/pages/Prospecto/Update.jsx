import React from 'react';
import { useUpdate } from 'hooks/Prospecto/useUpdate';
import ProspectoForm from 'components/Shared/Formularios/Prospecto/ProspectoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const ProspectoUpdate = () => {
    const { formData, handleChange, loading, saving, alert, setAlert, handleSubmit, navigate } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader
                title="Editar Prospecto"
                subtitle={`Editando: ${formData.nombre_completo || ''}`}
                icon={PencilSquareIcon}
                buttonText="← Volver al Listado"
                buttonLink="/prospecto/listar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <ProspectoForm data={formData} onChange={handleChange} isEditing={true} />
                </div>

                <div className="mt-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-end gap-3 sticky bottom-4 z-10">
                    <button type="button" onClick={() => navigate('/prospecto/listar')}
                        className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm uppercase hover:bg-slate-200 transition-all">
                        Cancelar
                    </button>
                    <button type="submit" disabled={saving}
                        className="px-8 py-3 bg-black text-white rounded-xl font-black text-sm uppercase hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-lg">
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProspectoUpdate;