import React, { useState } from 'react';
import {
    BanknotesIcon, CheckCircleIcon, CalendarDaysIcon,
    DocumentTextIcon, ChartBarIcon, ClockIcon,
    ExclamationTriangleIcon, MagnifyingGlassIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';

// ── Íconos disponibles ────────────────────────────────────────────────────────
const ICONS = {
    'banknotes':    BanknotesIcon,
    'check-circle': CheckCircleIcon,
    'calendar':     CalendarDaysIcon,
    'document':     DocumentTextIcon,
    'chart':        ChartBarIcon,
    'clock':        ClockIcon,
    'warning':      ExclamationTriangleIcon,
    'exclamation':  ExclamationTriangleIcon,
};

// ── Tooltip compartido ────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, moneyKey = 'total' }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-slate-900 text-white rounded-xl px-4 py-3 shadow-xl text-xs">
            <p className="font-black text-slate-300 uppercase tracking-wider mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="font-bold">
                    {p.name === moneyKey
                        ? `S/ ${parseFloat(p.value).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
                        : `${p.value}`
                    }
                </p>
            ))}
        </div>
    );
};

// ── StatRow — fila horizontal ─────────────────────────────────────────────────
const StatRow = ({ label, valor, tipo, icon, alerta = false }) => {
    const Icon = ICONS[icon] || BanknotesIcon;
    const formatted = tipo === 'monto'
        ? `S/ ${parseFloat(valor || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
        : tipo === 'fecha' ? (valor ?? 'N/A') : (valor?.toLocaleString() ?? '0');

    return (
        <div className={`relative flex items-center gap-4 bg-white rounded-2xl border px-5 py-4 shadow-sm transition-all hover:shadow-md
            ${alerta ? 'border-brand-red/30 bg-brand-red-light/20' : 'border-slate-100'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                ${alerta ? 'bg-brand-red text-white' : 'bg-brand-red-light text-brand-red'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
                <p className={`text-2xl font-black tracking-tight leading-none ${alerta ? 'text-brand-red' : 'text-slate-900'}`}>
                    {formatted}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
            </div>
            {alerta && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-brand-red animate-pulse" />}
        </div>
    );
};

// ── Gráfica reutilizable ──────────────────────────────────────────────────────
const GraficaArea = ({ data, xKey, dataKey = 'total', label, color = '#8B1A1A', height = 200 }) => (
    <div>
        {label && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>}
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <defs>
                    <linearGradient id={`grad_${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey={xKey} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={v => `S/${v}`} />
                <Tooltip content={<CustomTooltip moneyKey={dataKey} />} />
                <Area type="monotone" dataKey={dataKey} name={dataKey} stroke={color} strokeWidth={2} fill={`url(#grad_${dataKey})`} dot={{ r: 2, fill: color }} activeDot={{ r: 4 }} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const GraficaBarra = ({ data, xKey, dataKey = 'total', label, color = '#8B1A1A', isMoney = true, height = 180 }) => (
    <div>
        {label && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>}
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 0, right: 5, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey={xKey} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} axisLine={false} tickLine={false}
                    tickFormatter={isMoney ? v => `S/${v}` : undefined} allowDecimals={false} />
                <Tooltip content={<CustomTooltip moneyKey={isMoney ? dataKey : '__none__'} />} />
                <Bar dataKey={dataKey} name={dataKey} fill={color} radius={[5, 5, 0, 0]} maxBarSize={36} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

// ── DashboardCard — componente principal ──────────────────────────────────────
/**
 * Props:
 * - title: string — título del módulo
 * - subtitle: string — subtítulo
 * - icon: string — clave de ICONS
 * - loading: bool
 * - cards: array — [{ label, valor, tipo, icon, alerta }]
 * - graficas: array — [{ tipo: 'area'|'barra', data, xKey, dataKey, label, color, isMoney, height }]
 * - tabs: array — [{ id, label }] — si no se pasa, se muestran solo cards
 * - tabActivo: string — tab seleccionado por defecto
 * - conFiltros: bool — mostrar filtros de fecha
 * - fechaInicio, setFechaInicio, fechaFin, setFechaFin
 * - onFiltrar, onLimpiar
 */
const DashboardCard = ({
    title,
    subtitle,
    icon = 'banknotes',
    loading = false,
    cards = [],
    graficas = [],
    tabs,
    tabActivo = 'cards',
    conFiltros = false,
    fechaInicio = '', setFechaInicio,
    fechaFin    = '', setFechaFin,
    onFiltrar, onLimpiar,
}) => {
    const Icon = ICONS[icon] || BanknotesIcon;
    const [tab,       setTab]       = useState(tabActivo);
    const [collapsed, setCollapsed] = useState(false);
    const tieneRango = fechaInicio || fechaFin;

    const tabsFinales    = tabs ?? [{ id: 'cards', label: 'Resumen' }];
    const graficasDelTab = graficas.filter(g => !g.tab || g.tab === tab);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* Header — click para colapsar */}
            <div
                className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-wrap gap-3 cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
                onClick={() => setCollapsed(v => !v)}
            >
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-brand-red-light rounded-xl">
                        <Icon className="w-5 h-5 text-brand-red" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</h2>
                        {subtitle && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Tabs — detener propagación para no colapsar al cambiar tab */}
                    {!collapsed && tabsFinales.length > 1 && (
                        <div className="flex gap-0.5 bg-slate-100 p-0.5 rounded-lg" onClick={e => e.stopPropagation()}>
                            {tabsFinales.map(t => (
                                <button key={t.id} onClick={() => setTab(t.id)}
                                    className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                                        tab === t.id ? 'bg-brand-red text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                    }`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Ícono colapsar */}
                    <div className={`w-6 h-6 flex items-center justify-center text-slate-400 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Filtros de fecha */}
            {!collapsed && conFiltros && (
                <div className="px-6 py-3 border-b border-slate-50 bg-slate-50/50 flex flex-wrap items-end gap-3">
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Desde</label>
                        <input type="date" value={fechaInicio} onChange={e => setFechaInicio?.(e.target.value)}
                            className="p-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" />
                    </div>
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hasta</label>
                        <input type="date" value={fechaFin} onChange={e => setFechaFin?.(e.target.value)}
                            className="p-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" />
                    </div>
                    <button onClick={onFiltrar} disabled={loading}
                        className="flex items-center gap-1.5 px-4 py-2 bg-brand-red text-white text-[10px] font-black uppercase rounded-lg hover:bg-brand-red-dark transition-all disabled:opacity-50">
                        <MagnifyingGlassIcon className="w-3.5 h-3.5" />
                        Filtrar
                    </button>
                    {tieneRango && (
                        <button onClick={onLimpiar}
                            className="flex items-center gap-1 px-3 py-2 text-slate-400 hover:text-brand-red text-[10px] font-black uppercase rounded-lg border border-slate-200 hover:border-brand-red/30 transition-all">
                            <XMarkIcon className="w-3.5 h-3.5" />
                            Limpiar
                        </button>
                    )}
                    {tieneRango && (
                        <span className="text-[9px] font-black text-brand-red uppercase tracking-widest bg-brand-red-light px-2 py-1 rounded-lg border border-brand-red/20">
                            Rango personalizado
                        </span>
                    )}
                </div>
            )}

            {/* Contenido */}
            {!collapsed && (
            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-8 h-8 border-4 border-brand-red-light border-t-brand-red rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Cards — siempre visibles en tab 'cards' o si no hay tabs */}
                        {(tab === 'cards' || tabsFinales.length === 1) && cards.length > 0 && (
                            <div className="grid grid-cols-1 gap-3">
                                {cards.map((card, i) => <StatRow key={i} {...card} />)}
                            </div>
                        )}

                        {/* Gráficas del tab activo */}
                        {graficasDelTab.length === 0 && tab !== 'cards' && (
                            <div className="flex items-center justify-center h-40 text-slate-300 text-xs font-bold uppercase tracking-widest">
                                Sin datos en este período
                            </div>
                        )}
                        {graficasDelTab.map((g, i) => (
                            g.tipo === 'area'
                                ? <GraficaArea key={i} data={g.data} xKey={g.xKey} dataKey={g.dataKey} label={g.label} color={g.color} height={g.height} />
                                : <GraficaBarra key={i} data={g.data} xKey={g.xKey} dataKey={g.dataKey} label={g.label} color={g.color} isMoney={g.isMoney} height={g.height} />
                        ))}
                    </div>
                )}
            </div>
            )}
        </div>
    );
};

export { StatRow, GraficaArea, GraficaBarra, CustomTooltip };
export default DashboardCard;