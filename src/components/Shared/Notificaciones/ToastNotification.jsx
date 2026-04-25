import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

// ── Singleton store ───────────────────────────────────────────────────────────
let listeners = [];
let toasts = [];
let nextId = 0;

const store = {
    subscribe: (fn) => {
        listeners.push(fn);
        // Entregar toasts pendientes inmediatamente al nuevo subscriber
        if (toasts.length > 0) fn([...toasts]);
        return () => { listeners = listeners.filter(l => l !== fn); };
    },
    notify: () => listeners.forEach(fn => fn([...toasts])),
    add: (toast) => {
        const id = ++nextId;
        toasts = [...toasts, { id, ...toast }];
        store.notify();
        if (toast.duration !== 0) {
            setTimeout(() => store.remove(id), toast.duration ?? 3500);
        }
        return id;
    },
    remove: (id) => {
        toasts = toasts.filter(t => t.id !== id);
        store.notify();
    },
};

// ── API pública ───────────────────────────────────────────────────────────────
export const notify = {
    success: (message, duration)  => store.add({ type: 'success', message, duration }),
    error:   (message, duration)  => store.add({ type: 'error',   message, duration }),
    warning: (message, duration)  => store.add({ type: 'warning', message, duration }),
    info:    (message, duration)  => store.add({ type: 'info',    message, duration }),
};

// ── Config por tipo ───────────────────────────────────────────────────────────
const CONFIG = {
    success: {
        icon: CheckCircleIcon,
        bar:  'bg-emerald-500',
        iconColor: 'text-emerald-500',
        bg:   'bg-white',
        border: 'border-emerald-100',
    },
    error: {
        icon: XCircleIcon,
        bar:  'bg-red-500',
        iconColor: 'text-red-500',
        bg:   'bg-white',
        border: 'border-red-100',
    },
    warning: {
        icon: ExclamationTriangleIcon,
        bar:  'bg-amber-400',
        iconColor: 'text-amber-500',
        bg:   'bg-white',
        border: 'border-amber-100',
    },
    info: {
        icon: InformationCircleIcon,
        bar:  'bg-blue-500',
        iconColor: 'text-blue-500',
        bg:   'bg-white',
        border: 'border-blue-100',
    },
};

// ── Toast individual ──────────────────────────────────────────────────────────
const Toast = ({ id, type, message, duration = 3500 }) => {
    const [visible, setVisible]   = useState(false);
    const [leaving, setLeaving]   = useState(false);
    const [paused,  setPaused]    = useState(false);
    const cfg  = CONFIG[type] ?? CONFIG.info;
    const Icon = cfg.icon;

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    // Timer que respeta la pausa
    useEffect(() => {
        if (duration === 0 || paused) return;
        const remaining = paused ? 0 : duration;
        const t = setTimeout(() => setLeaving(true), remaining - 400 > 0 ? remaining - 400 : remaining);
        const t2 = setTimeout(() => store.remove(id), remaining);
        return () => { clearTimeout(t); clearTimeout(t2); };
    }, [paused, duration, id]);

    const handleRemove = useCallback(() => {
        setLeaving(true);
        setTimeout(() => store.remove(id), 350);
    }, [id]);

    return (
        <div
            className={`
                relative flex items-start gap-3 w-80 rounded-2xl border shadow-xl px-4 py-3.5
                overflow-hidden cursor-pointer select-none
                transition-all duration-300 ease-out
                ${cfg.bg} ${cfg.border}
                ${visible && !leaving
                    ? 'opacity-100 translate-x-0 scale-100'
                    : 'opacity-0 translate-x-8 scale-95'}
            `}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Barra izquierda */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${cfg.bar}`} />

            {/* Ícono */}
            <div className="shrink-0 mt-0.5">
                <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
            </div>

            {/* Mensaje */}
            <p className="flex-1 text-sm font-semibold text-slate-800 leading-snug pr-2">
                {message}
            </p>

            {/* X */}
            <button
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="shrink-0 text-slate-300 hover:text-slate-500 transition-colors mt-0.5"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>

            {/* Barra de progreso */}
            {duration !== 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 rounded-b-2xl overflow-hidden">
                    <div
                        className={`h-full ${cfg.bar} opacity-40`}
                        style={{
                            animation: paused
                                ? 'none'
                                : `shrink ${duration}ms linear forwards`,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

// ── Contenedor global ─────────────────────────────────────────────────────────
export const ToastContainer = () => {
    const [list, setList] = useState([]);

    useEffect(() => store.subscribe(setList), []);

    return createPortal(
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to   { width: 0%; }
                }
            `}</style>
            {list.map(t => (
                <div key={t.id} className="pointer-events-auto">
                    <Toast {...t} />
                </div>
            ))}
        </div>,
        document.body
    );
};

export default notify;