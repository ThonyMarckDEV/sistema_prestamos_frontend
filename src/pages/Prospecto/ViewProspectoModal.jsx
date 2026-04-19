import React, { useState } from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import SeguimientoModal from './SeguimientoModal';
import StatusModal from './StatusModal';
import { EstadoBadge } from 'components/Shared/Formularios/Prospecto/ProspectoForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import {
    UserIcon, CurrencyDollarIcon, ClockIcon,
    ArrowPathIcon, PencilSquareIcon, ArrowRightIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const Row = ({ label, value }) => (
    <div className="flex justify-between items-start py-2 border-b border-slate-50 last:border-0">
        <span className="text-[10px] font-black text-slate-400 uppercase w-1/3">{label}</span>
        <span className="text-xs font-bold text-slate-700 w-2/3 text-right">{value || '—'}</span>
    </div>
);

const ViewProspectoModal = ({ isOpen, onClose, data, isLoading, onSeguimientoSuccess }) => {
    const navigate = useNavigate();
    const { can } = useAuth();

    const [seguimientoOpen, setSeguimientoOpen] = useState(false);
    const [statusOpen,      setStatusOpen]      = useState(false);

    const puedeSegumiento = can('prospecto.seguimiento');
    const puedeStatus     = can('prospecto.status');

    const handleSuccess = (updatedData) => {
        onSeguimientoSuccess?.(updatedData);
    };

    return (
        <>
            <ViewModal isOpen={isOpen} onClose={onClose}
                title={`Prospecto #${data?.id?.toString().padStart(5, '0') ?? ''}`}
                isLoading={isLoading} size="xl">
                {data && (
                    <div className="space-y-5">

                        {/* Header */}
                        <div className="flex items-start justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <UserIcon className="w-6 h-6 text-slate-600" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 text-sm uppercase">{data.nombre_completo}</p>
                                    <p className="text-[11px] text-slate-500">{data.documento} · {data.tipo === 2 ? 'Empresa' : 'Persona'}</p>
                                </div>
                            </div>
                            <EstadoBadge estado={data.estado} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Datos */}
                            <div className="bg-white border border-slate-100 rounded-xl p-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-1">
                                    <UserIcon className="w-3 h-3" /> Información
                                </h4>
                                <Row label="Teléfono" value={data.telefono} />
                                <Row label="Correo"   value={data.correo} />
                                <Row label="Zona"     value={data.zona} />
                                <Row label="Asesor"   value={data.asesor} />
                                <Row label="Registro" value={data.created_at?.split(' ')[0]} />
                            </div>

                            {/* Financiero */}
                            <div className="bg-white border border-slate-100 rounded-xl p-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-1">
                                    <CurrencyDollarIcon className="w-3 h-3" /> Datos Financieros
                                </h4>
                                <Row label="Ingreso Est." value={data.ingreso_estimado ? `S/ ${data.ingreso_estimado}` : null} />
                                <Row label="Monto Solic." value={data.monto_solicitado ? `S/ ${data.monto_solicitado}` : null} />
                                <Row label="Propósito"    value={data.proposito} />
                                {data.observaciones && (
                                    <div className="mt-2 p-2 bg-slate-50 rounded-lg">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Observaciones</p>
                                        <p className="text-xs text-slate-600">{data.observaciones}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Historial */}
                        {data.seguimientos && data.seguimientos.length > 0 && (
                            <div className="bg-white border border-slate-100 rounded-xl p-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" /> Historial de Seguimientos
                                </h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {data.seguimientos.map((s) => (
                                        <div key={s.id} className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg">
                                            <ArrowRightIcon className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <EstadoBadge estado={s.estado_anterior} />
                                                    <ArrowRightIcon className="w-3 h-3 text-slate-300" />
                                                    <EstadoBadge estado={s.estado_nuevo} />
                                                    <span className="text-[9px] text-slate-400 ml-auto">{s.fecha}</span>
                                                </div>
                                                {s.nota && <p className="text-[11px] text-slate-500 mt-1">{s.nota}</p>}
                                                <p className="text-[9px] text-slate-400 mt-0.5">Por: {s.asesor}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Acciones */}
                        {data.estado !== 6 && (
                            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
                                {puedeSegumiento && (
                                    <button onClick={() => setSeguimientoOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase hover:bg-slate-700 transition-all">
                                        <ArrowPathIcon className="w-4 h-4" /> Registrar Seguimiento
                                    </button>
                                )}
                                {puedeStatus && [1, 2, 3].includes(data.estado) && (
                                    <button onClick={() => setStatusOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase hover:bg-blue-700 transition-all">
                                        <CheckCircleIcon className="w-4 h-4" /> Aprobar / Rechazar
                                    </button>
                                )}
                                <button onClick={() => { onClose(); navigate(`/prospecto/editar/${data.id}`); }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase hover:bg-slate-200 transition-all">
                                    <PencilSquareIcon className="w-4 h-4" /> Editar Datos
                                </button>
                            </div>
                        )}

                        {data.estado === 6 && data.cliente_id && (
                            <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                                <p className="text-xs font-black text-purple-700">
                                    ✓ Convertido a cliente.{' '}
                                    <button onClick={() => navigate(`/cliente/editar/${data.cliente_id}`)} className="underline">
                                        Ver ficha →
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </ViewModal>

            <SeguimientoModal
                isOpen={seguimientoOpen}
                onClose={() => setSeguimientoOpen(false)}
                prospecto={data}
                onSuccess={handleSuccess}
            />

            <StatusModal
                isOpen={statusOpen}
                onClose={() => setStatusOpen(false)}
                prospecto={data}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export default ViewProspectoModal;