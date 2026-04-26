import React, { useState } from 'react';
import { useDashboardPrestamos } from 'hooks/Dashboard/useDashboardPrestamos';
import DashboardCard from 'components/Shared/Cards/DashboardCard';
import { UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';

const TABS = [
    { id: 'cards',      label: 'Resumen' },
    { id: 'activos',    label: 'Vigentes' },
    { id: 'anteriores', label: 'Anteriores' },
    { id: 'mensual',    label: '12 meses' },
];

const EstadoBadge = ({ estado }) => {
    if (estado === 3) return <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 uppercase">Liquidado</span>;
    if (estado === 2) return <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-brand-red-light text-brand-red border border-brand-red/20 uppercase">Cancelado</span>;
    return null;
};

const BarraProgreso = ({ progreso }) => (
    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
        <div className="bg-brand-red h-1.5 rounded-full transition-all" style={{ width: `${progreso}%` }} />
    </div>
);

// Tabla de préstamos activos
const TablaActivos = ({ data }) => {
    if (!data?.length) return (
        <div className="flex items-center justify-center h-32 text-slate-300 text-xs font-bold uppercase tracking-widest">
            Sin préstamos vigentes
        </div>
    );
    return (
        <div className="space-y-3">
            {data.map((p) => (
                <div key={p.id} className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-1.5 bg-brand-red-light rounded-lg flex-shrink-0">
                                {p.es_grupal
                                    ? <UserGroupIcon className="w-4 h-4 text-brand-red" />
                                    : <UserIcon className="w-4 h-4 text-brand-red" />
                                }
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-black text-slate-800 uppercase truncate">{p.nombre}</p>
                                {p.es_grupal && p.grupo && (
                                    <p className="text-[9px] text-slate-400 font-bold">GRUPO: {p.grupo}</p>
                                )}
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-black text-slate-900">S/ {parseFloat(p.monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{p.frecuencia}</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-500">
                        <span>{p.pagadas}/{p.cuotas} cuotas pagadas</span>
                        <span className="text-brand-red">{p.progreso}%</span>
                    </div>
                    <BarraProgreso progreso={p.progreso} />
                    <div className="mt-2 flex gap-3 text-[9px] text-slate-400 font-bold">
                        <span>Inicio: {p.fecha_inicio}</span>
                        <span>·</span>
                        <span>{p.pendientes} pendientes</span>
                        <span>·</span>
                        <span className="uppercase">{p.modalidad}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Tabla de préstamos anteriores
const TablaAnteriores = ({ data }) => {
    if (!data?.length) return (
        <div className="flex items-center justify-center h-32 text-slate-300 text-xs font-bold uppercase tracking-widest">
            Sin préstamos anteriores
        </div>
    );
    return (
        <div className="space-y-2">
            {data.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl border border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 bg-slate-100 rounded-lg flex-shrink-0">
                            {p.es_grupal
                                ? <UserGroupIcon className="w-4 h-4 text-slate-400" />
                                : <UserIcon className="w-4 h-4 text-slate-400" />
                            }
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-black text-slate-700 uppercase truncate">{p.nombre}</p>
                            <p className="text-[9px] text-slate-400 font-bold">{p.fecha_inicio} · {p.cuotas} cuotas</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-black text-slate-600">S/ {parseFloat(p.monto).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                        <EstadoBadge estado={p.estado} />
                    </div>
                </div>
            ))}
        </div>
    );
};

const PrestamoCard = () => {
    const {
        loading, data,
        fechaInicio, setFechaInicio,
        fechaFin,    setFechaFin,
        handleFiltrar, handleLimpiar,
    } = useDashboardPrestamos();

    useState('cards');

    const cards    = data?.cards              ?? [];
    const activos  = data?.activos            ?? [];
    const anteriores = data?.anteriores       ?? [];
    const mensual  = data?.graficas?.mensual  ?? [];

    const graficas = [
        { tab: 'mensual', tipo: 'barra', data: mensual, xKey: 'mes', dataKey: 'cantidad', label: 'Préstamos por mes', color: '#8B1A1A', isMoney: false, height: 200 },
        { tab: 'mensual', tipo: 'barra', data: mensual, xKey: 'mes', dataKey: 'total',    label: 'Monto desembolsado (S/)', color: '#F5A623', isMoney: true,  height: 180 },
    ];

    return (
        <DashboardCard
            title="Préstamos"
            subtitle="Módulo de cartera"
            icon="briefcase"
            loading={loading}
            cards={cards}
            graficas={graficas}
            tabs={TABS}
            tabActivo="cards"
            conFiltros={true}
            fechaInicio={fechaInicio} setFechaInicio={setFechaInicio}
            fechaFin={fechaFin}       setFechaFin={setFechaFin}
            onFiltrar={handleFiltrar}
            onLimpiar={handleLimpiar}
            extraContent={{
                activos:    <TablaActivos    data={activos} />,
                anteriores: <TablaAnteriores data={anteriores} />,
            }}
        />
    );
};

export default PrestamoCard;