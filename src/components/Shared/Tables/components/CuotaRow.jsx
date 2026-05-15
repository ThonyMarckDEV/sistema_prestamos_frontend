import React from 'react';
import { useCuotaData } from '../hooks/useCuotaData';
import { getStatusBadge } from './StatusBadge';
import { CeldaFinanciera, SaldoContent, MoraContent, AbonosContent } from './CeldasBase';
import { ExcedenteContent, ExcedentesIntegrantes } from './Excedentes';

export const CuotaRow = ({ cuota, i, cronograma, esVistaIntegrante, onHistorialModal, extraColumns }) => {
    const d = useCuotaData(cuota, i, esVistaIntegrante);

    const hayExcedentesIntegrantes = !esVistaIntegrante && cuota.integrantes?.some(
        int => int.excedente_anterior > 0 || int.excedente_generado > 0 ||
               int.excedente_aplicado > 0 || int.excedente_consumido > 0
    );

    return (
        <tr className={`transition-colors ${
            d.esCancelada    ? 'bg-slate-50/80 opacity-50'  :
            d.esRefinanciada ? 'bg-blue-50/60 opacity-60'   :
                               'hover:bg-brand-red-light/30'
        }`}>
            <td className="px-3 py-4 text-xs font-black text-slate-400 text-center font-mono">
                #{d.nro.toString().padStart(2, '0')}
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
                <span className={`text-xs font-bold block ${d.esInactiva ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                    {cuota.vencimiento}
                </span>
                {d.diasAtraso > 0 && !d.esInactiva && (
                    <span className="text-[9px] font-black text-brand-red uppercase">{d.diasAtraso} días atraso</span>
                )}
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
                <span className={`text-sm font-black ${d.esInactiva ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    S/ {d.monto.toFixed(2)}
                </span>
                {d.esCancelada    && <span className="block text-[9px] font-black text-slate-400 uppercase">Cancelado</span>}
                {d.esRefinanciada && <span className="block text-[9px] font-black text-blue-500  uppercase">Refinanciado</span>}
            </td>
            <td className="px-3 py-4"><CeldaFinanciera total={d.capital} pagado={d.capPagado} pendiente={d.esInactiva ? 0 : d.capPend} /></td>
            <td className="px-3 py-4"><CeldaFinanciera total={d.interes} pagado={d.intPagado} pendiente={d.esInactiva ? 0 : d.intPend} /></td>
            <td className="px-3 py-4"><CeldaFinanciera total={d.seguro} pagado={d.segPagado} pendiente={d.esInactiva ? 0 : d.segPend} /></td>
            <td className="px-3 py-4"><MoraContent d={d} cuota={cuota} nro={d.nro} onHistorialModal={onHistorialModal} /></td>
            <td className="px-3 py-4"><AbonosContent d={d} esVistaIntegrante={esVistaIntegrante} /></td>
            
            {/* ─── Columna Excedente Corregida ─── */}
            <td className="px-3 py-4">
                {d.esInactiva && !hayExcedentesIntegrantes ? (
                    <span className="text-slate-300 font-black text-[11px]">—</span>
                ) : (
                    <div className="flex flex-col gap-1">
                        {!d.esInactiva && (
                            <ExcedenteContent 
                                excAnterior={d.excAnterior} 
                                excAplicado={d.excAplicado} 
                                excConsumido={d.excConsumido} 
                                excGenerado={d.excGenerado} 
                                label={esVistaIntegrante ? 'Exc. propio' : 'Excedente'} 
                            />
                        )}
                        {!esVistaIntegrante && (
                            <ExcedentesIntegrantes integrantes={cuota.integrantes} />
                        )}
                    </div>
                )}
            </td>

            <td className="px-3 py-4"><SaldoContent d={d} /></td>
            <td className="px-3 py-4 text-center">{getStatusBadge(d.estadoGlobal)}</td>
            {extraColumns.map((col) => (
                <td key={col.header} className="px-3 py-4 text-center">
                    {col.render(cuota, i, cronograma)}
                </td>
            ))}
        </tr>
    );
};