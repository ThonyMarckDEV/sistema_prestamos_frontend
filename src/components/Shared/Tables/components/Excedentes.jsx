import React from 'react';

export const ExcedenteContent = ({ excAnterior, excAplicado, excConsumido, excGenerado, label = 'Excedente' }) => {
    const hayAlgo = excAnterior > 0 || excAplicado > 0 || excConsumido > 0 || excGenerado > 0;
    if (!hayAlgo) return <span className="text-[10px] text-slate-300 font-bold">—</span>;

    return (
        <div className="flex flex-col gap-0.5 items-end">
            {excAnterior > 0 && <span className="text-[9px] font-bold text-purple-600 uppercase whitespace-nowrap">{label} anterior: S/ {excAnterior.toFixed(2)}</span>}
            {excAplicado > 0 && <span className="text-[9px] font-bold text-purple-700 uppercase whitespace-nowrap">Aplicado a capital: -S/ {excAplicado.toFixed(2)}</span>}
            {excConsumido > 0 && <span className="text-[9px] font-bold text-purple-500 uppercase whitespace-nowrap">Consumido: S/ {excConsumido.toFixed(2)}</span>}
            {excGenerado > 0 && <span className="text-[9px] font-bold text-orange-500 uppercase whitespace-nowrap">Generado → siguiente: S/ {excGenerado.toFixed(2)}</span>}
        </div>
    );
};

export const ExcedentesIntegrantes = ({ integrantes }) => {
    const conExcedente = integrantes?.filter(
        int => int.excedente_anterior > 0 || int.excedente_generado > 0 ||
               int.excedente_aplicado > 0  || int.excedente_consumido > 0
    );

    if (!conExcedente?.length) return null;

    return (
        <div className="flex flex-col gap-1 items-end">
            {conExcedente.map(int => (
                <div key={int.id} className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-500 uppercase">{int.nombre}</span>
                    {int.excedente_generado > 0 && (
                        <span className="text-[9px] font-bold text-orange-500 whitespace-nowrap">Generado: S/ {parseFloat(int.excedente_generado).toFixed(2)}</span>
                    )}
                    {int.excedente_anterior > 0 && (
                        <span className="text-[9px] font-bold text-purple-600 whitespace-nowrap">Anterior: S/ {parseFloat(int.excedente_anterior).toFixed(2)}</span>
                    )}
                    {int.excedente_aplicado > 0 && (
                        <span className="text-[9px] font-bold text-purple-700 whitespace-nowrap">Aplicado: -S/ {parseFloat(int.excedente_aplicado).toFixed(2)}</span>
                    )}
                    {int.excedente_consumido > 0 && (
                        <span className="text-[9px] font-bold text-purple-400 whitespace-nowrap">Consumido: S/ {parseFloat(int.excedente_consumido).toFixed(2)}</span>
                    )}
                </div>
            ))}
        </div>
    );
};