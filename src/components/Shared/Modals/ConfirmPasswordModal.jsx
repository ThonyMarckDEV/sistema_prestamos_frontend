import React, { useEffect, useRef, useState } from 'react';
import { LockClosedIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ConfirmPasswordModal = ({ isOpen, onConfirm, onClose, loading, error }) => {
    const [password,    setPassword]    = useState('');
    const [showPass,    setShowPass]    = useState(false);
    const inputRef = useRef(null);

    // Limpiar al abrir/cerrar
    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setShowPass(false);
            // Focus automático con pequeño delay para esperar la animación
            setTimeout(() => inputRef.current?.focus(), 120);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password.trim() || loading) return;
        onConfirm(password);
    };

    if (!isOpen) return null;

    return (
        /* Backdrop */
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-sm mx-4 animate-[fadeInScale_0.2s_ease-out]">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                    {/* Header con banda roja */}
                    <div className="bg-gradient-to-br from-brand-red to-brand-red-dark px-6 pt-8 pb-6 flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
                            <LockClosedIcon className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-base font-black text-white uppercase tracking-widest">
                                Módulo Restringido
                            </h2>
                            <p className="text-[10px] text-white/70 font-bold mt-1 uppercase tracking-wider">
                                Verifica tu identidad para continuar
                            </p>
                        </div>
                    </div>

                    {/* Cuerpo */}
                    <div className="px-6 py-6">

                        {/* Aviso de seguridad */}
                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-5">
                            <ShieldCheckIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
                                Esta sección requiere confirmación adicional.
                                El acceso se mantendrá desbloqueado por <span className="font-black">5 minutos</span>.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Input contraseña */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        ref={inputRef}
                                        type={showPass ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        disabled={loading}
                                        className={`w-full border rounded-xl px-4 py-2.5 pr-10 text-sm font-bold
                                            focus:ring-2 focus:ring-brand-red outline-none transition-all
                                            disabled:opacity-50 disabled:bg-slate-50
                                            ${error
                                                ? 'border-red-400 bg-red-50 focus:ring-red-400'
                                                : 'border-slate-300 bg-white'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        tabIndex={-1}
                                    >
                                        {showPass
                                            ? <EyeSlashIcon className="w-4 h-4" />
                                            : <EyeIcon className="w-4 h-4" />
                                        }
                                    </button>
                                </div>

                                {/* Error */}
                                {error && (
                                    <p className="text-[10px] font-black text-red-500 uppercase mt-1.5 flex items-center gap-1">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 py-2.5 text-[11px] font-black text-slate-500 hover:bg-slate-100
                                        rounded-xl uppercase transition-all disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={!password.trim() || loading}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5
                                        bg-brand-red hover:bg-brand-red-dark text-white text-[11px] font-black
                                        uppercase rounded-xl transition-all shadow-md shadow-brand-red/20
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading
                                        ? <><ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> Verificando...</>
                                        : <><LockClosedIcon className="w-3.5 h-3.5" /> Confirmar</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPasswordModal;