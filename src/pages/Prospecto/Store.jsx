import React from 'react';
import { useStore } from 'hooks/Prospecto/useStore';
import ProspectoForm from 'components/Shared/Formularios/Prospecto/ProspectoForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import {
    UserPlusIcon, MagnifyingGlassIcon, ArrowPathIcon,
    ExclamationTriangleIcon, CheckCircleIcon,
    PhoneIcon, EnvelopeIcon, MapPinIcon, UserIcon,
    BriefcaseIcon, CalendarIcon, BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { onlyNumbers } from 'utilities/Validations/validations';

const ESTADO_LABELS = {
    1: { label: 'Nuevo',         color: 'bg-slate-100 text-slate-600 border-slate-200' },
    2: { label: 'Contactado',    color: 'bg-blue-50 text-blue-700 border-blue-200' },
    3: { label: 'En Evaluación', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    4: { label: 'Aprobado',      color: 'bg-green-50 text-green-700 border-green-200' },
    5: { label: 'Rechazado',     color: 'bg-red-50 text-red-600 border-red-200' },
    6: { label: 'Convertido',    color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

/* ── Resumen del prospecto ya existente ─────────────────────────────── */
const ResumenProspecto = ({ data }) => {
    const estado  = ESTADO_LABELS[data.estado] ?? ESTADO_LABELS[1];
    const esEmp   = data.tipo === 2;

    return (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden">

            {/* Cabecera */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-amber-200 bg-amber-100/60">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-amber-800 uppercase">Ya existe como prospecto</p>
                    <p className="text-sm font-black text-slate-800 uppercase truncate mt-0.5">{data.nombre_completo}</p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${estado.color}`}>
                    {estado.label}
                </span>
            </div>

            {/* Datos clave */}
            <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Documento */}
                <div className="flex items-center gap-2">
                    {esEmp
                        ? <BuildingOfficeIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        : <UserIcon           className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    }
                    <div>
                        <p className="text-[9px] font-black text-amber-600 uppercase">{esEmp ? 'RUC' : 'DNI'}</p>
                        <p className="text-xs font-bold text-slate-700">{data.documento ?? '—'}</p>
                    </div>
                </div>

                {/* Teléfono */}
                {data.telefono && (
                    <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <div>
                            <p className="text-[9px] font-black text-amber-600 uppercase">Teléfono</p>
                            <p className="text-xs font-bold text-slate-700">{data.telefono}</p>
                        </div>
                    </div>
                )}

                {/* Correo */}
                {data.correo && (
                    <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <div>
                            <p className="text-[9px] font-black text-amber-600 uppercase">Correo</p>
                            <p className="text-xs font-bold text-slate-700 break-all">{data.correo}</p>
                        </div>
                    </div>
                )}

                {/* Asesor */}
                {data.asesor && (
                    <div className="flex items-center gap-2">
                        <BriefcaseIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <div>
                            <p className="text-[9px] font-black text-amber-600 uppercase">Asesor</p>
                            <p className="text-xs font-bold text-slate-700 uppercase">{data.asesor}</p>
                        </div>
                    </div>
                )}

                {/* Zona */}
                {data.zona && (
                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <div>
                            <p className="text-[9px] font-black text-amber-600 uppercase">Zona</p>
                            <p className="text-xs font-bold text-slate-700 uppercase">{data.zona}</p>
                        </div>
                    </div>
                )}

                {/* Registro */}
                {data.created_at && (
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <div>
                            <p className="text-[9px] font-black text-amber-600 uppercase">Registrado</p>
                            <p className="text-xs font-bold text-slate-700">{data.created_at?.split(' ')[0]}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── Página principal ───────────────────────────────────────────────── */
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
    const esCliente      = busquedaResult?.tipo === 'cliente';
    const esProspecto    = busquedaResult?.tipo === 'prospecto';

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader
                title="Registrar Prospecto"
                icon={UserPlusIcon}
                buttonText="← Volver al Listado"
                buttonLink="/prospecto/listar"
            />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            {/* FASE 1: Verificación */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-4">
                <h3 className="text-sm font-black text-slate-700 uppercase mb-1 flex items-center gap-2">
                    <MagnifyingGlassIcon className="w-4 h-4 text-brand-red" />
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
                            className="w-full p-3 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                            placeholder="Ingresa DNI (8 dígitos) o RUC (11 dígitos)"
                            maxLength={11}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleBuscar}
                        disabled={buscando || !documento}
                        className="px-5 py-3 bg-brand-red text-white rounded-xl font-black text-xs uppercase hover:bg-brand-red-dark transition-all disabled:opacity-40 flex items-center gap-2"
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

                {/* Resultado: cliente activo */}
                {busquedaHecha && esCliente && (
                    <div className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50 flex items-start gap-3">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-black text-red-700 uppercase">⚠ Ya es cliente activo</p>
                            <p className="text-[11px] text-red-600 mt-0.5 font-bold">{busquedaResult.data?.nombre_completo}</p>
                            <p className="text-[10px] text-red-500 mt-1">No se puede registrar como prospecto — ya tiene cuenta de cliente en el sistema.</p>
                        </div>
                    </div>
                )}

                {/* Resultado: ya es prospecto — resumen completo */}
                {busquedaHecha && esProspecto && (
                    <ResumenProspecto data={busquedaResult.data} />
                )}

                {/* Resultado: libre para registrar */}
                {busquedaHecha && !busquedaResult?.encontrado && (
                    <div className="mt-4 p-4 rounded-xl border border-green-200 bg-green-50 flex items-start gap-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs font-black text-green-700 uppercase">✓ Documento libre — puedes registrar el prospecto</p>
                    </div>
                )}
            </div>

            {/* FASE 2: Formulario */}
            {puedeRegistrar && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-700 uppercase mb-4 flex items-center gap-2">
                            <UserPlusIcon className="w-4 h-4 text-brand-red" />
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
                            className="px-8 py-3 bg-brand-red text-white rounded-xl font-black text-sm uppercase hover:bg-brand-red-dark transition-all disabled:opacity-50 shadow-lg shadow-brand-red/30">
                            {loading ? 'Registrando...' : 'Registrar Prospecto'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ProspectoStore;