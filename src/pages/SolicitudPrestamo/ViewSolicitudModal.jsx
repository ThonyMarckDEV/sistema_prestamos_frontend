import React from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { 
    UserIcon, BanknotesIcon, CalendarDaysIcon, 
    UserGroupIcon, MapPinIcon, ClipboardDocumentListIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';

const ViewSolicitudModal = ({ isOpen, onClose, data, isLoading }) => {
    if (!data && !isLoading) return null;

    const statusMap = { 
        1: { label: 'PENDIENTE', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }, 
        2: { label: 'APROBADO', color: 'bg-green-100 text-green-700 border-green-200' }, 
        3: { label: 'RECHAZADO', color: 'bg-red-100 text-red-700 border-red-200' } 
    };

    return (
        <ViewModal isOpen={isOpen} onClose={onClose} title="Detalle de Solicitud de Crédito" isLoading={isLoading}>
            {data && (
                <div className="space-y-6">
                    {/* --- ENCABEZADO Y ESTADO --- */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código de Solicitud</p>
                            <h3 className="text-2xl font-black text-slate-800">#SOL-{String(data.id).padStart(5, '0')}</h3>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-4 py-1.5 rounded-full text-[11px] font-black border ${statusMap[data.estado]?.color}`}>
                                {statusMap[data.estado]?.label}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${data.es_grupal ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                TIPO: {data.es_grupal ? 'PRÉSTAMO GRUPAL' : 'PRÉSTAMO INDIVIDUAL'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* --- BLOQUE 1: PROPUESTA ECONÓMICA --- */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <h4 className="text-xs font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
                                <BanknotesIcon className="w-4 h-4 text-red-600" /> Condiciones del Crédito
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-bold">Monto Total:</span>
                                    <span className="text-base font-black text-slate-900 italic underline">S/ {data.monto_solicitado}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-bold">Tasa de Interés:</span>
                                    <span className="text-sm font-black text-blue-600">{data.tasa_interes}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-bold">Cuotas / Frecuencia:</span>
                                    <span className="text-sm font-black text-slate-800">{data.cuotas_solicitadas} ({data.frecuencia})</span>
                                </div>
                                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-bold">Modalidad:</span>
                                    <span className="text-[10px] font-black px-2 py-0.5 bg-white border rounded text-red-600 uppercase">{data.modalidad}</span>
                                </div>
                            </div>
                        </div>

                        {/* --- BLOQUE 2: PARTICIPANTES PRINCIPALES --- */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <h4 className="text-xs font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-red-600" /> Responsables
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{data.es_grupal ? 'Nombre del Grupo' : 'Cliente Solicitante'}</p>
                                    <p className="text-sm font-black text-slate-800 uppercase">{data.cliente_nombre}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">Asesor de Negocios</p>
                                    <p className="text-sm font-bold text-slate-700">{data.asesor_nombre}</p>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 pt-1">
                                    <CalendarDaysIcon className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase">Fecha: {data.fecha_solicitud || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- SECCIÓN CRÍTICA: INTEGRANTES DEL GRUPO (SOLO SI ES GRUPAL) --- */}
                    {data.es_grupal && data.integrantes?.length > 0 && (
                        <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-100">
                            <h4 className="text-xs font-black text-blue-600 uppercase mb-4 flex items-center gap-2">
                                <UserGroupIcon className="w-5 h-5" /> Desglose de Montos Individuales
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {data.integrantes.map((int, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-50 shadow-sm transition-hover hover:border-blue-200">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-700 uppercase">{int.nombre_completo}</span>
                                            <span className="text-[8px] text-slate-400 font-bold">SOCIO INTEGRANTE</span>
                                        </div>
                                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                                            S/ {int.monto}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-right">
                                <span className="text-[10px] font-black text-slate-400 uppercase mr-2">Suma validada:</span>
                                <span className="text-sm font-black text-blue-700 underline">S/ {data.monto_solicitado}</span>
                            </div>
                        </div>
                    )}

                    {/* --- BLOQUE: DATOS DEL AVAL --- */}
                    <div className={`p-5 rounded-2xl border ${data.aval ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100 border-dashed text-center'}`}>
                        <h4 className="text-xs font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
                            <ShieldCheckIcon className={`w-4 h-4 ${data.aval ? 'text-indigo-600' : 'text-slate-300'}`} /> Información de Garantía (Aval)
                        </h4>
                        {data.aval ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="md:col-span-2">
                                    <p className="text-[9px] text-indigo-400 font-bold uppercase">Nombre Completo</p>
                                    <p className="font-bold text-slate-800 uppercase text-xs">{data.aval.nombres_aval} {data.aval.apellido_paterno_aval} {data.aval.apellido_materno_aval}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-indigo-400 font-bold uppercase">Documento DNI</p>
                                    <p className="font-bold text-slate-800 text-xs">{data.aval.dni_aval}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-indigo-400 font-bold uppercase">Vínculo / Celular</p>
                                    <p className="font-bold text-slate-700 text-xs uppercase">{data.aval.relacion_cliente_aval} | {data.aval.telefono_movil_aval}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-[9px] text-indigo-400 font-bold uppercase flex items-center gap-1">
                                        <MapPinIcon className="w-3 h-3"/> Ubicación
                                    </p>
                                    <p className="font-medium text-slate-700 italic text-[11px]">
                                        {data.aval.direccion_aval} ({data.aval.distrito_aval}, {data.aval.provincia_aval})
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="py-4 text-xs font-bold text-slate-300 italic uppercase">La solicitud no cuenta con un aval externo registrado.</p>
                        )}
                    </div>

                    {/* --- OBSERVACIONES --- */}
                    {data.observaciones && (
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                            <ClipboardDocumentListIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            <div>
                                <h4 className="text-[10px] font-black text-amber-700 uppercase mb-1">Notas del Asesor:</h4>
                                <p className="text-xs text-amber-800 leading-relaxed font-medium italic">"{data.observaciones}"</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </ViewModal>
    );
};

export default ViewSolicitudModal;