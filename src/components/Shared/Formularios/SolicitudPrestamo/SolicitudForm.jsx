import React, { useState, useEffect } from 'react';
import ClienteSearchSelect from 'components/Shared/Comboboxes/ClienteSearchSelect';
import ProductoSearchSelect from 'components/Shared/Comboboxes/ProductoSearchSelect';
import { UserIcon, BanknotesIcon, UserGroupIcon, MapPinIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import peruData from 'utilities/data/peruData';

const SolicitudForm = ({ data, handleChange, isUpdate = false }) => {
    const [tieneAval, setTieneAval] = useState(!!data.aval);

    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);

    // 1. Efecto: Cuando cambia el Departamento del Aval
    useEffect(() => {
        const depSelected = data.aval?.departamento_aval;
        if (depSelected && peruData[depSelected]) {
            setProvincias(Object.keys(peruData[depSelected]));
        } else {
            setProvincias([]);
        }
    }, [data.aval?.departamento_aval]);

    // 2. Efecto: Cuando cambia la Provincia del Aval
    useEffect(() => {
        const depSelected = data.aval?.departamento_aval;
        const provSelected = data.aval?.provincia_aval;
        if (depSelected && provSelected && peruData[depSelected][provSelected]) {
            setDistritos(peruData[depSelected][provSelected]);
        } else {
            setDistritos([]);
        }
    }, [data.aval?.provincia_aval, data.aval?.departamento_aval]);

    // Manejador del Checkbox de Aval
    const handleToggleAval = (e) => {
        const checked = e.target.checked;
        setTieneAval(checked);
        if (!checked) {
            handleChange('aval', null);
        } else {
            handleChange('aval', { 
                dni_aval: '', 
                nombres_aval: '', 
                apellido_paterno_aval: '', 
                apellido_materno_aval: '', 
                telefono_movil_aval: '', 
                direccion_aval: '', 
                relacion_cliente_aval: '', 
                departamento_aval: '', 
                provincia_aval: '', 
                distrito_aval: '' 
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* --- SECCIÓN 1: CLIENTE Y PRODUCTO --- */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-700 uppercase mb-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-red-600" /> Información Principal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cliente *</label>
                        <ClienteSearchSelect 
                            onSelect={(c) => {
                                handleChange('cliente_id', c?.usuario_id);
                                handleChange('modalidad', c ? c.modalidad_cliente : '');
                            }} 
                            initialName={data.cliente_nombre || data.cliente?.nombre_completo}
                            disabled={isUpdate}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Modalidad</label>
                        <div className="relative">
                            <ShieldCheckIcon className={`w-4 h-4 absolute left-3 top-3 ${data.modalidad ? 'text-red-600' : 'text-slate-300'}`} />
                            <input 
                                type="text" 
                                value={data.modalidad || ''} 
                                readOnly 
                                className={`w-full pl-9 p-2.5 border rounded-lg text-sm font-black outline-none transition-all ${
                                    data.modalidad 
                                    ? 'bg-red-50 border-red-200 text-red-600' 
                                    : 'bg-slate-50 border-slate-200 text-slate-400'
                                }`} 
                                placeholder="Seleccione cliente..."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Producto *</label>
                        <ProductoSearchSelect 
                            onSelect={(p) => handleChange('producto_id', p?.id)} 
                            initialName={data.producto_nombre || data.producto?.nombre} 
                        />
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN 2: CONDICIONES ECONÓMICAS --- */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-700 uppercase mb-4 flex items-center gap-2">
                    <BanknotesIcon className="w-5 h-5 text-red-600" /> Condiciones Solicitadas
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Monto (S/)</label>
                        <input type="number" value={data.monto_solicitado} onChange={e => handleChange('monto_solicitado', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tasa %</label>
                        <input type="number" step="0.01" value={data.tasa_interes} onChange={e => handleChange('tasa_interes', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cuotas</label>
                        <input type="number" value={data.cuotas_solicitadas} onChange={e => handleChange('cuotas_solicitadas', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Frecuencia</label>
                        <select value={data.frecuencia} onChange={e => handleChange('frecuencia', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none">
                            <option value="SEMANAL">SEMANAL</option>
                            <option value="CATORCENAL">CATORCENAL</option>
                            <option value="MENSUAL">MENSUAL</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN 3: DATOS DEL AVAL --- */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-700 uppercase flex items-center gap-2">
                        <UserGroupIcon className="w-5 h-5 text-red-600" /> Información del Aval
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <input type="checkbox" checked={tieneAval} onChange={handleToggleAval} className="w-4 h-4 accent-red-600" />
                        <span className="text-[10px] font-black text-slate-600 uppercase">¿Incluir Aval?</span>
                    </label>
                </div>

                {tieneAval && data.aval ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input placeholder="DNI Aval *" value={data.aval.dni_aval} onChange={e => handleChange('aval.dni_aval', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                            <input placeholder="Nombres *" value={data.aval.nombres_aval} onChange={e => handleChange('aval.nombres_aval', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm md:col-span-2" />
                            <input placeholder="Apellido Paterno *" value={data.aval.apellido_paterno_aval} onChange={e => handleChange('aval.apellido_paterno_aval', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                            <input placeholder="Apellido Materno *" value={data.aval.apellido_materno_aval} onChange={e => handleChange('aval.apellido_materno_aval', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                            <input placeholder="Celular *" value={data.aval.telefono_movil_aval} onChange={e => handleChange('aval.telefono_movil_aval', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>

                        {/* UBICACIÓN DINÁMICA */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-50 pt-4">
                            <div className="flex items-center gap-2 md:col-span-3 text-slate-400 mb-1">
                                <MapPinIcon className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-wider">Ubicación del Aval</span>
                            </div>
                            
                            <select 
                                value={data.aval.departamento_aval} 
                                onChange={e => {
                                    handleChange('aval.departamento_aval', e.target.value);
                                    handleChange('aval.provincia_aval', '');
                                    handleChange('aval.distrito_aval', '');
                                }} 
                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                            >
                                <option value="">Departamento</option>
                                {Object.keys(peruData).map(dep => (
                                    <option key={dep} value={dep}>{dep}</option>
                                ))}
                            </select>

                            <select 
                                value={data.aval.provincia_aval} 
                                onChange={e => {
                                    handleChange('aval.provincia_aval', e.target.value);
                                    handleChange('aval.distrito_aval', '');
                                }} 
                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                                disabled={!provincias.length}
                            >
                                <option value="">Provincia</option>
                                {provincias.map(prov => (
                                    <option key={prov} value={prov}>{prov.replace(/_/g, ' ')}</option>
                                ))}
                            </select>

                            <select 
                                value={data.aval.distrito_aval} 
                                onChange={e => handleChange('aval.distrito_aval', e.target.value)} 
                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                                disabled={!distritos.length}
                            >
                                <option value="">Distrito</option>
                                {distritos.map(dist => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                            </select>

                            <input placeholder="Dirección Exacta *" value={data.aval.direccion_aval} onChange={e => handleChange('aval.direccion_aval', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm md:col-span-2 focus:ring-1 focus:ring-red-500 outline-none" />
                            <input placeholder="Relación (Amigo, Familiar...)" value={data.aval.relacion_cliente_aval} onChange={e => handleChange('aval.relacion_cliente_aval', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-red-500 outline-none" />
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                        <p className="text-xs font-black text-slate-300 uppercase italic">Sin aval para esta solicitud de crédito</p>
                    </div>
                )}
            </div>
            
            {/* SECCIÓN OBSERVACIONES */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Observaciones Internas</label>
                <textarea 
                    value={data.observaciones || ''} 
                    onChange={e => handleChange('observaciones', e.target.value)}
                    placeholder="Notas adicionales sobre la evaluación del cliente..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm min-h-[80px] focus:ring-1 focus:ring-red-500 outline-none"
                />
            </div>
        </div>
    );
};

export default SolicitudForm;