import React from 'react';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { onlyNumbers } from 'utilities/Validations/validations';

const CuentaBancariaForm = ({ data, handleNestedChange }) => {
    const cb = data.cuenta_bancaria;
    const onCb = (field, value) => handleNestedChange('cuenta_bancaria', field, value);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-5 uppercase tracking-wide">
                <CreditCardIcon className="w-5 h-5 text-red-600" /> Cuenta Bancaria
            </h3>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Entidad Financiera *</label>
                    <input type="text" value={cb.entidadFinanciera || ''} onChange={(e) => onCb('entidadFinanciera', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="Ej: BCP, Interbank" required />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">N° Cuenta Ahorros *</label>
                    <input type="text" value={cb.ctaAhorros || ''} onChange={(e) => onCb('ctaAhorros', onlyNumbers(e.target.value, 20))} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">CCI (Opcional)</label>
                    <input type="text" value={cb.cci || ''} onChange={(e) => onCb('cci', onlyNumbers(e.target.value, 20))} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="20 dígitos" />
                </div>
            </div>
        </div>
    );
};
export default CuentaBancariaForm;