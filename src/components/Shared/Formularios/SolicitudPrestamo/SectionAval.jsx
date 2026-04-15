import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import peruData from 'utilities/data/peruData';

const SectionAval = ({ data, handleChange, isBlocked, config }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-700 uppercase flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-red-600" /> Información de Garantía (Aval)
            </h3>
            <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 ${isBlocked ? 'cursor-not-allowed opacity-50 bg-slate-100' : 'cursor-pointer bg-slate-50'}`}>
                <input disabled={isBlocked} type="checkbox" checked={config.tieneAval} onChange={config.handleToggleAval} className="w-4 h-4 accent-red-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase">¿Incluir Aval?</span>
            </label>
        </div>

        {config.tieneAval && data.aval ? (
            <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">DNI *</label>
                        <input disabled={isBlocked} placeholder="Ej: 71228394" value={data.aval.dni_aval} onChange={e => config.handleAvalInputChange('dni_aval', e.target.value, 'numeric', 8)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none disabled:cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nombres *</label>
                        <input disabled={isBlocked} placeholder="Ej: Juan Alberto" value={data.aval.nombres_aval} onChange={e => config.handleAvalInputChange('nombres_aval', e.target.value, 'letters')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none uppercase disabled:cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Apellido Paterno *</label>
                        <input disabled={isBlocked} placeholder="Ej: Perez" value={data.aval.apellido_paterno_aval} onChange={e => config.handleAvalInputChange('apellido_paterno_aval', e.target.value, 'letters')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none uppercase disabled:cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Apellido Materno *</label>
                        <input disabled={isBlocked} placeholder="Ej: Rodriguez" value={data.aval.apellido_materno_aval} onChange={e => config.handleAvalInputChange('apellido_materno_aval', e.target.value, 'letters')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none uppercase disabled:cursor-not-allowed" />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select disabled={isBlocked} value={data.aval.departamento_aval} onChange={e => { handleChange('aval.departamento_aval', e.target.value); handleChange('aval.provincia_aval', ''); handleChange('aval.distrito_aval', ''); }} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none uppercase disabled:cursor-not-allowed">
                        <option value="">DEPARTAMENTO</option>
                        {Object.keys(peruData).map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </select>
                    <select disabled={isBlocked || !config.provincias.length} value={data.aval.provincia_aval} onChange={e => { handleChange('aval.provincia_aval', e.target.value); handleChange('aval.distrito_aval', ''); }} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none uppercase disabled:cursor-not-allowed">
                        <option value="">PROVINCIA</option>
                        {config.provincias.map(prov => <option key={prov} value={prov}>{prov.replace(/_/g, ' ')}</option>)}
                    </select>
                    <select disabled={isBlocked || !config.distritos.length} value={data.aval.distrito_aval} onChange={e => handleChange('aval.distrito_aval', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none uppercase disabled:cursor-not-allowed">
                        <option value="">DISTRITO</option>
                        {config.distritos.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                    </select>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Celular *</label>
                        <input disabled={isBlocked} placeholder="Ej: 987654321" value={data.aval.telefono_movil_aval} onChange={e => config.handleAvalInputChange('telefono_movil_aval', e.target.value, 'numeric', 9)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none disabled:cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dirección Exacta *</label>
                        <input disabled={isBlocked} placeholder="Ej: Av. Grau 123" value={data.aval.direccion_aval} onChange={e => handleChange('aval.direccion_aval', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none uppercase disabled:cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vínculo con el cliente *</label>
                        <input disabled={isBlocked} placeholder="Ej: Hermano, Socio, Amigo" value={data.aval.relacion_cliente_aval} onChange={e => config.handleAvalInputChange('relacion_cliente_aval', e.target.value, 'letters')} className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none italic disabled:cursor-not-allowed" />
                    </div>
                </div>
            </div>
        ) : (
            !isBlocked && (
                <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl text-slate-300 text-[10px] font-black uppercase italic">
                    Sin aval asignado para esta solicitud
                </div>
            )
        )}
    </div>
);
export default SectionAval;