import React from 'react';
import { useStore } from 'hooks/insumo/useStore';
import InsumoForm from 'components/Shared/Formularios/insumo/InsumoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { BeakerIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, setFormData, loading, alert, setAlert, handleChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Nuevo Insumo" icon={BeakerIcon} buttonText="Volver" buttonLink="/insumo/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
                <InsumoForm form={formData} setForm={setFormData} handleChange={handleChange} />
                
                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 shadow-lg transition-all">
                        {loading ? 'Guardando...' : 'Registrar Insumo'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;