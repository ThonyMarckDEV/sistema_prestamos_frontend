import React from 'react';
import { useUpdate } from 'hooks/Cliente/useUpdate';
import DatosClienteForm from 'components/Shared/Formularios/Cliente/DatosPersonalesForm';
import UsuarioForm from 'components/Shared/Formularios/Cliente/UsuarioForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const { formData, loading, saving, alert, setAlert, handleNestedChange, handleSubmit, navigate } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader
                title="Editar Cliente"
                subtitle={formData.datos_cliente.tipo === 2
                    ? `Editando: ${formData.datos_cliente.razon_social || ''}`
                    : `Editando: ${formData.datos_cliente.nombre} ${formData.datos_cliente.apellidoPaterno}`
                }
                icon={PencilSquareIcon}
                buttonText="← Volver al listado"
                buttonLink="/cliente/listar"
            />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <DatosClienteForm data={formData} handleNestedChange={handleNestedChange} />
                <UsuarioForm form={formData} handleNestedChange={handleNestedChange} isEditing={true} />
                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" onClick={() => navigate('/cliente/listar')}
                        className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors uppercase text-sm">
                        Cancelar
                    </button>
                    <button type="submit" disabled={saving}
                        className="bg-black text-white px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50">
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Update;