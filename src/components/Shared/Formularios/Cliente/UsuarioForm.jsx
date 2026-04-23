import React, { useState } from 'react';
import { UserIcon, KeyIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toUpper } from 'utilities/Validations/validations';

const UsuarioForm = ({ form, handleNestedChange, isEditing = false }) => {
    const [showPass,    setShowPass]    = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const pass    = form.usuario.password || '';
    const confirm = form.usuario.password_confirmation || '';
    const noCoinciden = pass && confirm && pass !== confirm;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <UserIcon className="w-5 h-5" /> Credenciales y Acceso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Username */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Nombre de Usuario <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <UserIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            value={form.usuario.username || ''}
                            onChange={(e) => handleNestedChange('usuario', 'username', toUpper(e.target.value))}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="Ej: JPEREZ"
                            required
                        />
                    </div>
                </div>

                {/* Contraseña */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Contraseña {isEditing
                            ? <span className="text-xs text-gray-400 font-normal normal-case">(Opcional al editar)</span>
                            : <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                        <KeyIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type={showPass ? 'text' : 'password'}
                            value={pass}
                            onChange={(e) => handleNestedChange('usuario', 'password', e.target.value)}
                            className="w-full pl-9 pr-10 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder={isEditing ? "Dejar vacío para mantener" : "Mínimo 6 caracteres"}
                            required={!isEditing}
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(v => !v)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-slate-700 transition-colors"
                        >
                            {showPass
                                ? <EyeSlashIcon className="w-4 h-4" />
                                : <EyeIcon className="w-4 h-4" />
                            }
                        </button>
                    </div>
                </div>

                {/* Confirmar */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Confirmar Contraseña {isEditing
                            ? <span className="text-xs text-gray-400 font-normal normal-case">(Opcional)</span>
                            : <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                        <LockClosedIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirm}
                            onChange={(e) => handleNestedChange('usuario', 'password_confirmation', e.target.value)}
                            className={`w-full pl-9 pr-10 p-2.5 text-sm border rounded-lg focus:ring-1 outline-none ${
                                noCoinciden
                                    ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                    : confirm && !noCoinciden
                                        ? 'border-green-400 focus:ring-green-400 bg-green-50'
                                        : 'border-slate-300 focus:ring-black'
                            }`}
                            placeholder="Repita la contraseña"
                            required={!isEditing}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(v => !v)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-slate-700 transition-colors"
                        >
                            {showConfirm
                                ? <EyeSlashIcon className="w-4 h-4" />
                                : <EyeIcon className="w-4 h-4" />
                            }
                        </button>
                    </div>
                    {noCoinciden && (
                        <p className="text-[10px] text-red-500 mt-1 font-bold animate-pulse">⚠ Las contraseñas no coinciden.</p>
                    )}
                    {confirm && !noCoinciden && pass && (
                        <p className="text-[10px] text-green-600 mt-1 font-bold">✓ Las contraseñas coinciden.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default UsuarioForm;