import React from 'react';
import { useUpdate } from 'hooks/SolicitudPrestamo/useUpdate';
import SolicitudForm from 'components/Shared/Formularios/SolicitudPrestamo/SolicitudForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const Update = () => {
    const { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <PageHeader title="Evaluar Solicitud" subtitle={`ID: ${formData?.id}`} buttonText="Volver" buttonLink="/solicitudPrestamo/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="mt-6">
                <SolicitudForm data={formData} handleChange={handleChange} isUpdate={true} />
                <div className="mt-8 flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/solicitudPrestamo/listar')} className="px-8 py-4 bg-slate-100 rounded-xl font-bold uppercase text-sm">Cancelar</button>
                    <button type="submit" disabled={saving} className="bg-black text-white px-10 py-4 rounded-xl font-black uppercase shadow-xl">
                        {saving ? 'Guardando...' : 'Actualizar Solicitud'}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default Update;