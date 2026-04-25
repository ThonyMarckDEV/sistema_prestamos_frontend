import React from 'react';
import { useUpdate } from 'hooks/Producto/useUpdate';
import ProductoForm from 'components/Shared/Formularios/Producto/ProductoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const Update = () => {
    const { formData, loading, saving, alert, setAlert, handleChange, handleSubmit, navigate } = useUpdate();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader
                title="Editar Producto"
                subtitle={`Editando: ${formData.nombre}`}
                icon={PencilSquareIcon}
                buttonText="← Volver"
                buttonLink="/producto/listar"
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <form onSubmit={handleSubmit} className="mt-6 max-w-3xl mx-auto">
                <ProductoForm data={formData} handleChange={handleChange} />

                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                    <button type="button" onClick={() => navigate('/producto/listar')}
                        className="px-8 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors uppercase text-sm w-full sm:w-auto">
                        Cancelar
                    </button>
                    {/* 🔥 Botón Sólido Corporativo */}
                    <button type="submit" disabled={saving}
                        className="w-full sm:w-auto bg-brand-red text-white px-10 py-3.5 rounded-xl font-black uppercase shadow-lg shadow-brand-red/30 hover:bg-brand-red-dark transition-all disabled:opacity-50 tracking-wide">
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Update;