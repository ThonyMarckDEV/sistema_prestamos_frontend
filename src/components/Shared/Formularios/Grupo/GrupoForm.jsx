import React from 'react';
import { UserGroupIcon, TagIcon } from '@heroicons/react/24/outline';
import { toUpper } from 'utilities/Validations/validations';
import ZonaSearchSelect from 'components/Shared/Comboboxes/ZonaSearchSelect';

const GrupoForm = ({ data, handleChange }) => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-6 uppercase tracking-wide border-b border-slate-100 pb-3">
                <UserGroupIcon className="w-6 h-6 text-brand-red" /> Información del Grupo
            </h3>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nombre del Grupo Solidario *</label>
                    <div className="relative">
                        <TagIcon className="w-5 h-5 absolute left-3 top-3.5 text-slate-400"/>
                        <input 
                            type="text" 
                            value={data.nombre || ''} 
                            onChange={(e) => handleChange('nombre', toUpper(e.target.value))} 
                            className="w-full pl-10 p-3.5 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all" 
                            placeholder="EJ: LAS GUERRERAS DE PIURA" 
                            required 
                        />
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Zona Operativa (Asignación) *</label>
                    <ZonaSearchSelect 
                        initialName={data.zona_nombre || ''}
                        onSelect={(zona) => handleChange('zona_id', zona ? zona.id : null)}
                    />
                </div>
            </div>
        </div>
    );
};

export default GrupoForm;