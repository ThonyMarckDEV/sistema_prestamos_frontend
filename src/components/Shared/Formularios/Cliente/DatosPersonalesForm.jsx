import React from 'react';
import { IdentificationIcon, BuildingOfficeIcon, UserIcon } from '@heroicons/react/24/outline';
import { onlyLetters, onlyNumbers } from 'utilities/Validations/validations';
import CiiuSelect from 'components/Shared/Comboboxes/CiiuSearchSelect';

const DatosPersonalesForm = ({ data, handleNestedChange, isEditing = false }) => {
    const c = data.datos_cliente;
    const onC = (field, value) => handleNestedChange('datos_cliente', field, value);
    const esEmpresa = Number(c.tipo) === 2;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-5 uppercase tracking-wide">
                <IdentificationIcon className="w-5 h-5 text-red-600" /> Datos Principales
            </h3>

            {/* Selector de tipo */}
            <div className="mb-6 flex flex-col gap-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">Tipo de Cliente</label>
                <div className="flex gap-3">
                    <button 
                        type="button" 
                        onClick={() => onC('tipo', 1)}
                        disabled={isEditing}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-xs transition-all ${
                            !esEmpresa 
                            ? 'bg-red-50 text-red-700 border-red-600' 
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        } ${isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <UserIcon className="w-4 h-4" /> Persona
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => onC('tipo', 2)}
                        disabled={isEditing}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-xs transition-all ${
                            esEmpresa 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-500' 
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        } ${isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <BuildingOfficeIcon className="w-4 h-4" /> Empresa
                    </button>
                </div>
                {isEditing && (
                    <p className="text-[9px] text-slate-400 italic">* El tipo de cliente no se puede modificar después del registro.</p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {!esEmpresa ? (
                    <>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">DNI *</label>
                            <input type="text" value={c.dni || ''} onChange={(e) => onC('dni', onlyNumbers(e.target.value, 8))} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Vencimiento DNI *</label>
                            <input type="date" value={c.fechaVencimientoDni || ''} onChange={(e) => onC('fechaVencimientoDni', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">F. Nacimiento *</label>
                            <input type="date" value={c.fechaNacimiento || ''} onChange={(e) => onC('fechaNacimiento', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Sexo *</label>
                            <select value={c.sexo || ''} onChange={(e) => onC('sexo', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required>
                                <option value="">-- Seleccionar --</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nombres *</label>
                            <input type="text" value={c.nombre || ''} onChange={(e) => onC('nombre', onlyLetters(e.target.value))} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Ap. Paterno *</label>
                            <input type="text" value={c.apellidoPaterno || ''} onChange={(e) => onC('apellidoPaterno', onlyLetters(e.target.value))} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Ap. Materno *</label>
                            <input type="text" value={c.apellidoMaterno || ''} onChange={(e) => onC('apellidoMaterno', onlyLetters(e.target.value))} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">RUC *</label>
                            <input type="text" value={c.ruc || ''} onChange={(e) => onC('ruc', onlyNumbers(e.target.value, 11))} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none" required />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Razón Social *</label>
                            <input type="text" value={c.razon_social || ''} onChange={(e) => onC('razon_social', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none" required />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nombre Comercial</label>
                            <input type="text" value={c.nombre_comercial || ''} onChange={(e) => onC('nombre_comercial', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none" />
                        </div>
                    </>
                )}

                <div className="sm:col-span-2 mt-2 pt-4 border-t border-slate-100">
                    <CiiuSelect 
                        onSelect={(ciiu) => onC('ciiu_id', ciiu ? ciiu.id : null)}
                        initialCiiu={c.ciiu || null} 
                    />
                </div>
                
            </div>
        </div>
    );
};

export default DatosPersonalesForm;