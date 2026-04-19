import React from 'react';
import { useStore } from 'hooks/Prospecto/useStore';
import ProspectoForm from 'components/Shared/Formularios/Prospecto/ProspectoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { UserPlusIcon, MagnifyingGlassIcon, ArrowPathIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { onlyNumbers } from 'utilities/Validations/validations';

const ProspectoStore = () => {
    const {
        documento, setDocumento,
        buscando, busquedaHecha, busquedaResult,
        formData, handleChange,
        loading, alert, setAlert,
        handleBuscar, handleSubmit, resetBusqueda,
        navigate,
    } = useStore();

    const puedeRegistrar = busquedaHecha && busquedaResult && !busquedaResult.encontrado;

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader
                title="Registrar Prospecto"
                icon={UserPlusIcon}
                buttonText="← Volver al Listado"
                buttonLink="/prospecto/listar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            {/* ── FASE 1: Verificación de documento ── */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-4">
                <h3 className="text-sm font-black text-slate-700 uppercase mb-1 flex items-center gap-2">
                    <MagnifyingGlassIcon className="w-4 h-4 text-red-600" />
                    Paso 1 — Verificar Documento
                </h3>
                <p className="text-[11px] text-slate-400 mb-4">Ingresa el DNI o RUC antes de registrar para evitar duplicados.</p>

                <div className="flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">DNI / RUC</label>
                        <input
                            type="text"
                            value={documento}
                            onChange={(e) => { setDocumento(onlyNumbers(e.target.value, 11)); if (busquedaHecha) resetBusqueda(); }}
                            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                            placeholder="Ingresa DNI (8 dígitos) o RUC (11 dígitos)"
                            maxLength={11}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleBuscar}
                        disabled={buscando || !documento}
                        className="px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase hover:bg-slate-700 transition-all disabled:opacity-40 flex items-center gap-2"
                    >
                        {buscando
                            ? <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            : <MagnifyingGlassIcon className="w-4 h-4" />
                        }
                        Verificar
                    </button>
                    {busquedaHecha && (
                        <button type="button" onClick={resetBusqueda}
                            className="px-4 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs uppercase hover:bg-slate-200 transition-all">
                            Limpiar
                        </button>
                    )}
                </div>

                {/* Resultado de búsqueda */}
                {busquedaHecha && busquedaResult && (
                    <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 ${
                        busquedaResult.encontrado
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-green-50 border-green-200'
                    }`}>
                        {busquedaResult.encontrado
                            ? <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            : <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        }
                        <div>
                            {busquedaResult.encontrado ? (
                                <>
                                    <p className="text-xs font-black text-amber-700 uppercase">
                                        {busquedaResult.tipo === 'cliente' ? '⚠ Ya es cliente activo' : '⚠ Ya existe como prospecto'}
                                    </p>
                                    <p className="text-[11px] text-amber-600 mt-0.5">
                                        {busquedaResult.data?.nombre_completo}
                                    </p>
                                </>
                            ) : (
                                <p className="text-xs font-black text-green-700 uppercase">✓ Documento libre — puedes registrar el prospecto</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── FASE 2: Formulario (solo si está libre) ── */}
            {puedeRegistrar && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-700 uppercase mb-4 flex items-center gap-2">
                            <UserPlusIcon className="w-4 h-4 text-red-600" />
                            Paso 2 — Datos del Prospecto
                        </h3>
                        <ProspectoForm data={formData} onChange={handleChange} isEditing={false} />
                    </div>

                    <div className="mt-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-end gap-3 sticky bottom-4 z-10">
                        <button type="button" onClick={() => navigate('/prospecto/listar')}
                            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm uppercase hover:bg-slate-200 transition-all">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black text-sm uppercase hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 shadow-lg shadow-red-500/30">
                            {loading ? 'Registrando...' : 'Registrar Prospecto'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProspectoStore;