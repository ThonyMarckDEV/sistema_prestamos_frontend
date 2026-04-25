import React, { useState } from 'react';
import { UserIcon, KeyIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const UsuarioForm = ({ form, handleNestedChange, isEditing = false }) => {
    const [showPass,    setShowPass]    = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const pass    = form.usuario.password || '';
    const confirm = form.usuario.password_confirmation || '';
    const noCoinciden = pass && confirm && pass !== confirm;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <UserIcon className="w-5 h-5 text-brand-red" /> Credenciales y Acceso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nombre de Usuario *
                        {!isEditing && (
                            <span className="ml-2 text-[10px] font-normal text-slate-400 normal-case">
                                (generado automáticamente)
                            </span>
                        )}
                    </label>
                    <div className="relative">
                        <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400"/>
                        <input
                            type="text"
                            value={form.usuario.username || ''}
                            onChange={(e) => isEditing && handleNestedChange('usuario', 'username', e.target.value.toUpperCase())}
                            readOnly={!isEditing}
                            className={`w-full pl-9 p-2.5 text-sm border rounded-xl outline-none transition-all ${
                                isEditing
                                    ? 'text-slate-800 border-slate-300 focus:ring-2 focus:ring-brand-red'
                                    : 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed'
                            }`}
                            placeholder="Se genera con nombre y apellidos"
                            required
                        />
                    </div>
                </div>

                {/* Password — solo en update */}
                {isEditing && (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Nueva Contraseña
                                <span className="text-xs text-slate-400 font-normal normal-case ml-1">(Opcional)</span>
                            </label>
                            <div className="relative">
                                <KeyIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400"/>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={pass}
                                    onChange={(e) => handleNestedChange('usuario', 'password', e.target.value)}
                                    className="w-full pl-9 pr-10 p-2.5 text-sm text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                                    placeholder="Dejar vacío para mantener"
                                    minLength={8}
                                />
                                <button type="button" onClick={() => setShowPass(v => !v)}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-brand-red transition-colors">
                                    {showPass ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                                Confirmar Contraseña
                                <span className="text-xs text-slate-400 font-normal normal-case ml-1">(Opcional)</span>
                            </label>
                            <div className="relative">
                                <LockClosedIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400"/>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirm}
                                    onChange={(e) => handleNestedChange('usuario', 'password_confirmation', e.target.value)}
                                    className={`w-full pl-9 pr-10 p-2.5 text-sm text-slate-800 border rounded-xl outline-none focus:ring-2 ${
                                        noCoinciden
                                            ? 'border-brand-red focus:ring-brand-red bg-brand-red-light'
                                            : confirm && !noCoinciden
                                                ? 'border-green-400 focus:ring-green-400 bg-green-50'
                                                : 'border-slate-300 focus:ring-brand-red'
                                    }`}
                                    placeholder="Repita la contraseña"
                                />
                                <button type="button" onClick={() => setShowConfirm(v => !v)}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-brand-red transition-colors">
                                    {showConfirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </div>
                            {noCoinciden && (
                                <p className="text-[10px] text-brand-red mt-1 font-bold animate-pulse">⚠ Las contraseñas no coinciden.</p>
                            )}
                            {confirm && !noCoinciden && pass && (
                                <p className="text-[10px] text-green-600 mt-1 font-bold">✓ Las contraseñas coinciden.</p>
                            )}
                        </div>
                    </>
                )}

                {/* Info en store */}
                {!isEditing && (
                    <div className="md:col-span-2 p-3 bg-brand-gold-light border border-brand-gold/30 rounded-xl">
                        <p className="text-[11px] font-bold text-brand-gold-dark">
                            🔒 La contraseña inicial será el <span className="font-black">DNI</span> del cliente (o RUC si es empresa).
                            Se le enviará un correo de bienvenida con sus datos de acceso.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default UsuarioForm;