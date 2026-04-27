import React from 'react';
import { useDashboardPrestamos } from 'hooks/Dashboard/useDashboardPrestamos';
import DashboardCard from 'components/Shared/Cards/DashboardCard';
import { UserGroupIcon, UserIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const TABS = [
    { id: 'cards',      label: 'Resumen'    },
    { id: 'activos',    label: 'Vigentes'   },
    { id: 'anteriores', label: 'Anteriores' },
    { id: 'proximas',   label: 'Por vencer' },
    { id: 'vencidas',   label: 'Vencidas'   },
    { id: 'mensual',    label: '12 meses'   },
];

const fmt = n => parseFloat(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

// ── Render fila: Vigentes ─────────────────────────────────────────────────────
const filaActivo = p => (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 bg-brand-red-light rounded-lg flex-shrink-0">
                    {p.es_grupal ? <UserGroupIcon className="w-4 h-4 text-brand-red" /> : <UserIcon className="w-4 h-4 text-brand-red" />}
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 uppercase truncate">{p.nombre}</p>
                    {p.es_grupal && p.grupo && <p className="text-[9px] text-slate-400 font-bold">GRUPO: {p.grupo}</p>}
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-slate-900">S/ {fmt(p.monto)}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">{p.frecuencia}</p>
            </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span>{p.pagadas}/{p.cuotas} cuotas pagadas</span>
            <span className="text-brand-red">{p.progreso}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="bg-brand-red h-1.5 rounded-full" style={{ width: `${p.progreso}%` }} />
        </div>
        <div className="mt-2 flex gap-3 text-[9px] text-slate-400 font-bold">
            <span>Inicio: {p.fecha_inicio}</span><span>·</span>
            <span>{p.pendientes} pendientes</span><span>·</span>
            <span className="uppercase">{p.modalidad}</span>
        </div>
    </div>
);

// ── Render fila: Anteriores ───────────────────────────────────────────────────
const filaAnterior = p => (
    <div className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl border border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 bg-slate-100 rounded-lg flex-shrink-0">
                {p.es_grupal ? <UserGroupIcon className="w-4 h-4 text-slate-400" /> : <UserIcon className="w-4 h-4 text-slate-400" />}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-black text-slate-700 uppercase truncate">{p.nombre}</p>
                <p className="text-[9px] text-slate-400 font-bold">{p.fecha_inicio} · {p.cuotas} cuotas</p>
            </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-sm font-black text-slate-600">S/ {fmt(p.monto)}</span>
            {p.estado === 3 && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 uppercase">Liquidado</span>}
            {p.estado === 2 && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-brand-red-light text-brand-red border border-brand-red/20 uppercase">Cancelado</span>}
        </div>
    </div>
);

// ── Render fila: Próximas ─────────────────────────────────────────────────────
const filaProxima = c => (
    <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 bg-amber-100 rounded-lg flex-shrink-0">
                <ClockIcon className="w-4 h-4 text-amber-600" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-black text-slate-800 uppercase truncate">{c.nombre}</p>
                <p className="text-[9px] text-slate-500 font-bold">Cuota #{c.numero_cuota} · Vence: {c.fecha_vencimiento}</p>
            </div>
        </div>
        <div className="text-right flex-shrink-0">
            <p className="text-sm font-black text-slate-900">S/ {fmt(c.monto)}</p>
            <p className={`text-[9px] font-black uppercase ${c.dias_restantes === 0 ? 'text-brand-red' : 'text-amber-600'}`}>
                {c.dias_restantes === 0 ? 'Vence hoy' : `En ${c.dias_restantes} día(s)`}
            </p>
        </div>
    </div>
);

// ── Render fila: Vencidas ─────────────────────────────────────────────────────
const filaVencida = c => (
    <div className="flex items-center justify-between gap-3 bg-brand-red-light/30 border border-brand-red/20 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 bg-brand-red-light rounded-lg flex-shrink-0">
                <ExclamationTriangleIcon className="w-4 h-4 text-brand-red" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-black text-slate-800 uppercase truncate">{c.nombre}</p>
                <p className="text-[9px] text-slate-500 font-bold">
                    Cuota #{c.numero_cuota} · Venció: {c.fecha_vencimiento} · {c.dias_mora} día(s) mora
                </p>
            </div>
        </div>
        <div className="text-right flex-shrink-0">
            <p className="text-sm font-black text-brand-red">S/ {fmt(c.monto)}</p>
            {c.cargo_mora > 0 && <p className="text-[9px] font-bold text-brand-red/70">+S/ {fmt(c.cargo_mora)} mora</p>}
        </div>
    </div>
);

// ── PrestamoCard ──────────────────────────────────────────────────────────────
const PrestamoCard = () => {
    const {
        loading, data,
        fechaInicio, setFechaInicio,
        fechaFin,    setFechaFin,
        handleFiltrar, handleLimpiar,
        setActivosPage, setAnterioresPage,
        setProximasPage, setVencidasPage,
    } = useDashboardPrestamos();

    const mensual = data?.graficas?.mensual ?? [];

    return (
        <DashboardCard
            title="Préstamos y Cuotas"
            subtitle="Módulo de cartera"
            icon="briefcase"
            loading={loading}
            cards={data?.cards ?? []}
            tabs={TABS}
            conFiltros={true}
            fechaInicio={fechaInicio} setFechaInicio={setFechaInicio}
            fechaFin={fechaFin}       setFechaFin={setFechaFin}
            onFiltrar={handleFiltrar}
            onLimpiar={handleLimpiar}
            tablas={{
                activos:    { data: data?.activos,    renderFila: filaActivo,   onPageChange: setActivosPage,    emptyText: 'Sin préstamos vigentes'       },
                anteriores: { data: data?.anteriores, renderFila: filaAnterior, onPageChange: setAnterioresPage, emptyText: 'Sin préstamos anteriores'     },
                proximas:   { data: data?.proximas,   renderFila: filaProxima,  onPageChange: setProximasPage,   emptyText: 'Sin cuotas próximas a vencer' },
                vencidas:   { data: data?.vencidas,   renderFila: filaVencida,  onPageChange: setVencidasPage,   emptyText: 'Sin cuotas vencidas'          },
            }}
            graficas={[
                { tab: 'mensual', tipo: 'barra', data: mensual, xKey: 'mes', dataKey: 'cantidad', label: 'Préstamos por mes',       color: '#8B1A1A', isMoney: false, height: 200 },
                { tab: 'mensual', tipo: 'barra', data: mensual, xKey: 'mes', dataKey: 'total',    label: 'Monto desembolsado (S/)', color: '#F5A623', isMoney: true,  height: 180 },
            ]}
        />
    );
};

export default PrestamoCard;