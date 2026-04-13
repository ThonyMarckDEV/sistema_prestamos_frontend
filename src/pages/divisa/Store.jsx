import React from 'react';
import { useStore } from 'hooks/categoriaPlato/useStore';
import CategoriaPlatoForm from 'components/Shared/Formularios/categoriaPlato/CategoriaPlatoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { TagIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, setFormData, loading, alert, setAlert, handleChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Nueva Categoría" subtitle="Agrega una nueva agrupación para tus platos" icon={TagIcon} buttonText="Volver" buttonLink="/categoria-plato/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                <CategoriaPlatoForm form={formData} setForm={setFormData} handleChange={handleChange} />
                
                <div className="flex justify-end">
                    <button type="submit" disabled={loading} className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 disabled:opacity-50 shadow-lg transition-all">
                        {loading ? 'Guardando...' : 'Registrar Categoría'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;