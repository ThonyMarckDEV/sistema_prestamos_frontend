import React from 'react';
import { useUpdate } from 'hooks/insumo/useUpdate';
import InsumoForm from 'components/Shared/Formularios/insumo/InsumoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const { formData, setFormData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Editar Insumo" subtitle={`Editando: ${formData.nombre}`} icon={PencilSquareIcon} buttonText="Cancelar" buttonLink="/insumo/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
                <InsumoForm form={formData} setForm={setFormData} handleChange={handleChange} />
                
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/insumo/listar')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 uppercase text-sm">
                        Cancelar
                    </button>
                    <button type="submit" disabled={saving} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 shadow-lg transition-all">
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Update;