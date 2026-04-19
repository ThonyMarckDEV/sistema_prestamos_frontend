import React from 'react';
import { UserIcon, BuildingOfficeIcon, PhoneIcon, CurrencyDollarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { onlyNumbers, toUpper } from 'utilities/Validations/validations';
import ZonaSearchSelect from 'components/Shared/Comboboxes/ZonaSearchSelect';

const ESTADOS_LABEL = {
    1: { label: 'Nuevo',         color: 'bg-slate-100 text-slate-700 border-slate-200' },
    2: { label: 'Contactado',    color: 'bg-blue-50 text-blue-700 border-blue-200' },
    3: { label: 'En Evaluación', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    4: { label: 'Aprobado',      color: 'bg-green-50 text-green-700 border-green-200' },
    5: { label: 'Rechazado',     color: 'bg-red-50 text-red-700 border-red-200' },
    6: { label: 'Convertido',    color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

export const EstadoBadge = ({ estado }) => {
    const e = ESTADOS_LABEL[estado] || ESTADOS_LABEL[1];
    return (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase ${e.color}`}>
            {e.label}
        </span>
    );
};

const ProspectoForm = ({ data, onChange, isEditing = false }) => {
    const esEmpresa = Number(data.tipo) === 2;

    return (
        <div className="space-y-6">

            {/* Tipo */}
            {!isEditing && (
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2">Tipo de Prospecto</label>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => onChange('tipo', 1)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-xs transition-all
                                ${!esEmpresa ? 'bg-red-50 text-red-700 border-red-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                            <UserIcon className="w-4 h-4" /> Persona
                        </button>
                        <button type="button" onClick={() => onChange('tipo', 2)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-xs transition-all
                                ${esEmpresa ? 'bg-yellow-50 text-yellow-700 border-yellow-500' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                            <BuildingOfficeIcon className="w-4 h-4" /> Empresa
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Documento */}
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        {esEmpresa ? 'RUC' : 'DNI'}
                    </label>
                    <input type="text"
                        value={esEmpresa ? (data.ruc || '') : (data.dni || '')}
                        onChange={(e) => onChange(esEmpresa ? 'ruc' : 'dni', onlyNumbers(e.target.value, esEmpresa ? 11 : 8))}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder={esEmpresa ? '20000000000' : '12345678'}
                        readOnly={!isEditing && (data.dni || data.ruc)}
                    />
                </div>

                {/* Nombre */}
                <div className={!isEditing ? '' : 'sm:col-span-2'}>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nombre Completo *</label>
                    <input type="text"
                        value={data.nombre_completo || ''}
                        onChange={(e) => onChange('nombre_completo', toUpper(e.target.value))}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="EJ: JUAN PÉREZ TORRES"
                        required
                    />
                </div>

                {/* Teléfono */}
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        <PhoneIcon className="w-3 h-3 inline mr-1" /> Teléfono *
                    </label>
                    <input type="text"
                        value={data.telefono || ''}
                        onChange={(e) => onChange('telefono', onlyNumbers(e.target.value, 9))}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="999888777"
                        required
                    />
                </div>

                {/* Correo */}
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Correo (Opcional)</label>
                    <input type="email"
                        value={data.correo || ''}
                        onChange={(e) => onChange('correo', toUpper(e.target.value))}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="ejemplo@correo.com"
                    />
                </div>

                {/* Ingreso estimado */}
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        <CurrencyDollarIcon className="w-3 h-3 inline mr-1" /> Ingreso Estimado (S/) (Opcional)
                    </label>
                    <input type="text"
                        value={data.ingreso_estimado || ''}
                        onChange={(e) => onChange('ingreso_estimado', onlyNumbers(e.target.value))}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="1500"
                    />
                </div>

                {/* Monto solicitado */}
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Monto Solicitado (S/) (Opcional)</label>
                    <input type="text"
                        value={data.monto_solicitado || ''}
                        onChange={(e) => onChange('monto_solicitado', onlyNumbers(e.target.value))}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="5000"
                    />
                </div>

                {/* Propósito */}
                <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Propósito del Préstamo (Opcional)</label>
                    <input type="text"
                        value={data.proposito || ''}
                        onChange={(e) => onChange('proposito', toUpper(e.target.value))}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="EJ: CAPITAL DE TRABAJO, MEJORA DE VIVIENDA..."
                    />
                </div>

                {/* Zona */}
                <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Zona Operativa</label>
                    <ZonaSearchSelect
                        initialName={data.zona_nombre || ''}
                        onSelect={(zona) => onChange('zona_id', zona ? zona.id : null)}
                    />
                </div>

                {/* Observaciones */}
                <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        <DocumentTextIcon className="w-3 h-3 inline mr-1" /> Observaciones
                    </label>
                    <textarea
                        value={data.observaciones || ''}
                        onChange={(e) => onChange('observaciones', toUpper(e.target.value))}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none min-h-[80px]"
                        placeholder="NOTAS ADICIONALES SOBRE EL PROSPECTO..."
                    />
                </div>
            </div>
        </div>
    );
};

export { ESTADOS_LABEL };
export default ProspectoForm;