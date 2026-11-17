import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Ticket, Gift, CalendarDays, CheckCircle2, XCircle, PartyPopper, X, ChevronRight } from 'lucide-react';
import { useMisSorteos } from 'hooks/Sorteo/useMisSorteos';
import { formatFecha, formatFechaLarga, diasRestantes } from 'components/Shared/Formularios/Sorteo/sorteoUtils';

const textoDias = (n) => {
    if (n === null || n < 0) return null;
    if (n === 0) return 'hoy';
    if (n === 1) return 'falta 1 día';
    return `faltan ${n} días`;
};

/** Texto corto del estado para el ticket chiquito. */
const estadoCorto = (s) => {
    if (s.situacion === 'PARTICIPANDO') return { txt: '¡Participando!', ok: true };
    if (s.situacion === 'NO_PARTICIPA') return { txt: 'No participas', ok: false };
    if (s.cumple) return { txt: 'Vas bien', ok: true };
    const faltan = s.condiciones.filter((c) => !c.cumple).length;
    return { txt: `Te ${faltan === 1 ? 'falta 1 requisito' : `faltan ${faltan} requisitos`}`, ok: false };
};

/* ── Ticket chiquito (va en el saludo) ───────────────────────────────────── */
const MiniTicket = ({ s, onClick }) => {
    const participa = s.situacion === 'PARTICIPANDO';
    const est       = estadoCorto(s);

    return (
        <button
            onClick={onClick}
            title={`Ver detalle: ${s.nombre}`}
            className={`group relative flex items-stretch rounded-xl overflow-hidden text-left shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95 ${
                participa
                    ? 'bg-yellow-300 text-red-900'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
            }`}
        >
            <div className="flex items-center gap-2 pl-3 pr-3 py-2">
                <Ticket size={18} className={participa ? 'text-red-900' : 'text-yellow-300'} />
                <div className="leading-tight">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-70 max-w-[130px] truncate">{s.nombre}</p>
                    <p className="text-xs font-black flex items-center gap-1">
                        {!participa && (est.ok
                            ? <CheckCircle2 size={12} className="text-emerald-400" />
                            : <XCircle size={12} className="text-red-400" />)}
                        {est.txt}
                    </p>
                </div>
            </div>

            {/* separador perforado */}
            <div className={`relative border-l-2 border-dashed ${participa ? 'border-red-900/30' : 'border-white/25'}`}>
                <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-black dark:bg-dark-surface" />
                <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-black dark:bg-dark-surface" />
            </div>

            <div className="flex items-center gap-1 px-3">
                <div className="leading-tight text-center">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-70">Boleto N°</p>
                    <p className={`font-mono font-black text-sm tracking-wider ${participa ? '' : 'text-yellow-300'}`}>{s.numero_boleto}</p>
                </div>
                <ChevronRight size={14} className="opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </div>
        </button>
    );
};

/* ── Contenido del modal ─────────────────────────────────────────────────── */
const DetalleBoleto = ({ s }) => (
    <>
        <div className="bg-gradient-to-br from-red-900 to-red-700 p-6 text-white text-center relative overflow-hidden">
            <PartyPopper size={28} className="mx-auto text-yellow-300 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">¡Ya estás participando!</p>
            <h3 className="text-lg font-black mt-1">{s.nombre}</h3>
            <Ticket size={120} className="absolute -bottom-8 -right-6 text-white/5 rotate-12" />
        </div>

        <div className="relative h-0 border-t-2 border-dashed border-yellow-300">
            <span className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-slate-900/60" />
            <span className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-slate-900/60" />
        </div>

        <div className="bg-yellow-300 text-red-900 text-center py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.25em]">Tu boleto N°</p>
            <p className="text-5xl font-black font-mono tracking-wider leading-none mt-1">{s.numero_boleto}</p>
        </div>

        <div className="p-5 space-y-2 bg-white dark:bg-dark-surface">
            {s.premio && <Dato icon={Gift} label="Premio" value={s.premio} />}
            {s.fecha_sorteo && <Dato icon={CalendarDays} label="Fecha del sorteo" value={formatFechaLarga(s.fecha_sorteo)} />}
            <p className="text-xs text-slate-500 dark:text-dark-text-muted text-center pt-2">
                Tu talón ya está en el ánfora. Recoge tu boleto impreso en la oficina. ¡Mucha suerte!
            </p>
        </div>
    </>
);

const DetalleRequisitos = ({ s }) => {
    const noParticipa = s.situacion === 'NO_PARTICIPA';
    const dias        = textoDias(diasRestantes(s.fecha_cierre));
    const est         = estadoCorto(s);

    return (
        <>
            <div className="bg-black dark:bg-dark-surface-alt p-5 text-white">
                <div className="flex items-center gap-2">
                    <Ticket size={18} className="text-yellow-300" />
                    <h3 className="text-lg font-black tracking-tight">{s.nombre}</h3>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-white/80">
                    {s.premio && <span className="flex items-center gap-1"><Gift size={13} className="text-yellow-300" /> {s.premio}</span>}
                    {s.fecha_sorteo && <span className="flex items-center gap-1"><CalendarDays size={13} className="text-yellow-300" /> Sorteo: {formatFecha(s.fecha_sorteo)}</span>}
                </div>
            </div>

            <div className="p-5 bg-white dark:bg-dark-surface space-y-4">
                {s.fecha_cierre && !noParticipa && (
                    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-brand-red-glow/10 border border-red-100 dark:border-brand-red-glow/30">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-red-900 dark:text-brand-gold">Cumple antes del</p>
                            <p className="text-sm font-black text-slate-800 dark:text-dark-text capitalize">{formatFechaLarga(s.fecha_cierre)}</p>
                        </div>
                        {dias && <span className="shrink-0 text-[11px] font-black text-red-700 dark:text-red-300 uppercase">{dias}</span>}
                    </div>
                )}

                <p className={`text-sm font-black ${est.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-dark-text'}`}>
                    {noParticipa
                        ? 'Esta vez no alcanzaste a participar.'
                        : s.cumple ? '¡Vas bien! Hoy cumples todo:' : 'Para participar te falta:'}
                </p>

                <ul className="space-y-2">
                    {s.condiciones.map((c) => (
                        <li key={c.clave} className="flex items-start gap-2.5">
                            {c.cumple
                                ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                : <XCircle size={18} className="text-red-500 shrink-0" />}
                            <div className="leading-tight">
                                <p className={`text-sm font-bold ${c.cumple ? 'text-slate-500 dark:text-dark-text-muted' : 'text-slate-800 dark:text-dark-text'}`}>{c.texto}</p>
                                <p className={`text-[11px] ${c.cumple ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{c.detalle}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                <p className="text-xs text-slate-500 dark:text-dark-text-muted pt-1 border-t border-slate-100 dark:border-dark-border">
                    {noParticipa
                        ? 'Los boletos ya se generaron. Sigue pagando puntual para entrar al próximo sorteo.'
                        : <>Si cumples todo hasta la fecha de cierre, tu boleto será el <b className="font-mono text-red-900 dark:text-brand-gold">N° {s.numero_boleto}</b>.</>}
                </p>
            </div>
        </>
    );
};

const Dato = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3">
        <Icon size={16} className="text-red-900 dark:text-brand-gold shrink-0" />
        <p className="text-sm">
            <span className="text-slate-400 dark:text-dark-text-muted text-xs font-bold uppercase mr-1">{label}:</span>
            <span className="font-bold text-slate-800 dark:text-dark-text capitalize">{value}</span>
        </p>
    </div>
);

const SorteoModal = ({ s, onClose }) => {
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    // Portal a <body>: así el modal queda por encima de TODO (sidebar, header, etc.)
    // y no lo recorta el overflow/z-index del recuadro del saludo.
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-transparent dark:border-dark-border">
                <button onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors"
                    aria-label="Cerrar">
                    <X size={16} />
                </button>
                {s.situacion === 'PARTICIPANDO' ? <DetalleBoleto s={s} /> : <DetalleRequisitos s={s} />}
            </div>
        </div>,
        document.body
    );
};

/** Tickets chiquitos de los sorteos vigentes del cliente; el detalle se abre en un modal. */
const MisSorteos = ({ enabled }) => {
    const { sorteos, loading } = useMisSorteos(enabled);
    const [abierto, setAbierto] = useState(null);

    if (!enabled || loading || sorteos.length === 0) return null;

    return (
        <>
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
                {sorteos.map((s) => <MiniTicket key={s.id} s={s} onClick={() => setAbierto(s)} />)}
            </div>
            {abierto && <SorteoModal s={abierto} onClose={() => setAbierto(null)} />}
        </>
    );
};

export default MisSorteos;
