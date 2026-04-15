import React from 'react';
import { useUpdate } from 'hooks/SolicitudPrestamo/useUpdate';
import SolicitudForm from 'components/Shared/Formularios/SolicitudPrestamo/SolicitudForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const Update = () => {
    const { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate, addIntegrante, removeIntegrante, updateMontoIntegrante, isBlocked } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <PageHeader title="Editar Solicitud" subtitle={`ID: ${formData?.id}`} buttonText="Volver" buttonLink="/solicitudPrestamo/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="mt-6">
                <SolicitudForm data={formData} handleChange={handleChange} addIntegrante={addIntegrante} removeIntegrante={removeIntegrante} updateMontoIntegrante={updateMontoIntegrante} isUpdate={true} />
                <div className="mt-8 flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/solicitudPrestamo/listar')} className="px-8 py-4 bg-slate-100 rounded-xl font-bold uppercase">Cancelar</button>
                    {/* Bloqueamos el botón si hay morosos */}
                    <button type="submit" disabled={saving || isBlocked} className={`px-10 py-4 rounded-xl font-black uppercase shadow-xl ${isBlocked ? 'bg-slate-300 text-slate-500' : 'bg-black text-white'}`}>
                        {saving ? 'Guardando...' : 'Actualizar'}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default Update;