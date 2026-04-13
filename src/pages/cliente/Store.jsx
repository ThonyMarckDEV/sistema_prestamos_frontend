import React from 'react';
import { useStore } from 'hooks/cliente/useStore';
import DatosPersonalesForm from 'components/Shared/Formularios/cliente/DatosPersonalesForm';
import ContactoForm from 'components/Shared/Formularios/cliente/ContactoForm';
import DireccionForm from 'components/Shared/Formularios/cliente/DireccionForm';
import CuentaBancariaForm from 'components/Shared/Formularios/cliente/CuentaBancariaForm';
import EmpleoForm from 'components/Shared/Formularios/cliente/EmpleoForm';
import UsuarioForm from 'components/Shared/Formularios/cliente/UsuarioForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { formData, loading, alert, setAlert, handleNestedChange, handleSubmit } = useStore();
    const esPersona = Number(formData.datos_cliente.tipo) === 1;

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader title="Registrar Nuevo Cliente" icon={UserPlusIcon} buttonText="Volver al Listado" buttonLink="/cliente/listar" />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
            
            <form onSubmit={handleSubmit} className="mt-4">
                {/* Usamos Grid. En movil 1 col, en Desktop 3 col */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Columna Izquierda (Datos Principales ocupa 1 columna entera) */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <DatosPersonalesForm data={formData} handleNestedChange={handleNestedChange} />
                        <UsuarioForm form={formData} handleNestedChange={handleNestedChange} isEditing={false} />
                    </div>

                    {/* Columna Central y Derecha */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <DireccionForm data={formData} handleNestedChange={handleNestedChange} />
                        <ContactoForm data={formData} handleNestedChange={handleNestedChange} />
                        
                        {esPersona && <EmpleoForm data={formData} handleNestedChange={handleNestedChange} />}
                        <CuentaBancariaForm data={formData} handleNestedChange={handleNestedChange} />
                    </div>
                </div>

                {/* Boton Flotante / Footer de Acción */}
                <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-end sticky bottom-4 z-10">
                    <button type="submit" disabled={loading}
                        className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-3.5 rounded-xl font-black uppercase hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 shadow-lg shadow-red-500/30">
                        {loading ? 'Procesando...' : 'Guardar Cliente'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;