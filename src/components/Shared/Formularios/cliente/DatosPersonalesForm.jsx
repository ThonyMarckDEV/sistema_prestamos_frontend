import React from 'react';
import { IdentificationIcon, PhoneIcon, MapPinIcon, EnvelopeIcon, BuildingOfficeIcon, UserIcon } from '@heroicons/react/24/outline';
import { onlyLetters, onlyNumbers } from 'utilities/Validations/validations';

const DatosClienteForm = ({ data, handleNestedChange }) => {
    const c  = data.datos_cliente;
    const ct = data.contactos;

    const onC  = (field, value) => handleNestedChange('datos_cliente', field, value);
    const onCt = (field, value) => handleNestedChange('contactos', field, value);

    const esEmpresa = Number(c.tipo) === 2;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2 uppercase">
                <IdentificationIcon className="w-5 h-5" /> Información del Cliente
            </h3>

            {/* Selector de tipo */}
            <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Tipo de Cliente <span className="text-red-500">*</span></label>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => onC('tipo', 1)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-black text-sm transition-all ${
                            !esEmpresa ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                    >
                        <UserIcon className="w-5 h-5" /> Persona Natural
                    </button>
                    <button
                        type="button"
                        onClick={() => onC('tipo', 2)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-black text-sm transition-all ${
                            esEmpresa ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                    >
                        <BuildingOfficeIcon className="w-5 h-5" /> Empresa
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

                {/* ── PERSONA NATURAL ── */}
                {!esEmpresa && <>
                    <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">DNI <span className="text-red-500">*</span></label>
                        <input type="text" value={c.dni || ''}
                            onChange={(e) => onC('dni', onlyNumbers(e.target.value, 8))}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="8 dígitos" required />
                    </div>

                    <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Fecha Nacimiento <span className="text-red-500">*</span></label>
                        <input type="date" value={c.fechaNacimiento || ''}
                            onChange={(e) => onC('fechaNacimiento', e.target.value)}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            required />
                    </div>

                    <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Sexo <span className="text-red-500">*</span></label>
                        <select value={c.sexo || ''} onChange={(e) => onC('sexo', e.target.value)}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none bg-white" required>
                            <option value="">-- Seleccionar --</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                    </div>

                    <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombres <span className="text-red-500">*</span></label>
                        <input type="text" value={c.nombre || ''}
                            onChange={(e) => onC('nombre', onlyLetters(e.target.value))}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            required />
                    </div>

                    <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apellido Paterno <span className="text-red-500">*</span></label>
                        <input type="text" value={c.apellidoPaterno || ''}
                            onChange={(e) => onC('apellidoPaterno', onlyLetters(e.target.value))}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            required />
                    </div>

                    <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apellido Materno <span className="text-red-500">*</span></label>
                        <input type="text" value={c.apellidoMaterno || ''}
                            onChange={(e) => onC('apellidoMaterno', onlyLetters(e.target.value))}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            required />
                    </div>
                </>}

                {/* ── EMPRESA ── */}
                {esEmpresa && <>
                    <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">RUC <span className="text-red-500">*</span></label>
                        <input type="text" value={c.ruc || ''}
                            onChange={(e) => onC('ruc', onlyNumbers(e.target.value, 11))}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="11 dígitos" required />
                    </div>

                    <div className="md:col-span-8">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Razón Social <span className="text-red-500">*</span></label>
                        <input type="text" value={c.razon_social || ''}
                            onChange={(e) => onC('razon_social', e.target.value)}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="Nombre legal de la empresa" required />
                    </div>

                    <div className="md:col-span-12">
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre Comercial</label>
                        <input type="text" value={c.nombre_comercial || ''}
                            onChange={(e) => onC('nombre_comercial', e.target.value)}
                            className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="Nombre con el que opera (opcional)" />
                    </div>
                </>}

                {/* ── CONTACTO (siempre visible) ── */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <PhoneIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input type="text" value={ct.telefono || ''}
                            onChange={(e) => onCt('telefono', onlyNumbers(e.target.value, 9))}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="999888777" required />
                    </div>
                </div>

                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico</label>
                    <div className="relative">
                        <EnvelopeIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input type="email" value={ct.correo || ''}
                            onChange={(e) => onCt('correo', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="ejemplo@correo.com" />
                    </div>
                </div>

                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dirección</label>
                    <div className="relative">
                        <MapPinIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>
                        <input type="text" value={c.direccion || ''}
                            onChange={(e) => onC('direccion', e.target.value)}
                            className="w-full pl-9 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="Calle, Número, Distrito..." />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DatosClienteForm;