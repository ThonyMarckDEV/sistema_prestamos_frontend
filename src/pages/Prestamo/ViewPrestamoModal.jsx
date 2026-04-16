import React from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import { 
    CalendarIcon, 
    UserIcon, 
    UserGroupIcon,
    InformationCircleIcon,
    UsersIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';

const ViewPrestamoModal = ({ isOpen, onClose, data, isLoading }) => {
    
    const getStatusBadge = (estado) => {
        const styles = {
            1: 'bg-yellow-50 text-yellow-700 border-yellow-100',
            2: 'bg-green-50 text-green-700 border-green-100',   
            3: 'bg-blue-50 text-blue-700 border-blue-100',      
            4: 'bg-red-50 text-red-700 border-red-100',          
            5: 'bg-purple-50 text-purple-700 border-purple-100' ,
            6: 'bg-orange-50 text-orange-700 border-orange-100' 
        };
        const labels = { 1: 'PENDIENTE', 2: 'PAGADO', 3: 'VENCE HOY', 4: 'VENCIDO', 5: 'EN REVISION' , 6: 'PAGO PARCIAL' };
        
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
                    {/* 1. Header: Información General */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl shadow-sm ${data.es_grupal ? 'bg-blue-600 text-white' : 'bg-white text-slate-500'}`}>
                                {data.es_grupal ? <UserGroupIcon className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {data.es_grupal ? 'Grupo Solidario' : 'Cliente Titular'}
                                </p>
                                <p className="text-sm font-black uppercase text-slate-800">{data.cliente?.nombre}</p>
                                <p className="text-[10px] font-bold text-blue-600">Documento: {data.cliente?.documento}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-slate-500">
                                <InformationCircleIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Desembolso</p>
                                <p className="text-sm font-black text-slate-800 uppercase">{data.datos_economicos?.modalidad}</p>
                                <p className="text-[10px] font-bold text-slate-500">Vía: {data.datos_economicos?.abonado_por}</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Desglose de Integrantes  */}
                    {/* SECCIÓN DE INTEGRANTES (SOLO SI ES GRUPAL) */}
                    {data.es_grupal && data.integrantes && data.integrantes.length > 0 && (
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            <h4 className="flex items-center gap-2 text-xs font-black text-blue-800 uppercase mb-3">
                                <UsersIcon className="w-4 h-4" /> Desglose de Integrantes
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {data.integrantes.map((int) => (
                                    <div key={int.id} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 shadow-sm">
                                        <span className="text-[13px] font-bold text-slate-600 truncate mr-2" title={int.nombre}>
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

                    {/* 3. Resumen Económico */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase">Capital Total</p>
                            <p className="text-md font-black text-slate-800">S/ {data.datos_economicos?.monto}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase">Interés ({data.datos_economicos?.interes_porc}%)</p>
                            <p className="text-md font-black text-blue-600">S/ {(parseFloat(data.datos_economicos?.total_prestamo) - parseFloat(data.datos_economicos?.monto)).toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl text-center shadow-lg">
                            <p className="text-[9px] font-black text-slate-300 uppercase">Total Cobrar</p>
                            <p className="text-md font-black text-white">S/ {data.datos_economicos?.total_prestamo}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase">Cuota</p>
                            <p className="text-md font-black text-slate-800">S/ {data.datos_economicos?.valor_cuota}</p>
                        </div>
                    </div>

                    {/* 4. Tabla de Cronograma */}
                    <div>
                        <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase mb-3 tracking-widest px-1">
                            <CalendarIcon className="w-4 h-4 text-blue-500" /> Cronograma de Pagos y Saldos
                        </h4>
                        <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-[9px] font-black text-slate-500 uppercase border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-4 text-center">N°</th>
                                        <th className="px-4 py-4 text-center">Vencimiento</th>
                                        <th className="px-4 py-4">Deuda Base + Mora</th>
                                        <th className="px-4 py-4">Abonos / Beneficios</th>
                                        <th className="px-4 py-4">Saldo Real</th>
                                        <th className="px-4 py-4 text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {data.cronograma?.map((cuota) => {
                                        const saldo = parseFloat(cuota.saldo_pendiente);
                                        const excAnt = parseFloat(cuota.excedente_anterior);
                                        const excGen = parseFloat(cuota.excedente);
                                        const pagoRec = parseFloat(cuota.pago_realizado);
                                        const moraPagada = parseFloat(cuota.mora_pagada || 0);

                                        return (
                                            <tr key={cuota.id} className="hover:bg-blue-50/20 transition-colors">
                                                <td className="px-4 py-4 text-xs font-black text-slate-400 text-center font-mono">#{cuota.nro.toString().padStart(2, '0')}</td>
                                                <td className="px-4 py-4 text-xs font-bold text-slate-600 text-center">{cuota.vencimiento}</td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-black text-slate-800">S/ {cuota.monto}</span>
                                                        {parseFloat(cuota.mora_total) > 0 && (
                                                            <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 rounded w-fit mt-0.5 uppercase">Mora: +S/ {cuota.mora_total}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        {pagoRec > 0 && (
                                                            <span className="text-[12px] font-black text-green-600 flex items-center gap-1">
                                                                <BanknotesIcon className="w-3 h-3" /> RECIBIDO: S/ {pagoRec.toFixed(2)}
                                                            </span>
                                                        )}
                                                        {moraPagada > 0 && (
                                                            <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 w-fit">Mora Cubierta: S/ {moraPagada.toFixed(2)}</span>
                                                        )}
                                                        {excAnt > 0 && (
                                                            <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 w-fit">Excedente Aplicado: -S/ {excAnt.toFixed(2)}</span>
                                                        )}
                                                        {excGen > 0 && (
                                                            <span className="text-[9px] font-black text-blue-600 uppercase italic">Sobra: S/ {excGen.toFixed(2)}</span>
                                                        )}
                                                        {!pagoRec && !excAnt && <span className="text-slate-300 text-[10px] italic uppercase tracking-tighter">Sin movimientos</span>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`text-sm font-black italic ${saldo > 0 ? 'text-red-600 underline' : 'text-green-600'}`}>
                                                        S/ {saldo.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center">{getStatusBadge(cuota.estado)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase pt-4 border-t border-slate-100">
                        <p>F. Registro: {data.fechas?.generacion}</p>
                        <p>F. Inicio: {data.fechas?.inicio}</p>
                    </div>
                </div>
            )}
        </ViewModal>
    );
};

export default ViewPrestamoModal;