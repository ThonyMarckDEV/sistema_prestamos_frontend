import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
    BellIcon, InboxIcon, 
    ArrowPathIcon, ChevronDownIcon, ChevronUpIcon 
} from '@heroicons/react/24/outline';
import { useNotificacionesGlobal } from './NotificacionContext';

const NotificacionItem = ({ n, handleMarcarLeida, formatTiempo }) => {
    const [esExpandida, setEsExpandida] = useState(false);
    const [esLarga, setEsLarga] = useState(false);
    const textRef = useRef(null);

    useLayoutEffect(() => {
        if (textRef.current) {
            const isTruncated = textRef.current.scrollHeight > textRef.current.clientHeight;
            setEsLarga(isTruncated);
        }
    }, [n.mensaje]);

    const toggleExpandir = (e) => {
        e.stopPropagation();
        setEsExpandida(!esExpandida);
    };

    return (
        <div onClick={() => !n.leido && handleMarcarLeida(n.id)}
            className={`px-4 py-4 border-b border-slate-50 flex gap-3 items-start transition-all cursor-pointer group ${n.leido ? 'bg-white opacity-70' : 'bg-blue-50/30 hover:bg-blue-50/60'}`}
        >
            {!n.leido && <span className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                    <p className={`text-xs leading-snug ${n.leido ? 'font-medium text-slate-600' : 'font-black text-slate-900'}`}>{n.titulo}</p>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{formatTiempo(n.created_at)}</span>
                </div>
                
                {/* Referencia atada al texto para medirlo */}
                <p 
                    ref={textRef}
                    className={`text-[11px] text-slate-500 leading-relaxed transition-all ${esExpandida ? '' : 'line-clamp-2'}`}
                >
                    {n.mensaje}
                </p>
                
                {/* Botón Ver más / Ver menos (Solo si la altura se desbordó) */}
                {esLarga && (
                    <button 
                        onClick={toggleExpandir}
                        className="mt-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                    >
                        {esExpandida ? (
                            <><ChevronUpIcon className="w-3 h-3" /> Ver menos</>
                        ) : (
                            <><ChevronDownIcon className="w-3 h-3" /> Ver más</>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default function NotificacionBell() {
    const { 
        notificaciones, noLeidas, cargando, 
        handleMarcarLeida, handleMarcarTodas, refresh 
    } = useNotificacionesGlobal();

    const [abierto, setAbierto] = useState(false);
    const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });
    
    const buttonRef = useRef(null);
    const panelRef = useRef(null);

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
            setPanelPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
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
        <div ref={panelRef} style={{ top: panelPos.top, right: panelPos.right }}
            className="fixed w-80 max-h-[550px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-[99999] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150"
        >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">Notificaciones</span>
                    {noLeidas > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{noLeidas}</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={refresh} disabled={cargando} className="p-1.5 text-slate-400 hover:text-blue-600 disabled:opacity-50">
                        <ArrowPathIcon className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
                    </button>
                    {noLeidas > 0 && (
                        <button onClick={handleMarcarTodas} className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                            Marcar todo leído
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white">
                {cargando && notificaciones.length === 0 ? (
                    <div className="py-14 flex flex-col items-center gap-2 opacity-50">
                        <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                ) : notificaciones.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                        <InboxIcon className="w-6 h-6 opacity-20" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bandeja Vacía</span>
                    </div>
                ) : (
                    notificaciones.map((n) => (
                        <NotificacionItem 
                            key={n.id} 
                            n={n} 
                            handleMarcarLeida={handleMarcarLeida} 
                            formatTiempo={formatTiempo} 
                        />
                    ))
                )}
            </div>
        </div>,
        document.body
    );

    return (
        <>
            <button ref={buttonRef} onClick={togglePanel}
                className={`relative p-2 rounded-xl transition-all ${abierto ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
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