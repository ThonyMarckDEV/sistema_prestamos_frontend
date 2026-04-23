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
    CheckCircleIcon, IdentificationIcon,
    PhoneIcon, BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Row = ({ label, value }) => (
    <div className="flex justify-between items-start py-1.5 border-b border-slate-50 last:border-0">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide w-2/5">{label}</span>
        <span className="text-[11px] font-bold text-slate-700 w-3/5 text-right leading-snug">{value || '—'}</span>
    </div>
);

const Section = ({ icon: Icon, title, color = 'text-slate-400', children }) => (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <h4 className={`text-[9px] font-black uppercase tracking-widest mb-3 flex items-center gap-1.5 ${color}`}>
            <Icon className="w-3 h-3" /> {title}
        </h4>
        {children}
    </div>
);

const ViewProspectoModal = ({ isOpen, onClose, data, isLoading, onSeguimientoSuccess }) => {
    const navigate = useNavigate();
    const { can } = useAuth();

    const [seguimientoOpen, setSeguimientoOpen] = useState(false);
    const [statusOpen,      setStatusOpen]      = useState(false);

    const puedeSeguimiento = can('prospecto.seguimiento') && [1, 2, 5].includes(data?.estado);
    const puedeEditar      = can('prospecto.update')      && [1, 2, 3, 5].includes(data?.estado);
    const puedeStatus      = can('prospecto.status')      && [1, 2, 3].includes(data?.estado);

    const handleSuccess = (updatedData) => onSeguimientoSuccess?.(updatedData);

    return (
        <>
            <ViewModal
                isOpen={isOpen}
                onClose={onClose}
                title={`Prospecto #${data?.id?.toString().padStart(5, '0') ?? ''}`}
                isLoading={isLoading}
                size="2xl"
            >
                {data && (
                    <div className="flex flex-col md:flex-row gap-5 min-h-0">

                        {/* ── COLUMNA IZQUIERDA ── */}
                        <div className="flex-1 flex flex-col gap-4 min-w-0">

                            {/* Header */}
                            <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white/10 rounded-xl">
                                        {data.tipo === 2
                                            ? <BuildingOfficeIcon className="w-5 h-5 text-amber-400" />
                                            : <UserIcon className="w-5 h-5 text-white" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-black text-sm uppercase leading-tight">{data.nombre_completo}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            {data.tipo === 1 ? `DNI: ${data.dni}` : `RUC: ${data.ruc}`}
                                            {' · '}{data.tipo === 2 ? 'Empresa' : 'Persona Natural'}
                                        </p>
                                    </div>
                                </div>
                                <EstadoBadge estado={data.estado} />
                            </div>

                            {/* Identificación */}
                            <Section icon={IdentificationIcon} title="Identificación" color="text-red-500">
                                {data.tipo === 1 ? (
                                    <>
                                        <Row label="DNI"         value={data.dni} />
                                        <Row label="Vencimiento" value={data.fechaVencimientoDni} />
                                        <Row label="Nacimiento"  value={data.fechaNacimiento} />
                                        <Row label="Sexo"        value={data.sexo} />
                                    </>
                                ) : (
                                    <>
                                        <Row label="RUC"         value={data.ruc} />
                                        <Row label="Razón Social" value={data.razon_social} />
                                        <Row label="N. Comercial" value={data.nombre_comercial} />
                                    </>
                                )}
                                <Row label="CIIU"    value={data.ciiu ? `${data.ciiu.codigo} - ${data.ciiu.descripcion}` : null} />
                                <Row label="Asesor"  value={data.asesor} />
                                <Row label="Registro" value={data.created_at?.split(' ')[0]} />
                            </Section>

                            {/* Contacto */}
                            <Section icon={PhoneIcon} title="Contacto y Residencia" color="text-blue-500">
                                <Row label="Celular"   value={data.telefono} />
                                <Row label="Fijo"      value={data.telefonoFijo} />
                                <Row label="Correo"    value={data.correo} />
                                <Row label="Zona"      value={data.zona} />
                                <Row label="Ubicación" value={data.departamento ? `${data.distrito}, ${data.provincia}` : null} />
                                <Row label="Dirección" value={data.direccionFiscal} />
                                <Row label="Vivienda"  value={data.tipoVivienda ? `${data.tipoVivienda} · ${data.tiempoResidencia}` : null} />
                            </Section>

                            {/* Financiero */}
                            <Section icon={CurrencyDollarIcon} title="Evaluación Financiera" color="text-green-500">
                                <Row label="Ingreso Est."  value={data.ingreso_estimado ? `S/ ${data.ingreso_estimado}` : null} />
                                <Row label="Monto Solic."  value={data.monto_solicitado ? `S/ ${data.monto_solicitado}` : null} />
                                <Row label="Propósito"     value={data.proposito} />
                                {data.observaciones && (
                                    <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Observaciones</p>
                                        <p className="text-[11px] text-slate-600 leading-relaxed">{data.observaciones}</p>
                                    </div>
                                )}
                            </Section>

                            {/* Convertido */}
                            {data.estado === 6 && data.cliente_id && (
                                <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center gap-3">
                                    <CheckCircleIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                    <p className="text-xs font-black text-purple-700 uppercase">Prospecto convertido a cliente</p>
                                </div>
                            )}

                            {/* Botones de acción */}
                            {(puedeSeguimiento || puedeStatus || puedeEditar) && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {puedeSeguimiento && (
                                        <button onClick={() => setSeguimientoOpen(true)}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase hover:bg-slate-700 transition-all">
                                            <ArrowPathIcon className="w-3.5 h-3.5" /> Seguimiento
                                        </button>
                                    )}
                                    {puedeStatus && (
                                        <button onClick={() => setStatusOpen(true)}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase hover:bg-blue-700 transition-all">
                                            <CheckCircleIcon className="w-3.5 h-3.5" /> Aprobar / Rechazar
                                        </button>
                                    )}
                                    {puedeEditar && (
                                        <button onClick={() => { onClose(); navigate(`/prospecto/editar/${data.id}`); }}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase hover:bg-slate-200 transition-all">
                                            <PencilSquareIcon className="w-3.5 h-3.5" /> Editar
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── COLUMNA DERECHA — HISTORIAL ── */}
                        <div className="w-full md:w-96 flex-shrink-0 flex flex-col">
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 h-full flex flex-col">
                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <ClockIcon className="w-3 h-3" /> Historial de Seguimientos
                                </h4>

                                {data.seguimientos && data.seguimientos.length > 0 ? (
                                    <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1">
                                        {data.seguimientos.map((s, i) => (
                                            <div key={s.id} className="relative">
                                                {/* Línea vertical conectora */}
                                                {i < data.seguimientos.length - 1 && (
                                                    <div className="absolute left-3 top-8 bottom-0 w-px bg-slate-200" />
                                                )}
                                                <div className="flex gap-2.5">
                                                    <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center flex-shrink-0 mt-1 z-10">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                    </div>
                                                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-3 shadow-sm mb-2">
                                                        <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                                                            <EstadoBadge estado={s.estado_anterior} />
                                                            <ArrowRightIcon className="w-2.5 h-2.5 text-slate-300" />
                                                            <EstadoBadge estado={s.estado_nuevo} />
                                                        </div>
                                                        {s.nota && (
                                                            <p className="text-[10px] text-slate-600 leading-relaxed mb-1.5 font-medium">
                                                                "{s.nota}"
                                                            </p>
                                                        )}
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase truncate max-w-[70%]">
                                                                {s.asesor}
                                                            </p>
                                                            <span className="text-[9px] font-black text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-100">
                                                                {s.fecha}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 opacity-40">
                                        <ClockIcon className="w-8 h-8 text-slate-300" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Sin seguimientos</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </ViewModal>

            <SeguimientoModal isOpen={seguimientoOpen} onClose={() => setSeguimientoOpen(false)} prospecto={data} onSuccess={handleSuccess} />
            <StatusModal     isOpen={statusOpen}      onClose={() => setStatusOpen(false)}      prospecto={data} onSuccess={handleSuccess} />
        </>
    );
};

export default ViewProspectoModal;