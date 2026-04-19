import React from 'react';
import { UserIcon, KeyIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { toUpper } from 'utilities/Validations/validations';

const UsuarioForm = ({ form, handleNestedChange, isEditing = false }) => {
    const pass    = form.usuario.password || '';
    const confirm = form.usuario.password_confirmation || '';
    const noCoinciden = pass && confirm && pass !== confirm;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <UserIcon className="w-5 h-5" /> Credenciales y Acceso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Contraseña {isEditing
                            ? <span className="text-xs text-gray-400 font-normal normal-case">(Opcional al editar)</span>
                            : <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                        <KeyIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="password"
                            value={form.usuario.password || ''}
                            onChange={(e) => handleNestedChange('usuario', 'password', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder={isEditing ? "Dejar vacío para mantener" : "Mínimo 6 caracteres"}
                            required={!isEditing}
                            minLength={6}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Confirmar Contraseña {isEditing
                            ? <span className="text-xs text-gray-400 font-normal normal-case">(Opcional)</span>
                            : <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                        <LockClosedIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="password"
                            value={form.usuario.password_confirmation || ''}
                            onChange={(e) => handleNestedChange('usuario', 'password_confirmation', e.target.value)}
                            className={`w-full pl-9 p-2.5 text-sm border rounded-lg focus:ring-1 outline-none ${
                                noCoinciden ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-slate-300 focus:ring-black'
                            }`}
                            placeholder="Repita la contraseña"
                            required={!isEditing}
                        />
                    </div>
                    {noCoinciden && (
                        <p className="text-[10px] text-red-500 mt-1 font-bold animate-pulse">Las contraseñas no coinciden.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsuarioForm;