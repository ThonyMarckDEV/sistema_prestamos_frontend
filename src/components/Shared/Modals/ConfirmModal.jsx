import React, { useState, useRef } from 'react';
import { ExclamationTriangleIcon, KeyIcon } from '@heroicons/react/24/outline';

/**
 * Modal de confirmación reutilizable.
 *
 * Props estándar:
 *   title, message, onConfirm, onCancel, confirmText, cancelText
 *
 * Props para PIN:
 *   requirePin  - boolean — si true muestra inputs de PIN antes de confirmar
 *   onConfirm   - fn(pin?: string) — recibe el PIN si requirePin=true
 */
const ConfirmModal = ({
    title       = "¿Estás seguro?",
    message,
    onConfirm,
    onCancel,
    confirmText = 'Sí, continuar',
    cancelText  = 'Cancelar',
    requirePin  = false,
}) => {
    const [digits, setDigits]   = useState(['', '', '', '', '', '']);
    const inputsRef             = useRef([]);

    const handleChange = (index, value) => {
        const val  = value.replace(/\D/, '').slice(-1);
        const next = [...digits];
        next[index] = val;
        setDigits(next);
        if (val && index < 5) inputsRef.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setDigits(pasted.split(''));
            inputsRef.current[5]?.focus();
        }
        e.preventDefault();
    };

    const pin      = digits.join('');
    const canSubmit = !requirePin || pin.length === 6;

    const handleConfirm = () => {
        if (!canSubmit) return;
        onConfirm(requirePin ? pin : undefined);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100">
                <div className="p-6">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-5">
                        <ExclamationTriangleIcon className="h-7 w-7 text-brand-red" />
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{title}</h3>
                        <p className="mt-2 text-sm text-slate-500 font-medium">{message}</p>
                    </div>

                    {/* PIN inputs — solo si requirePin=true */}
                    {requirePin && (
                        <div className="mt-5">
                            <div className="flex items-center gap-1.5 justify-center mb-3">
                                <KeyIcon className="w-3.5 h-3.5 text-slate-400" />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                    PIN de Autorización
                                </p>
                            </div>
                            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                                {digits.map((d, i) => (
                                    <input
                                        key={i}
                                        ref={el => inputsRef.current[i] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={d}
                                        onChange={e => handleChange(i, e.target.value)}
                                        onKeyDown={e => handleKeyDown(i, e)}
                                        className={`w-10 h-11 text-center text-base font-black rounded-xl border-2 outline-none transition-all
                                            ${d ? 'border-brand-red bg-brand-red-light text-brand-red' : 'border-slate-200 bg-slate-50 text-slate-700'}
                                            focus:border-brand-red focus:ring-2 focus:ring-brand-red/20`}
                                    />
                                ))}
                            </div>
                            <p className="text-[9px] text-slate-400 text-center mt-2 font-medium">
                                Solicita el PIN a un administrador para continuar.
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 px-4 py-4 flex flex-col-reverse sm:flex-row justify-center gap-3">
                    <button
                        type="button" onClick={onCancel}
                        className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-100 transition-all active:scale-95 uppercase tracking-wide"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button" onClick={handleConfirm} disabled={!canSubmit}
                        className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent bg-brand-red px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-brand-red-dark transition-all active:scale-95 uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;