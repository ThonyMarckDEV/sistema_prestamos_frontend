import React from 'react';

const STATUS_STYLES = {
    0: 'bg-slate-100 text-slate-400 border-slate-200',
    1: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    2: 'bg-green-50 text-green-700 border-green-100',
    3: 'bg-brand-gold-light text-brand-gold-dark border-brand-gold/30',
    4: 'bg-brand-red-light text-brand-red border-brand-red/30',
    5: 'bg-orange-50 text-orange-700 border-orange-100',
    6: 'bg-blue-50 text-blue-700 border-blue-100',
};

const STATUS_LABELS = {
    0: 'CANCELADO', 1: 'PENDIENTE', 2: 'PAGADO',
    3: 'VENCE HOY', 4: 'VENCIDO',  5: 'PARCIAL', 6: 'REFINANCIADO',
};

export const getStatusBadge = (estado) => (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border whitespace-nowrap ${STATUS_STYLES[estado] ?? STATUS_STYLES[1]}`}>
        {STATUS_LABELS[estado] ?? 'PENDIENTE'}
    </span>
);