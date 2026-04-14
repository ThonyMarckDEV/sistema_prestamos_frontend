import React from 'react';
import { useStore } from 'hooks/CargoMora/useStore';
import CargoMoraForm from 'components/Shared/Formularios/CargoMora/CargoMoraForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const Store = () => {
    const { formData, loading, alert, setAlert, handleChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <PageHeader title="Nuevo Tarifario de Mora" buttonText="Volver" buttonLink="/cargoMora/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="mt-6">
                <CargoMoraForm data={formData} handleChange={handleChange} />
                <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={loading} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all">
                        {loading ? 'Guardando...' : 'Registrar Tarifas'}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default Store;