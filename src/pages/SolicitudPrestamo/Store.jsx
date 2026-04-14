import React from 'react';
import { useStore } from 'hooks/SolicitudPrestamo/useStore';
import SolicitudForm from 'components/Shared/Formularios/SolicitudPrestamo/SolicitudForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const Store = () => {

    const { formData, loading, alert, setAlert, handleChange, handleSubmit, isBlocked } = useStore();

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <PageHeader title="Nueva Solicitud" buttonText="Volver" buttonLink="/solicitudPrestamo/listar" />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <form onSubmit={handleSubmit} className="mt-6">
                <SolicitudForm data={formData} handleChange={handleChange} />
                
                <div className="mt-8 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading || isBlocked} 
                        className={`px-10 py-4 rounded-xl font-black uppercase shadow-lg transition-all duration-300 ${
                            isBlocked 
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-400' 
                            : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                        }`}
                    >
                        {loading ? 'Enviando...' : isBlocked ? 'Registro bloqueado' : 'Registrar Solicitud'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;