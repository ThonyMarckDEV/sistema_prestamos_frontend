import React from 'react';
import { TicketIcon, FunnelIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { describirCriterios } from './sorteoUtils';

const labelCls = 'block text-[10px] font-black text-slate-400 dark:text-dark-text-muted uppercase mb-2 ml-1 tracking-widest transition-colors';
const inputCls = 'w-full p-3.5 bg-slate-50 dark:bg-dark-surface-alt border border-slate-200 dark:border-dark-border rounded-2xl font-bold text-sm text-slate-800 dark:text-dark-text outline-none focus:ring-2 focus:ring-brand-red dark:focus:ring-brand-gold focus:border-brand-red dark:focus:border-brand-gold placeholder-slate-400 dark:placeholder-dark-text-muted/60 transition-all';
const cardCls  = 'bg-white dark:bg-dark-surface p-6 md:p-8 rounded-[32px] border border-slate-100 dark:border-dark-border shadow-sm dark:shadow-black/25 transition-colors';

const Toggle = ({ checked, onChange, title, hint }) => (
    <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
            checked
                ? 'border-brand-red/40 bg-brand-red-light dark:bg-brand-red-glow/10 dark:border-brand-gold/40'
                : 'border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface-alt'
        }`}
    >
        <span className={`mt-0.5 shrink-0 w-10 h-6 rounded-full p-0.5 transition-colors ${checked ? 'bg-brand-red dark:bg-brand-gold' : 'bg-slate-300 dark:bg-dark-border'}`}>
            <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
        </span>
        <span>
            <span className="block text-sm font-black text-slate-800 dark:text-dark-text">{title}</span>
            {hint && <span className="block text-xs text-slate-500 dark:text-dark-text-muted mt-0.5">{hint}</span>}
        </span>
    </button>
);

const SorteoForm = ({ formData, handleChange, handleSubmit, loading, isEdit = false, estado = 1 }) => {
    const evaluaHistorial = formData.max_dias_atraso !== '' && formData.max_dias_atraso !== null;
    const criterios       = describirCriterios(formData);

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
            {/* ── Datos del sorteo ─────────────────────────────── */}
            <div className={`${cardCls} lg:col-span-2 space-y-5`}>
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-red dark:text-brand-gold">
                    <TicketIcon className="w-5 h-5" /> Datos del sorteo
                </h3>

                <div>
                    <label className={labelCls}>Nombre *</label>
                    <input className={inputCls} value={formData.nombre} required maxLength={150}
                        placeholder="Ej: Gran Sorteo Navideño 2026"
                        onChange={(e) => handleChange('nombre', e.target.value)} />
                </div>

                <div>
                    <label className={labelCls}>Premio</label>
                    <input className={inputCls} value={formData.premio} maxLength={255}
                        placeholder="Ej: Televisor Smart 55 pulgadas"
                        onChange={(e) => handleChange('premio', e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Fecha de cierre</label>
                        <input type="date" className={inputCls} value={formData.fecha_cierre}
                            max={formData.fecha_sorteo || undefined}
                            onChange={(e) => handleChange('fecha_cierre', e.target.value)} />
                        <p className="text-[10px] text-slate-400 dark:text-dark-text-muted mt-1 ml-1">Hasta cuándo deben cumplir los requisitos.</p>
                    </div>
                    <div>
                        <label className={labelCls}>Fecha del sorteo</label>
                        <input type="date" className={inputCls} value={formData.fecha_sorteo}
                            onChange={(e) => handleChange('fecha_sorteo', e.target.value)} />
                    </div>
                </div>

                <div>
                    <label className={labelCls}>Descripción</label>
                    <textarea rows={4} className={`${inputCls} resize-none`} value={formData.descripcion} maxLength={2000}
                        placeholder="Bases, lugar del sorteo, etc."
                        onChange={(e) => handleChange('descripcion', e.target.value)} />
                </div>
            </div>

            {/* ── Criterios ─────────────────────────────────────── */}
            <div className={`${cardCls} lg:col-span-3 space-y-5`}>
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-red dark:text-brand-gold">
                    <FunnelIcon className="w-5 h-5" /> ¿Quiénes participan?
                </h3>

                {isEdit && estado === 2 && (
                    <div className="flex gap-2 p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-xs text-amber-800 dark:text-amber-300">
                        <InformationCircleIcon className="w-5 h-5 shrink-0" />
                        Este sorteo ya tiene boletos. Si cambias algún criterio, los boletos se borran y tendrás que generarlos de nuevo. Cambiar nombre, premio o fechas no borra nada.
                    </div>
                )}

                <div>
                    <label className={labelCls}>Tipo de préstamo</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[['INDIVIDUAL', 'Individual'], ['GRUPAL', 'Grupal'], ['AMBOS', 'Ambos']].map(([v, l]) => (
                            <button key={v} type="button" onClick={() => handleChange('tipo_prestamo', v)}
                                className={`py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all ${
                                    formData.tipo_prestamo === v
                                        ? 'bg-brand-red dark:bg-brand-red-glow text-white dark:text-black border-transparent shadow-md'
                                        : 'bg-slate-50 dark:bg-dark-surface-alt text-slate-500 dark:text-dark-text-muted border-slate-200 dark:border-dark-border hover:border-slate-300'
                                }`}>
                                {l}
                            </button>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-dark-text-muted mt-1 ml-1">"Ambos" = cualquiera de los dos tipos.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Toggle checked={!!formData.requiere_activo}
                        onChange={(v) => handleChange('requiere_activo', v)}
                        title="Préstamo vigente"
                        hint="Debe tener al menos 1 préstamo activo." />
                    <Toggle checked={!!formData.sin_cuotas_vencidas}
                        onChange={(v) => handleChange('sin_cuotas_vencidas', v)}
                        title="Al día"
                        hint="Ninguna cuota vencida sin pagar." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Mínimo de préstamos liquidados</label>
                        <input type="number" min={0} max={50} className={inputCls} value={formData.min_liquidados}
                            onChange={(e) => handleChange('min_liquidados', e.target.value)} required />
                    </div>
                    <div>
                        <label className={labelCls}>Historial de puntualidad</label>
                        <select className={inputCls}
                            value={evaluaHistorial ? 'si' : 'no'}
                            onChange={(e) => handleChange('max_dias_atraso', e.target.value === 'si' ? '0' : '')}>
                            <option value="no">No revisar</option>
                            <option value="si">Revisar</option>
                        </select>
                    </div>
                </div>

                {evaluaHistorial && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface-alt border border-slate-200 dark:border-dark-border">
                        <div>
                            <label className={labelCls}>Máx. días útiles de atraso</label>
                            <input type="number" min={0} max={365} className={`${inputCls} bg-white dark:bg-dark-surface`} value={formData.max_dias_atraso}
                                onChange={(e) => handleChange('max_dias_atraso', e.target.value)} />
                            <p className="text-[10px] text-slate-400 dark:text-dark-text-muted mt-1 ml-1">0 = nunca pagó tarde.</p>
                        </div>
                        <div>
                            <label className={labelCls}>Evaluar desde</label>
                            <input type="date" className={`${inputCls} bg-white dark:bg-dark-surface`} value={formData.evaluar_desde}
                                onChange={(e) => handleChange('evaluar_desde', e.target.value)} />
                            <p className="text-[10px] text-slate-400 dark:text-dark-text-muted mt-1 ml-1">Vacío = todo el historial.</p>
                        </div>
                    </div>
                )}

                <div className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-dark-border">
                    <p className={labelCls}>Resumen</p>
                    <ul className="space-y-1">
                        {criterios.map((c) => (
                            <li key={c} className="text-xs font-bold text-slate-600 dark:text-dark-text flex gap-2">
                                <span className="text-brand-red dark:text-brand-gold">•</span>{c}
                            </li>
                        ))}
                    </ul>
                    <p className="text-[10px] text-slate-400 dark:text-dark-text-muted mt-2">
                        Siempre quedan fuera: préstamos prendarios, integrantes refinanciados, clientes castigados y usuarios inactivos.
                    </p>
                </div>

                <button type="submit" disabled={loading}
                    className="w-full py-4 bg-brand-red dark:bg-brand-red-glow text-white dark:text-black font-black uppercase rounded-2xl hover:bg-brand-red-dark dark:hover:brightness-110 transition-all shadow-xl shadow-brand-red/30 dark:shadow-black/30 disabled:opacity-50 tracking-widest active:scale-95">
                    {loading ? 'Guardando...' : (isEdit ? 'Actualizar sorteo' : 'Registrar sorteo')}
                </button>
            </div>
        </form>
    );
};

export default SorteoForm;
