import React from 'react';
import { CreditCardIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { onlyNumbers } from 'utilities/Validations/validations';
import EntidadBancariaSelect from 'components/Shared/Comboboxes/EntidadBancariaSearchSelect';

const CuentaBancariaForm = ({ data, handleNestedChange }) => {
    const cuentas = data.cuentas_bancarias || [];

    const handleAddCuenta = () => {
        const nuevasCuentas = [...cuentas, { 
            entidad_bancaria_id: '',
            ctaAhorros: '', 
            cci: '', 
            longitud_cuenta: null, 
            longitud_cci: null 
        }];
        handleNestedChange('cuentas_bancarias', null, nuevasCuentas);
    };

    const handleRemoveCuenta = (index) => {
        const nuevasCuentas = cuentas.filter((_, i) => i !== index);
        handleNestedChange('cuentas_bancarias', null, nuevasCuentas);
    };

    const handleCuentaChange = (index, field, value) => {
        const nuevasCuentas = [...cuentas];
        nuevasCuentas[index][field] = value;
        handleNestedChange('cuentas_bancarias', null, nuevasCuentas);
    };

    const handleEntidadSelect = (index, bancoSeleccionado) => {
        const nuevasCuentas = [...cuentas];
        if (bancoSeleccionado) {
            nuevasCuentas[index].entidad_bancaria_id = bancoSeleccionado.id;
            nuevasCuentas[index].entidad_nombre_visual = bancoSeleccionado.nombre; 
            nuevasCuentas[index].longitud_cuenta = bancoSeleccionado.longitud_cuenta;
            nuevasCuentas[index].longitud_cci = bancoSeleccionado.longitud_cci;
            nuevasCuentas[index].ctaAhorros = '';
            nuevasCuentas[index].cci = '';
        }
        handleNestedChange('cuentas_bancarias', null, nuevasCuentas);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                    <CreditCardIcon className="w-5 h-5 text-red-600" /> Cuentas Bancarias
                </h3>
                <button type="button" onClick={handleAddCuenta}
                    className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors uppercase tracking-wider">
                    <PlusIcon className="w-3 h-3" /> Agregar
                </button>
            </div>

            {cuentas.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <p className="text-xs text-slate-400">Presiona "Agregar" para registrar una cuenta.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cuentas.map((cb, index) => (
                        <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative">
                            <button type="button" onClick={() => handleRemoveCuenta(index)}
                                className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 shadow-sm hover:bg-red-600 hover:text-white transition-colors z-20">
                                <TrashIcon className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="z-10">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Banco *</label>
                                    <EntidadBancariaSelect 
                                        initialName={cb.entidad_nombre_visual || cb.entidad_bancaria?.nombre} 
                                        onSelect={(banco) => handleEntidadSelect(index, banco)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                        N° Cuenta {cb.longitud_cuenta ? `(${cb.longitud_cuenta} dígitos)` : ''} *
                                    </label>
                                    <input 
                                        type="text" 
                                        value={cb.ctaAhorros || ''} 
                                        // 🔥 Ahora usa la longitud exacta enviada por el backend o el select
                                        onChange={(e) => handleCuentaChange(index, 'ctaAhorros', onlyNumbers(e.target.value, cb.longitud_cuenta || 30))} 
                                        className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-medium tracking-wider" 
                                        placeholder={cb.longitud_cuenta ? `Exactamente ${cb.longitud_cuenta} dígitos` : "Seleccione un banco"}
                                        required 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                                        CCI {cb.longitud_cci ? `(${cb.longitud_cci} dígitos)` : ''}
                                    </label>
                                    <input 
                                        type="text" 
                                        value={cb.cci || ''} 
                                        // 🔥 Ahora usa la longitud exacta de CCI
                                        onChange={(e) => handleCuentaChange(index, 'cci', onlyNumbers(e.target.value, cb.longitud_cci || 30))} 
                                        className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-medium tracking-wider" 
                                        placeholder={cb.longitud_cci ? `Exactamente ${cb.longitud_cci} dígitos` : "Seleccione un banco"}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CuentaBancariaForm;