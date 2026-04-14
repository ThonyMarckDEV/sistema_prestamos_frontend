import React, { useState, useEffect } from 'react';
import ClienteSearchSelect from 'components/Shared/Comboboxes/ClienteSearchSelect';
import ProductoSearchSelect from 'components/Shared/Comboboxes/ProductoSearchSelect';
import { 
    UserIcon, BanknotesIcon, UserGroupIcon,
    ShieldCheckIcon, ClipboardDocumentListIcon, ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import peruData from 'utilities/data/peruData';
import { onlyLetters, onlyNumbers } from 'utilities/Validations/validations';

const SolicitudForm = ({ data, handleChange, isUpdate = false }) => {
    const isBlocked = data.modalidad === 'VIGENTE (NO APLICA)';
    
    const [tieneAval, setTieneAval] = useState(!!data.aval);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);

    const handleAvalInputChange = (field, value, type, limit) => {
        if (isBlocked) return;
        let validated;
        if (type === 'numeric') {
            validated = onlyNumbers(value, limit);
        } else if (type === 'letters') {
            validated = onlyLetters(value);
        } else {
            validated = value;
        }
        handleChange(`aval.${field}`, validated);
    };

    useEffect(() => {
        const depSelected = data.aval?.departamento_aval;
        if (depSelected && peruData[depSelected]) {
            setProvincias(Object.keys(peruData[depSelected]));
        } else { setProvincias([]); }
    }, [data.aval?.departamento_aval]);

    useEffect(() => {
        const depSelected = data.aval?.departamento_aval;
        const provSelected = data.aval?.provincia_aval;
        if (depSelected && provSelected && peruData[depSelected][provSelected]) {
            setDistritos(peruData[depSelected][provSelected]);
        } else { setDistritos([]); }
    }, [data.aval?.provincia_aval, data.aval?.departamento_aval]);

    const handleToggleAval = (e) => {
        if (isBlocked) return;
        const checked = e.target.checked;
        setTieneAval(checked);
        if (!checked) {
            handleChange('aval', null);
        } else {
            handleChange('aval', { 
                dni_aval: '', nombres_aval: '', apellido_paterno_aval: '', 
                apellido_materno_aval: '', telefono_movil_aval: '', direccion_aval: '', 
                relacion_cliente_aval: '', departamento_aval: '', provincia_aval: '', distrito_aval: '' 
            });
        }
    };

    return (
        <div className={`space-y-6 transition-all duration-300 ${isBlocked ? 'opacity-70 select-none' : ''}`}>
            
            {/* ⚠️ ALERTA DE BLOQUEO CRÍTICO */}
            {isBlocked && (
                <div className="bg-red-600 text-white p-5 rounded-2xl flex items-center gap-4 animate-pulse shadow-xl border-2 border-red-400">
                    <ExclamationTriangleIcon className="w-10 h-10 flex-shrink-0" />
                    <div>
                        <p className="font-black uppercase text-base">Acceso Denegado: Cliente con Deuda Vigente</p>
                        <p className="text-xs font-bold opacity-90">Este cliente ya tiene un préstamo activo. Liquide el crédito actual para habilitar una nueva solicitud.</p>
                    </div>
                </div>
            )}

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
                                type="text" value={data.modalidad || ''} readOnly 
                                className={`w-full pl-9 p-2.5 border rounded-lg text-sm font-black outline-none transition-all ${isBlocked ? 'bg-red-50 border-red-500 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`} 
                                placeholder="Esperando selección..."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Producto *</label>
                        <ProductoSearchSelect 
                            onSelect={(p) => handleChange('producto_id', p?.id)} 
                            initialName={data.producto_nombre || data.producto?.nombre} 
                            disabled={isBlocked}
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
                        <input disabled={isBlocked} type="number" value={data.monto_solicitado} onChange={e => handleChange('monto_solicitado', e.target.value)} placeholder="Ej: 1500.00" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none disabled:cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tasa %</label>
                        <input disabled={isBlocked} type="number" step="0.01" value={data.tasa_interes} onChange={e => handleChange('tasa_interes', e.target.value)} placeholder="Ej: 5.5" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none disabled:cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cuotas</label>
                        <input disabled={isBlocked} type="number" value={data.cuotas_solicitadas} onChange={e => handleChange('cuotas_solicitadas', e.target.value)} placeholder="Ej: 24" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none disabled:cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Frecuencia</label>
                        <select disabled={isBlocked} value={data.frecuencia} onChange={e => handleChange('frecuencia', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none disabled:cursor-not-allowed">
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
                    <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 ${isBlocked ? 'cursor-not-allowed opacity-50 bg-slate-100' : 'cursor-pointer bg-slate-50'}`}>
                        <input disabled={isBlocked} type="checkbox" checked={tieneAval} onChange={handleToggleAval} className="w-4 h-4 accent-red-600" />
                        <span className="text-[10px] font-black text-slate-600 uppercase">¿Incluir Aval?</span>
                    </label>
                </div>

                {tieneAval && data.aval ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">DNI *</label>
                                <input disabled={isBlocked} placeholder="Ej: 71228394" value={data.aval.dni_aval} onChange={e => handleAvalInputChange('dni_aval', e.target.value, 'numeric', 8)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none" />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nombres *</label>
                                <input disabled={isBlocked} placeholder="Ej: Juan Alberto" value={data.aval.nombres_aval} onChange={e => handleAvalInputChange('nombres_aval', e.target.value, 'letters')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none uppercase" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Apellido Paterno *</label>
                                <input disabled={isBlocked} placeholder="Ej: Perez" value={data.aval.apellido_paterno_aval} onChange={e => handleAvalInputChange('apellido_paterno_aval', e.target.value, 'letters')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none uppercase" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Apellido Materno *</label>
                                <input disabled={isBlocked} placeholder="Ej: Rodriguez" value={data.aval.apellido_materno_aval} onChange={e => handleAvalInputChange('apellido_materno_aval', e.target.value, 'letters')} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none uppercase" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select disabled={isBlocked} value={data.aval.departamento_aval} onChange={e => { handleChange('aval.departamento_aval', e.target.value); handleChange('aval.provincia_aval', ''); handleChange('aval.distrito_aval', ''); }} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none uppercase">
                                <option value="">DEPARTAMENTO</option>
                                {Object.keys(peruData).map(dep => <option key={dep} value={dep}>{dep}</option>)}
                            </select>
                            <select disabled={isBlocked || !provincias.length} value={data.aval.provincia_aval} onChange={e => { handleChange('aval.provincia_aval', e.target.value); handleChange('aval.distrito_aval', ''); }} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none uppercase">
                                <option value="">PROVINCIA</option>
                                {provincias.map(prov => <option key={prov} value={prov}>{prov.replace(/_/g, ' ')}</option>)}
                            </select>
                            <select disabled={isBlocked || !distritos.length} value={data.aval.distrito_aval} onChange={e => handleChange('aval.distrito_aval', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none uppercase">
                                <option value="">DISTRITO</option>
                                {distritos.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                            </select>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Celular *</label>
                                <input disabled={isBlocked} placeholder="Ej: 987654321" value={data.aval.telefono_movil_aval} onChange={e => handleAvalInputChange('telefono_movil_aval', e.target.value, 'numeric', 9)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dirección Exacta *</label>
                                <input disabled={isBlocked} placeholder="Ej: Av. Grau 123" value={data.aval.direccion_aval} onChange={e => handleChange('aval.direccion_aval', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none uppercase" />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vínculo con el cliente *</label>
                                <input disabled={isBlocked} placeholder="Ej: Hermano, Socio, Amigo" value={data.aval.relacion_cliente_aval} onChange={e => handleAvalInputChange('relacion_cliente_aval', e.target.value, 'letters')} className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none italic" />
                            </div>
                        </div>
                    </div>
                ) : (
                    !isBlocked && (
                        <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl text-slate-300 text-[10px] font-black uppercase italic">
                            Sin aval asignado
                        </div>
                    )
                )}
            </div>

            {/* OBSERVACIONES */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black text-slate-700 uppercase mb-2 flex items-center gap-2">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-slate-400" /> Notas Internas
                </h3>
                <textarea 
                    disabled={isBlocked}
                    value={data.observaciones || ''} 
                    onChange={e => handleChange('observaciones', e.target.value)}
                    placeholder="Ej: Cliente con buen historial, ingresos demostrables..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-red-500 outline-none min-h-[80px] disabled:cursor-not-allowed"
                />
            </div>
        </div>
    );
};

export default SolicitudForm;