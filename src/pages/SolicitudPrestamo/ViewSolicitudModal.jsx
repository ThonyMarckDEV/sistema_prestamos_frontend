import React from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { 
    UserIcon, BanknotesIcon, CalendarDaysIcon, 
    UserGroupIcon, MapPinIcon
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
                    {/* ENCABEZADO Y ESTADO */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código de Solicitud</p>
                            <h3 className="text-xl font-black text-slate-800">#SOL-{String(data.id).padStart(5, '0')}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${statusMap[data.estado].color}`}>
                            {statusMap[data.estado].label}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* BLOQUE: DATOS FINANCIEROS */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <h4 className="text-xs font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
                                <BanknotesIcon className="w-4 h-4 text-red-600" /> Propuesta Económica
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-bold">Monto Solicitado:</span>
                                    <span className="text-sm font-black text-slate-900">S/ {data.monto_solicitado}</span>
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
                                    <span className="text-xs font-black px-2 py-0.5 bg-white border rounded text-red-600">{data.modalidad}</span>
                                </div>
                            </div>
                        </div>

                        {/* BLOQUE: CLIENTE Y ASESOR */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <h4 className="text-xs font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-red-600" /> Participantes
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">Cliente Solicitante</p>
                                    <p className="text-sm font-black text-slate-800 uppercase">{data.cliente_nombre}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">Asesor Responsable</p>
                                    <p className="text-sm font-bold text-slate-700">{data.asesor_nombre}</p>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <CalendarDaysIcon className="w-4 h-4" />
                                    <span className="text-[10px] font-bold">Solicitado el: {data.fecha_solicitud || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BLOQUE: DATOS DEL AVAL (CONDICIONAL) */}
                    <div className={`p-5 rounded-2xl border ${data.aval ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100 border-dashed text-center'}`}>
                        <h4 className="text-xs font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
                            <UserGroupIcon className="w-4 h-4 text-indigo-600" /> Información del Aval
                        </h4>
                        {data.aval ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-[9px] text-indigo-400 font-bold uppercase">Nombre Completo</p>
                                    <p className="font-bold text-slate-800 uppercase">{data.aval.nombres_aval} {data.aval.apellido_paterno_aval}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-indigo-400 font-bold uppercase">Documento DNI</p>
                                    <p className="font-bold text-slate-800">{data.aval.dni_aval}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-indigo-400 font-bold uppercase">Parentesco / Relación</p>
                                    <p className="font-bold text-slate-800 uppercase">{data.aval.relacion_cliente_aval}</p>
                                </div>
                                <div className="md:col-span-3">
                                    <p className="text-[9px] text-indigo-400 font-bold uppercase flex items-center gap-1">
                                        <MapPinIcon className="w-3 h-3"/> Dirección del Aval
                                    </p>
                                    <p className="font-medium text-slate-700 italic">"{data.aval.direccion_aval}"</p>
                                </div>
                            </div>
                        ) : (
                            <p className="py-4 text-xs font-bold text-slate-400 italic">Esta solicitud no requiere aval.</p>
                        )}
                    </div>

                    {/* OBSERVACIONES */}
                    {data.observaciones && (
                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                            <h4 className="text-[10px] font-black text-yellow-700 uppercase mb-1">Notas del Asesor:</h4>
                            <p className="text-xs text-yellow-800 leading-relaxed font-medium">{data.observaciones}</p>
                        </div>
                    )}
                </div>
            )}
        </ViewModal>
    );
};

export default ViewSolicitudModal;