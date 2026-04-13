import React from 'react';
import { useStore } from 'hooks/cliente/useStore';
import DatosClienteForm from 'components/Shared/Formularios/cliente/DatosPersonalesForm';
import UsuarioForm from 'components/Shared/Formularios/cliente/UsuarioForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, loading, alert, setAlert, handleNestedChange, handleSubmit } = useStore();

    return (
        <div className="container mx-auto p-6">
            <PageHeader
                title="Registrar Nuevo Cliente"
                icon={UserPlusIcon}
                buttonText="Volver al Listado"
                buttonLink="/cliente/listar"
            />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <DatosClienteForm data={formData} handleNestedChange={handleNestedChange} />
                <UsuarioForm form={formData} handleNestedChange={handleNestedChange} isEditing={false} />
                <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={loading}
                        className="bg-black text-white px-8 py-3 rounded-lg font-black uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-lg">
                        {loading ? 'Guardando...' : 'Registrar Cliente'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;