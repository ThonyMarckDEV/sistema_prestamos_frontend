import React, { useMemo } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { toUpper } from 'utilities/Validations/validations';
import peruData from 'utilities/data/peruData';
import ZonaSearchSelect from 'components/Shared/Comboboxes/ZonaSearchSelect';

const DireccionForm = ({ data, handleNestedChange }) => {
    const d  = data.direccion;
    const dc = data.datos_cliente;

    const onD = (field, value) => handleNestedChange('direccion', field, value);

    const handleDepartamentoChange = (e) => {
        onD('departamento', e.target.value);
        onD('provincia', '');
        onD('distrito', '');
    };

    const handleProvinciaChange = (e) => {
        onD('provincia', e.target.value);
        onD('distrito', '');
    };

    const departamentos = useMemo(() => Object.keys(peruData).sort(), []);

    const provincias = useMemo(() => {
        if (!d.departamento || !peruData[d.departamento]) return [];
        return Object.keys(peruData[d.departamento]).sort();
    }, [d.departamento]);

    const distritos = useMemo(() => {
        if (!d.departamento || !d.provincia || !peruData[d.departamento][d.provincia]) return [];
        return [...peruData[d.departamento][d.provincia]].sort();
    }, [d.departamento, d.provincia]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-5 uppercase tracking-wide border-b border-slate-100 pb-3">
                <MapPinIcon className="w-5 h-5 text-red-600" /> Dirección y Zona
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Dirección Fiscal / Domicilio *</label>
                    <input
                        type="text"
                        value={d.direccionFiscal || ''}
                        onChange={(e) => onD('direccionFiscal', toUpper(e.target.value))}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="EJ: AV. LOS INCAS 123"
                        required
                    />
                </div>

                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Departamento *</label>
                    <select
                        value={d.departamento || ''}
                        onChange={handleDepartamentoChange}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
                        required
                    >
                        <option value="">-- Seleccione --</option>
                        {departamentos.map(depto => (
                            <option key={depto} value={depto}>{depto.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Provincia *</label>
                    <select
                        value={d.provincia || ''}
                        onChange={handleProvinciaChange}
                        disabled={!d.departamento}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                        required
                    >
                        <option value="">-- Seleccione --</option>
                        {provincias.map(prov => (
                            <option key={prov} value={prov}>{prov.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Distrito *</label>
                    <select
                        value={d.distrito || ''}
                        onChange={(e) => onD('distrito', e.target.value)}
                        disabled={!d.provincia}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                        required
                    >
                        <option value="">-- Seleccione --</option>
                        {distritos.map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">T. Residencia *</label>
                    <input
                        type="text"
                        value={d.tiempoResidencia || ''}
                        onChange={(e) => onD('tiempoResidencia', toUpper(e.target.value))}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="EJ: 2 AÑOS"
                        required
                    />
                </div>

                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tipo de Vivienda *</label>
                    <select
                        value={d.tipoVivienda || ''}
                        onChange={(e) => onD('tipoVivienda', e.target.value)}
                        className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
                        required
                    >
                        <option value="">-- Seleccione --</option>
                        <option value="Propia">Propia</option>
                        <option value="Alquilada">Alquilada</option>
                        <option value="Familiar">Familiar</option>
                        <option value="Hipotecada">Hipotecada</option>
                    </select>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100 mt-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Zona Operativa Comercial *</label>
                    <ZonaSearchSelect
                        initialName={dc.zona_nombre || ''}
                        onSelect={(zona) => handleNestedChange('datos_cliente', 'zona_id', zona ? zona.id : null)}
                    />
                </div>
            </div>
        </div>
    );
};

export default DireccionForm;