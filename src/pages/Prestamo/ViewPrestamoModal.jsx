import React from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { 
    CalendarIcon, 
    UserIcon, 
    UserGroupIcon,
    InformationCircleIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

const ViewPrestamoModal = ({ isOpen, onClose, data, isLoading }) => {
    
    const getStatusBadge = (estado) => {
        const styles = {
            1: 'bg-yellow-50 text-yellow-700 border-yellow-100',
            2: 'bg-green-50 text-green-700 border-green-100',   
            3: 'bg-blue-50 text-blue-700 border-blue-100',      
            4: 'bg-red-50 text-red-700 border-red-100',          
            5: 'bg-purple-50 text-purple-700 border-purple-100' 
        };
        const labels = { 1: 'PENDIENTE', 2: 'PAGADO', 3: 'VENCE HOY', 4: 'VENCIDO', 5: 'PREPAGADO' };
        
        return (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${styles[estado] || styles[1]}`}>
                {labels[estado] || 'PENDIENTE'}
            </span>
        );
    };

    return (
        <ViewModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Detalle de Préstamo #${data?.id?.toString().padStart(5, '0')}`}
            isLoading={isLoading}
        >
            {data && (
                <div className="space-y-6">
                    {/* Header: Información del Cliente / Grupo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg shadow-sm ${data.es_grupal ? 'bg-blue-100' : 'bg-white'}`}>
                                {data.es_grupal 
                                    ? <UserGroupIcon className="w-5 h-5 text-blue-600" /> 
                                    : <UserIcon className="w-5 h-5 text-slate-500" />
                                }
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                    {data.es_grupal ? 'Grupo Solidario' : 'Cliente Titular'}
                                </p>
                                <p className={`text-sm font-black uppercase ${data.es_grupal ? 'text-blue-700' : 'text-slate-800'}`}>
                                    {data.cliente?.nombre}
                                </p>
                                <p className="text-[10px] font-medium text-slate-500">Doc: {data.cliente?.documento}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <InformationCircleIcon className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Modalidad / Origen</p>
                                <p className="text-sm font-black text-slate-800 uppercase">{data.datos_economicos?.modalidad}</p>
                                <p className="text-[10px] font-medium text-slate-500">Desembolso via: {data.datos_economicos?.abonado_por}</p>
                            </div>
                        </div>
                    </div>

                    {/* Resumen Económico */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 border border-slate-100 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Monto Capital</p>
                            <p className="text-lg font-black text-slate-900 italic">S/ {data.datos_economicos?.monto}</p>
                        </div>
                        <div className="p-3 border border-slate-100 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Interés ({data.datos_economicos?.interes_porc}%)</p>
                            <p className="text-lg font-black text-blue-600 italic">S/ {(data.datos_economicos?.total_prestamo - data.datos_economicos?.monto).toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                            <p className="text-[10px] font-bold text-red-400 uppercase">Total a Pagar</p>
                            <p className="text-lg font-black text-red-600 italic">S/ {data.datos_economicos?.total_prestamo}</p>
                        </div>
                        <div className="p-3 border border-slate-100 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Cuota ({data.datos_economicos?.frecuencia})</p>
                            <p className="text-lg font-black text-slate-900 italic">S/ {data.datos_economicos?.valor_cuota}</p>
                        </div>
                    </div>

                    {/* SECCIÓN DE INTEGRANTES (SOLO SI ES GRUPAL) */}
                    {data.es_grupal && data.integrantes && data.integrantes.length > 0 && (
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            <h4 className="flex items-center gap-2 text-xs font-black text-blue-800 uppercase mb-3">
                                <UsersIcon className="w-4 h-4" /> Desglose de Integrantes
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {data.integrantes.map((int) => (
                                    <div key={int.id} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 shadow-sm">
                                        <span className="text-[11px] font-bold text-slate-600 truncate mr-2" title={int.nombre}>
                                            {int.nombre}
                                        </span>
                                        <span className="text-xs font-black text-blue-600 whitespace-nowrap">
                                            S/ {int.monto}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tabla de Cronograma */}
                    <div>
                        <h4 className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase mb-3 tracking-wider">
                            <CalendarIcon className="w-4 h-4" /> Cronograma de Pagos
                        </h4>
                        <div className="overflow-hidden border border-slate-100 rounded-xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3">N°</th>
                                        <th className="px-4 py-3">Vencimiento</th>
                                        <th className="px-4 py-3">Monto</th>
                                        <th className="px-4 py-3">Mora</th>
                                        <th className="px-4 py-3">Pagado</th>
                                        <th className="px-4 py-3 text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {data.cronograma?.map((cuota) => (
                                        <tr key={cuota.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 text-xs font-bold text-slate-600">
                                                {cuota.nro.toString().padStart(2, '0')}
                                            </td>
                                            <td className="px-4 py-3 text-xs font-medium text-slate-700">
                                                {cuota.vencimiento}
                                            </td>
                                            <td className="px-4 py-3 text-xs font-black text-slate-800">
                                                S/ {cuota.monto}
                                            </td>
                                            <td className="px-4 py-3 text-xs font-bold text-red-500">
                                                {cuota.mora > 0 ? `S/ ${cuota.mora}` : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-xs font-bold text-green-600">
                                                S/ {cuota.pago_realizado}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {getStatusBadge(cuota.estado)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Info de fechas al pie */}
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase pt-2">
                        <p>Generado: {data.fechas?.generacion}</p>
                        <p>Inicio de Crédito: {data.fechas?.inicio}</p>
                    </div>
                </div>
            )}
        </ViewModal>
    );
};

export default ViewPrestamoModal;