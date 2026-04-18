import React from 'react';
import { useStore } from 'hooks/Zona/useStore';
import ZonaForm from 'components/Shared/Formularios/Zona/ZonaForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, loading, alert, setAlert, handleChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader title="Registrar Nueva Zona" icon={PlusCircleIcon} buttonText="Volver" buttonLink="/zona/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details}  onClose={() => setAlert(null)} />
            
            <form onSubmit={handleSubmit} className="mt-6 max-w-3xl mx-auto">
                <ZonaForm data={formData} handleChange={handleChange} />

                <div className="mt-8 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-3.5 rounded-xl font-black uppercase hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 shadow-lg shadow-red-500/30"
                    >
                        {loading ? 'Procesando...' : 'Guardar Zona'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;