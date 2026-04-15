import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { onlyNumbers } from 'utilities/Validations/validations';

const ContactoForm = ({ data, handleNestedChange }) => {
    const ct = data.contacto;
    const onCt = (field, value) => handleNestedChange('contacto', field, value);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-5 uppercase tracking-wide">
                <PhoneIcon className="w-5 h-5 text-red-600" /> Contacto
            </h3>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Móvil *</label>
                    <input type="text" value={ct.telefonoMovil || ''} onChange={(e) => onCt('telefonoMovil', onlyNumbers(e.target.value, 9))} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="999888777" required />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Fijo (Opcional)</label>
                    <input type="text" value={ct.telefonoFijo || ''} onChange={(e) => onCt('telefonoFijo', onlyNumbers(e.target.value, 9))} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="01 234567" />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Correo Electrónico</label>
                    <input type="email" value={ct.correo || ''} onChange={(e) => onCt('correo', e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="ejemplo@correo.com" />
                </div>
            </div>
        </div>
    );
};
export default ContactoForm;