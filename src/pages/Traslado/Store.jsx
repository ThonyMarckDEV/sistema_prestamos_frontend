import React from 'react';
import { useStore } from 'hooks/Traslado/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import EmpleadoSearchSelect from 'components/Shared/Comboboxes/EmpleadoSearchSelect';
import {
    ArrowsRightLeftIcon, UserIcon, DocumentTextIcon,
    ChevronRightIcon, BuildingOfficeIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Store = () => {
    const {
        loading, loadingPrestamos, alert, setAlert,
        formData, prestamos,
        handleSelectAsesorOrigen, handleSelectAsesorDestino,
        handleSelectPrestamo, handleChange, handleSubmit,
    } = useStore();

    return (
        <div className="container mx-auto p-4 sm:p-6 w-full max-w-full xl:max-w-4xl">
            <PageHeader
                title="Registrar Traslado"
                icon={ArrowsRightLeftIcon}
                buttonText="Ver Historial"
                buttonLink="/traslado/listar"
            />

            <AlertMessage
                type={alert?.type} message={alert?.message}
                details={alert?.details} onClose={() => setAlert(null)}
            />

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">

                {/* ── Asesor Origen ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-brand-red" />
                        1. Seleccionar Asesor Origen
                    </h3>
                    <EmpleadoSearchSelect
                        rol="asesor"
                        onSelect={handleSelectAsesorOrigen}
                        clearOnSelect={false}
                    />
                    {formData.asesor_origen_id && (
                        <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1">
                            <CheckCircleIcon className="w-3.5 h-3.5" /> Asesor seleccionado
                        </p>
                    )}
                </div>

                {/* ── Préstamos del asesor ── */}
                <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-all ${!formData.asesor_origen_id ? 'opacity-40 pointer-events-none' : ''}`}>
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-4 h-4 text-brand-red" />
                        2. Seleccionar Préstamo a Trasladar
                    </h3>

                    {loadingPrestamos ? (
                        <div className="flex items-center gap-2 py-4 text-slate-400 text-xs font-bold">
                            <div className="w-4 h-4 border-2 border-slate-200 border-t-brand-red rounded-full animate-spin" />
                            Cargando préstamos...
                        </div>
                    ) : prestamos.length === 0 ? (
                        <p className="text-[11px] text-slate-400 font-bold py-4 text-center">
                            {formData.asesor_origen_id ? 'Este asesor no tiene préstamos vigentes.' : 'Selecciona un asesor primero.'}
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {prestamos.map((p) => (
                                <button
                                    key={p.id} type="button"
                                    onClick={() => handleSelectPrestamo(p.id)}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all text-left
                                        ${formData.prestamo_id === p.id
                                            ? 'border-brand-red bg-brand-red-light/40 shadow-sm'
                                            : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${formData.prestamo_id === p.id ? 'bg-brand-red text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            <BuildingOfficeIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-700 uppercase">{p.titular}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="font-mono text-[9px] font-bold text-slate-400">#{p.codigo}</span>
                                                <span className="text-[9px] font-bold text-slate-500 uppercase">{p.frecuencia}</span>
                                                {p.es_grupal && (
                                                    <span className="text-[8px] font-black text-blue-600 bg-blue-50 border border-blue-200 rounded px-1">GRUPAL</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs font-black text-slate-700">S/ {parseFloat(p.monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                                        {formData.prestamo_id === p.id && (
                                            <CheckCircleIcon className="w-4 h-4 text-brand-red" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Asesor Destino ── */}
                <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-all ${!formData.prestamo_id ? 'opacity-40 pointer-events-none' : ''}`}>
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ChevronRightIcon className="w-4 h-4 text-brand-red" />
                        3. Seleccionar Asesor Destino
                    </h3>
                    <EmpleadoSearchSelect
                        rol="asesor"
                        onSelect={handleSelectAsesorDestino}
                        clearOnSelect={false}
                    />
                    {formData.asesor_destino_id && (
                        <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1">
                            <CheckCircleIcon className="w-3.5 h-3.5" /> Asesor de destino seleccionado
                        </p>
                    )}
                </div>

                {/* ── Motivo ── */}
                <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-all ${!formData.asesor_destino_id ? 'opacity-40 pointer-events-none' : ''}`}>
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-4 h-4 text-brand-red" />
                        4. Motivo del Traslado (Opcional)
                    </h3>
                    <textarea
                        value={formData.motivo}
                        onChange={(e) => handleChange('motivo', e.target.value)}
                        rows={3}
                        placeholder="Ej: Reasignación por zona, solicitud del cliente..."
                        className="w-full p-3.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all resize-none"
                    />
                </div>

                {/* ── Botón ── */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading || !formData.prestamo_id || !formData.asesor_destino_id}
                        className="w-full sm:w-auto bg-brand-red text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl shadow-brand-red/30 hover:bg-brand-red-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                    >
                        {loading
                            ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Procesando...</>
                            : <><ArrowsRightLeftIcon className="w-4 h-4" /> Confirmar Traslado</>
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Store;