import React from 'react';
import { useStore } from 'hooks/SolicitudPrestamo/useStore';
import SolicitudForm from 'components/Shared/Formularios/SolicitudPrestamo/SolicitudForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const Store = () => {
    const { 
        formData, loading, alert, setAlert, handleChange, handleSubmit, 
        isBlocked, addIntegrante, removeIntegrante, updateMontoIntegrante, 
        updateCargoIntegrante
    } = useStore();

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <PageHeader title="Nueva Solicitud" buttonText="Volver" buttonLink="/solicitudPrestamo/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="mt-6">
                <SolicitudForm 
                    data={formData} 
                    handleChange={handleChange} 
                    addIntegrante={addIntegrante} 
                    removeIntegrante={removeIntegrante} 
                    updateMontoIntegrante={updateMontoIntegrante} 
                    updateCargoIntegrante={updateCargoIntegrante} 
                />
                <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={loading || isBlocked} className={`px-10 py-4 rounded-xl font-black uppercase transition-all shadow-lg ${isBlocked ? 'bg-slate-300 text-slate-500 shadow-none' : 'bg-brand-red hover:bg-brand-red-dark text-white shadow-brand-red/30'}`}>
                        {loading ? 'Enviando...' : 'Registrar Solicitud'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;