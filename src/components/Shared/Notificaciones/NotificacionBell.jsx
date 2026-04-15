import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BellIcon, CheckCircleIcon, InboxIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useNotificacion } from 'hooks/notificaciones/useNotificacion';

export default function NotificacionBell() {
    const { 
        notificaciones, noLeidas, cargando, 
        handleMarcarLeida, handleMarcarTodas, 
        refresh 
    } = useNotificacion();

    const [abierto, setAbierto] = useState(false);
    const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });
    const buttonRef = useRef(null);
    const panelRef = useRef(null);

    // Cerrar al click fuera
    useEffect(() => {
        if (!abierto) return;
        const handler = (e) => {
            if (!buttonRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) {
                setAbierto(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [abierto]);

    const togglePanel = () => {
        if (!abierto && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPanelPos({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
        setAbierto((v) => !v);
    };

    const formatTiempo = (isoString) => {
        const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
        if (diff < 60) return 'ahora';
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        return `${Math.floor(diff / 86400)}d`;
    };

    const panel = abierto && createPortal(
        <div
            ref={panelRef}
            style={{ top: panelPos.top, right: panelPos.right }}
            className="fixed w-80 max-h-[450px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-[99999] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150"
        >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <span className="text-sm font-bold text-slate-800">Notificaciones</span>
                
                <div className="flex items-center gap-2">
                    {/* Botón Refrescar */}
                    <button
                        onClick={refresh}
                        disabled={cargando}
                        title="Actualizar notificaciones"
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                    >
                        <ArrowPathIcon className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
                    </button>

                    {/* Botón Marcar todo como leído */}
                    {noLeidas > 0 && (
                        <button
                            onClick={handleMarcarTodas}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                        >
                            Marcar todo leído
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                {cargando ? (
                    <div className="py-10 flex flex-col items-center gap-2 opacity-50">
                        <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                        <span className="text-xs font-medium">Cargando...</span>
                    </div>
                ) : notificaciones.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                        <InboxIcon className="w-8 h-8 opacity-20" />
                        <span className="text-xs font-bold uppercase tracking-widest">Sin notificaciones</span>
                    </div>
                ) : (
                    notificaciones.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => !n.leido && handleMarcarLeida(n.id)}
                            className={`px-4 py-3 border-b border-slate-50 flex gap-3 items-start transition-all cursor-pointer relative group ${
                                n.leido ? 'bg-white opacity-70' : 'bg-blue-50/40 hover:bg-blue-50'
                            }`}
                        >
                            {!n.leido && (
                                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className={`text-xs leading-tight mb-0.5 ${n.leido ? 'font-medium text-slate-600' : 'font-bold text-slate-900'}`}>
                                    {n.titulo}
                                </p>
                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                    {n.mensaje}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                    {formatTiempo(n.created_at)}
                                </p>
                            </div>
                            {!n.leido && (
                                <CheckCircleIcon className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>,
        document.body
    );

    return (
        <>
            <button
                ref={buttonRef}
                onClick={togglePanel}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all active:scale-90"
            >
                <BellIcon className="w-6 h-6" />
                {noLeidas > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white">
                        {noLeidas > 99 ? '99+' : noLeidas}
                    </span>
                )}
            </button>
            {panel}
        </>
    );
}