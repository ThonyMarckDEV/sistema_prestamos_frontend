import React, { useState } from 'react';
import ClienteSearchSelect from 'components/Shared/Comboboxes/ClienteSearchSelect';
import ProductoSearchSelect from 'components/Shared/Comboboxes/ProductoSearchSelect';
import { UserIcon, BanknotesIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const SolicitudForm = ({ data, handleChange, isUpdate = false }) => {
    const [tieneAval, setTieneAval] = useState(!!data.aval?.dni_aval);

    const handleToggleAval = (e) => {
        const checked = e.target.checked;
        setTieneAval(checked);
        if (!checked) {
            handleChange('aval', null);
        } else {
            handleChange('aval', { 
                dni_aval: '', nombres_aval: '', apellido_paterno_aval: '', 
                apellido_materno_aval: '', telefono_movil_aval: '', direccion_aval: '', 
                relacion_cliente_aval: '', departamento_aval: 'PIURA', provincia_aval: 'TALARA', distrito_aval: 'PARIÑAS' 
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* SECCIÓN CLIENTE Y PRODUCTO */}
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
                            initialName={data.cliente?.nombre_completo}
                            disabled={isUpdate}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Modalidad</label>
                        <input type="text" value={data.modalidad || ''} readOnly className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-black text-red-600" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Producto *</label>
                        <ProductoSearchSelect onSelect={(p) => handleChange('producto_id', p?.id)} initialName={data.producto?.nombre} />
                    </div>
                </div>
            </div>

            {/* CONDICIONES */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-700 uppercase mb-4 flex items-center gap-2">
                    <BanknotesIcon className="w-5 h-5 text-red-600" /> Condiciones
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <input type="number" placeholder="Monto" value={data.monto_solicitado} onChange={e => handleChange('monto_solicitado', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    <input type="number" step="0.01" placeholder="Tasa %" value={data.tasa_interes} onChange={e => handleChange('tasa_interes', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    <input type="number" placeholder="Cuotas" value={data.cuotas_solicitadas} onChange={e => handleChange('cuotas_solicitadas', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    <select value={data.frecuencia} onChange={e => handleChange('frecuencia', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                        <option value="SEMANAL">SEMANAL</option>
                        <option value="CATORCENAL">CATORCENAL</option>
                        <option value="MENSUAL">MENSUAL</option>
                    </select>
                </div>
            </div>

            {/* SECCIÓN AVAL CON CHECKBOX */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-700 uppercase flex items-center gap-2">
                        <UserGroupIcon className="w-5 h-5 text-red-600" /> Información del Aval
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                        <input type="checkbox" checked={tieneAval} onChange={handleToggleAval} className="w-4 h-4 accent-red-600" />
                        <span className="text-xs font-bold text-slate-600 uppercase">¿Tiene Aval?</span>
                    </label>
                </div>

                {tieneAval ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300">
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">DNI Aval *</label>
                            <input value={data.aval?.dni_aval || ''} onChange={e => handleChange('aval.dni_aval', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nombres Completos *</label>
                            <input value={data.aval?.nombres_aval || ''} onChange={e => handleChange('aval.nombres_aval', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <input placeholder="Apellido Paterno *" value={data.aval?.apellido_paterno_aval || ''} onChange={e => handleChange('aval.apellido_paterno_aval', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        <input placeholder="Apellido Materno *" value={data.aval?.apellido_materno_aval || ''} onChange={e => handleChange('aval.apellido_materno_aval', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        <input placeholder="Teléfono Móvil *" value={data.aval?.telefono_movil_aval || ''} onChange={e => handleChange('aval.telefono_movil_aval', e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        <div className="md:col-span-2">
                            <input placeholder="Relación con Cliente (Familiar, Amigo...) *" value={data.aval?.relacion_cliente_aval || ''} onChange={e => handleChange('aval.relacion_cliente_aval', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div className="md:col-span-3">
                            <input placeholder="Dirección Exacta del Aval *" value={data.aval?.direccion_aval || ''} onChange={e => handleChange('aval.direccion_aval', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                        <p className="text-xs font-medium text-slate-400">No se registrará un aval para esta solicitud.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default SolicitudForm;