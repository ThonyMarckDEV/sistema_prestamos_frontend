import React from 'react';
import { useStore } from 'hooks/Cliente/useStore';
import DatosPersonalesForm from 'components/Shared/Formularios/Cliente/DatosPersonalesForm';
import ContactoForm from 'components/Shared/Formularios/Cliente/ContactoForm';
import DireccionForm from 'components/Shared/Formularios/Cliente/DireccionForm';
import CuentaBancariaForm from 'components/Shared/Formularios/Cliente/CuentaBancariaForm';
import EmpleoForm from 'components/Shared/Formularios/Cliente/EmpleoForm';
import UsuarioForm from 'components/Shared/Formularios/Cliente/UsuarioForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { UserPlusIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const {
        formData, loading, loadingProspecto,
        alert, setAlert,
        handleNestedChange, handleSubmit,
        prospectoId,
    } = useStore();

    const esPersona = Number(formData.datos_cliente.tipo) === 1;

    if (loadingProspecto) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader
                title={prospectoId ? 'Convertir Prospecto a Cliente' : 'Registrar Nuevo Cliente'}
                subtitle={prospectoId ? `Prospecto #${prospectoId} — datos precargados` : undefined}
                icon={prospectoId ? ArrowRightCircleIcon : UserPlusIcon}
                buttonText="Volver al Listado"
                buttonLink={prospectoId ? '/prospecto/listar' : '/cliente/listar'}
            />

            {/* Banner informativo si viene de prospecto */}
            {prospectoId && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                    <ArrowRightCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                        <p className="text-xs font-black text-green-700 uppercase">Conversión desde Prospecto</p>
                        <p className="text-[11px] text-green-600 mt-0.5">
                            Los datos del prospecto han sido precargados. Completa los campos faltantes y guarda.
                        </p>
                    </div>
                </div>
            )}

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        {/* tipo bloqueado si viene de prospecto */}
                        <DatosPersonalesForm
                            data={formData}
                            handleNestedChange={handleNestedChange}
                            isEditing={!!prospectoId}
                        />
                        <UsuarioForm
                            form={formData}
                            handleNestedChange={handleNestedChange}
                            isEditing={false}
                        />
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <DireccionForm data={formData} handleNestedChange={handleNestedChange} />
                        <ContactoForm  data={formData} handleNestedChange={handleNestedChange} />
                        {esPersona && <EmpleoForm data={formData} handleNestedChange={handleNestedChange} />}
                        <CuentaBancariaForm data={formData} handleNestedChange={handleNestedChange} />
                    </div>
                </div>

                <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-end sticky bottom-4 z-20">
                    <button type="submit" disabled={loading}
                        className={`w-full sm:w-auto text-white px-10 py-3.5 rounded-xl font-black uppercase transition-all disabled:opacity-50 shadow-lg ${
                            prospectoId
                                ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
                                : 'bg-brand-red hover:bg-brand-red-dark shadow-brand-red/30' // 🔥 Full corporativo
                        }`}>
                        {loading
                            ? 'Procesando...'
                            : prospectoId ? 'Convertir a Cliente' : 'Guardar Cliente'
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;