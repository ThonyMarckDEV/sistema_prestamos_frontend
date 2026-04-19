import React, { useState } from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import PdfModal from 'components/Shared/Modals/PdfModal';
import { 
    CalendarIcon, UserIcon, UserGroupIcon,
    InformationCircleIcon, UsersIcon,
    ArrowPathIcon, ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { showIntegrante, descargarCronograma } from 'services/prestamoService';

const ViewPrestamoModal = ({ isOpen, onClose, data, isLoading }) => {

    const [integranteSeleccionado, setIntegranteSeleccionado] = useState(null);
    const [integranteData, setIntegranteData]                 = useState(null);
    const [loadingIntegrante, setLoadingIntegrante]           = useState(false);
    const [pdfOpen, setPdfOpen]                               = useState(false);
    const [pdfBase64, setPdfBase64]                           = useState(null);
    const [pdfTitle, setPdfTitle]                             = useState('');
    const [loadingPdf, setLoadingPdf]                         = useState(false);

    const handleSelectIntegrante = async (clienteId) => {
        if (integranteSeleccionado === clienteId) {
            setIntegranteSeleccionado(null);
            setIntegranteData(null);
            return;
        }
        setIntegranteSeleccionado(clienteId);
        setLoadingIntegrante(true);
        try {
            const res = await showIntegrante(data.id, clienteId);
            setIntegranteData(res.data || res);
        } finally {
            setLoadingIntegrante(false);
        }
    };

    const handleDescargarCronograma = async () => {
        setLoadingPdf(true);
        try {
            const res = await descargarCronograma(data.id, integranteSeleccionado ?? null);
            const result = res.data || res;
            setPdfBase64(result.pdf);
            setPdfTitle(result.title);
            setPdfOpen(true);
        } finally {
            setLoadingPdf(false);
        }
    };

    const handleClose = () => {
        setIntegranteSeleccionado(null);
        setIntegranteData(null);
        onClose();
    };

    const getStatusBadge = (estado) => {
        const styles = {
            1: 'bg-yellow-50 text-yellow-700 border-yellow-100',
            2: 'bg-green-50 text-green-700 border-green-100',
            3: 'bg-blue-50 text-blue-700 border-blue-100',
            4: 'bg-red-50 text-red-700 border-red-100',
            5: 'bg-orange-50 text-orange-700 border-orange-100'
        };
        const labels = { 1: 'PENDIENTE', 2: 'PAGADO', 3: 'VENCE HOY', 4: 'VENCIDO', 5: 'PAGO PARCIAL' };
        return (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${styles[estado] || styles[1]}`}>
                {labels[estado] || 'PENDIENTE'}
            </span>
        );
    };

    const cronogramaActivo  = integranteData?.cronograma ?? data?.cronograma;
    const esVistaIntegrante = !!integranteData;
    const integranteActivo  = data?.integrantes?.find(i => i.id === integranteSeleccionado);

    return (
        <>
            <ViewModal
                isOpen={isOpen}
                onClose={handleClose}
                title={`Detalle de Préstamo #${data?.id?.toString().padStart(5, '0')}`}
                isLoading={isLoading}
                size="xl"
            >
                {data && (
                    <div className="space-y-6">

                        {/* 1. Header */}
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

                        {/* 2. Integrantes */}
                        {data.es_grupal && data.integrantes && data.integrantes.length > 0 && (
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <h4 className="flex items-center gap-2 text-xs font-black text-blue-800 uppercase mb-1">
                                    <UsersIcon className="w-4 h-4" /> Desglose de Integrantes
                                </h4>
                                <p className="text-[9px] text-blue-400 font-bold mb-3 italic">
                                    Haz click en un socio para ver su cronograma individual
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {data.integrantes.map((int) => (
                                        <div
                                            key={int.id}
                                            onClick={() => handleSelectIntegrante(int.id)}
                                            className={`flex justify-between items-center bg-white p-2 rounded border shadow-sm cursor-pointer transition-all
                                                ${integranteSeleccionado === int.id
                                                    ? 'border-blue-400 ring-1 ring-blue-300 bg-blue-50'
                                                    : 'border-slate-100 hover:border-blue-200'
                                                }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-700 uppercase">{int.nombre}</span>
                                                <span className="text-[10px] text-blue-600 font-bold">CARGO: {int.cargo}</span>
                                            </div>
                                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
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
                                <p className="text-md font-black text-blue-600">
                                    S/ {(parseFloat(data.datos_economicos?.total_prestamo) - parseFloat(data.datos_economicos?.monto)).toFixed(2)}
                                </p>
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

                        {/* 4. Header cronograma + botón descargar */}
                        <div className="flex items-center justify-between">
                            <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-widest px-1">
                                <CalendarIcon className="w-4 h-4 text-blue-500" />
                                {esVistaIntegrante
                                    ? `Cronograma — ${integranteActivo?.nombre ?? ''}`
                                    : 'Cronograma de Pagos y Saldos'
                                }
                            </h4>
                            <button
                                onClick={handleDescargarCronograma}
                                disabled={loadingPdf}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {loadingPdf
                                    ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                                    : <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                                }
                                {esVistaIntegrante ? 'PDF Individual' : 'PDF Grupal'}
                            </button>
                        </div>

                        {/* 5. Tabla */}
                        {loadingIntegrante ? (
                            <div className="flex items-center justify-center py-12">
                                <ArrowPathIcon className="w-6 h-6 animate-spin text-blue-400" />
                                <span className="ml-2 text-xs text-slate-400 font-bold uppercase">Cargando cronograma...</span>
                            </div>
                        ) : (
                            <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead className="bg-slate-50 text-[9px] font-black text-slate-500 uppercase border-b border-slate-100">
                                        <tr>
                                            <th className="px-4 py-4 text-center">N°</th>
                                            <th className="px-4 py-4 text-center">Vencimiento</th>
                                            <th className="px-4 py-4">Deuda Base</th>
                                            <th className="px-4 py-4">Mora</th>
                                            <th className="px-4 py-4">Abonos</th>
                                            <th className="px-4 py-4">Saldo Real</th>
                                            <th className="px-4 py-4 text-center">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {cronogramaActivo?.map((cuota, i) => {
                                            const nro           = cuota.nro ?? (i + 1);
                                            const deuda         = parseFloat(cuota.total_cuota ?? cuota.monto ?? 0);
                                            const moraTotal     = parseFloat(cuota.mora_total ?? cuota.mora ?? 0);
                                            const moraPagada    = parseFloat(cuota.mora_pagada ?? 0);
                                            const moraPendiente = Math.max(0, moraTotal - moraPagada);
                                            const abonado       = esVistaIntegrante
                                                ? parseFloat(cuota.pago_total_real ?? cuota.pago_acumulado ?? 0)
                                                : parseFloat(cuota.pago_realizado ?? cuota.pago_acumulado ?? 0);
                                            const acumuladoInd  = esVistaIntegrante ? parseFloat(cuota.pago_acumulado ?? 0) : 0;
                                            const saldo         = parseFloat(cuota.saldo_pendiente ?? cuota.saldo_real ?? cuota.saldo ?? 0);
                                            const diasAtraso    = cuota.dias_atraso || 0;
                                            const excAnt        = esVistaIntegrante
                                                ? parseFloat(cuota.excedente_aplicado || 0)
                                                : (parseFloat(cuota.excedente_consumido || 0) > 0 ? parseFloat(cuota.excedente_consumido) : parseFloat(cuota.excedente_anterior || 0));
                                            const excGen        = esVistaIntegrante ? 0 : parseFloat(cuota.excedente_generado || 0);

                                            return (
                                                <tr key={nro} className="hover:bg-blue-50/20 transition-colors">
                                                    <td className="px-4 py-4 text-xs font-black text-slate-400 text-center font-mono">
                                                        #{nro.toString().padStart(2, '0')}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className="text-xs font-bold text-slate-600 block">{cuota.vencimiento}</span>
                                                        {diasAtraso > 0 && (
                                                            <span className="text-[9px] font-black text-red-600 uppercase">{diasAtraso} días atraso</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-[11px] font-black text-slate-800">S/ {deuda.toFixed(2)}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-col">
                                                            {moraTotal <= 0 ? (
                                                                <span className="text-slate-300 font-black text-[11px]">—</span>
                                                            ) : moraPendiente > 0 ? (
                                                                <>
                                                                    <span className="font-black text-[11px] text-red-600">+S/ {moraPendiente.toFixed(2)}</span>
                                                                    <span className="text-[8px] text-slate-400 font-bold mt-0.5">De S/ {moraTotal.toFixed(2)}</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="font-black text-[11px] text-red-600 line-through">S/ {moraTotal.toFixed(2)}</span>
                                                                    <span className="text-[8px] text-green-600 font-bold mt-0.5">✓ Cubierta</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            {abonado > 0 && (
                                                                <span className="text-[9px] font-bold text-blue-600 uppercase">
                                                                    Recibido: S/ {abonado.toFixed(2)}
                                                                </span>
                                                            )}
                                                            {esVistaIntegrante && acumuladoInd > 0 && acumuladoInd !== abonado && (
                                                                <span className="text-[9px] font-bold text-green-700 uppercase">
                                                                    Acumulado: S/ {acumuladoInd.toFixed(2)}
                                                                </span>
                                                            )}
                                                            {!esVistaIntegrante && parseFloat(cuota.pago_acumulado || 0) > 0 && (
                                                                <span className="text-[9px] font-bold text-green-700 uppercase">
                                                                    Acumulado: S/ {parseFloat(cuota.pago_acumulado).toFixed(2)}
                                                                </span>
                                                            )}
                                                            {moraPagada > 0 && (
                                                                <span className="text-[9px] font-bold text-yellow-600 uppercase">
                                                                    Mora cubierta: S/ {moraPagada.toFixed(2)}
                                                                </span>
                                                            )}
                                                             {excAnt > 0 && (
                                                                <span className="text-[9px] font-bold text-purple-600 uppercase">
                                                                    {esVistaIntegrante
                                                                        ? `Excedente. aplicado: -S/ ${excAnt.toFixed(2)}`
                                                                        : `Excedente. usado: -S/ ${excAnt.toFixed(2)}`
                                                                    }
                                                                </span>
                                                            )}
                                                            {excGen > 0 && (
                                                                <span className="text-[9px] font-bold text-orange-500 uppercase">
                                                                    Excedente: S/ {excGen.toFixed(2)}
                                                                </span>
                                                            )}
                                                            {abonado === 0 && excAnt === 0 && moraPagada === 0 && (
                                                                <span className="text-[10px] text-slate-300 font-bold">—</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex flex-col">
                                                            <span className={`text-sm font-black italic ${saldo > 0 ? 'text-red-600 underline' : 'text-green-600'}`}>
                                                                S/ {saldo.toFixed(2)}
                                                            </span>
                                                            {moraPendiente > 0 && saldo > 0 && (
                                                                <span className="text-[9px] text-slate-400 font-bold">
                                                                    Capital: {Math.max(0, deuda - abonado).toFixed(2)} | Mora: {moraPendiente.toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">{getStatusBadge(cuota.estado)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase pt-4 border-t border-slate-100">
                            <p>F. Registro: {data.fechas?.generacion}</p>
                            <p>F. Inicio: {data.fechas?.inicio}</p>
                        </div>
                    </div>
                )}
            </ViewModal>

            <PdfModal
                isOpen={pdfOpen}
                onClose={() => { setPdfOpen(false); setPdfBase64(null); }}
                title={pdfTitle}
                base64={pdfBase64}
            />
        </>
    );
};

export default ViewPrestamoModal;