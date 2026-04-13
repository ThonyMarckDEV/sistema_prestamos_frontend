import React from 'react';
import { useUpdate } from 'hooks/CargoMora/useUpdate';
import CargoMoraForm from 'components/Shared/Formularios/CargoMora/CargoMoraForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const Update = () => {
    const { formData, loading, saving, alert, setAlert, handleChange, handleSubmit } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <PageHeader title="Editar Tarifas" subtitle={`Tramo: ${formData.dias}`} buttonText="Volver" buttonLink="/cargoMora/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="mt-6">
                <CargoMoraForm data={formData} handleChange={handleChange} />
                <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={saving} className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase shadow-xl hover:bg-zinc-800 transition-all">
                        {saving ? 'Actualizando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default Update;