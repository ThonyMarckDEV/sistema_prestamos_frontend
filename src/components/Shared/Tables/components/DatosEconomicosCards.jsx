import React from 'react';

// ── Skeleton ──────────────────────────────────────────────────────────────────
export const CardSkeleton = ({ accent = 'slate' }) => {
    const bg = {
        slate: 'bg-slate-50 border border-slate-100',
        gold:  'bg-brand-gold-light/20 border border-brand-gold/10',
        red:   'bg-brand-red/80',
        white: 'bg-white border border-slate-100',
    }[accent];
    const pulse = accent === 'red' ? 'bg-white/20' : 'bg-slate-200';
    return (
        <div className={`p-4 rounded-2xl animate-pulse ${bg}`}>
            <div className={`h-2.5 w-24 rounded-full mb-3 ${pulse}`} />
            <div className={`h-7 w-32 rounded-full mb-2 ${pulse}`} />
            <div className={`h-2 w-20 rounded-full mb-4 ${pulse}`} />
            <div className={`h-2 w-full rounded-full ${pulse}`} />
        </div>
    );
};

export const DatosEconomicosCardsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardSkeleton accent="slate" />
        <CardSkeleton accent="gold"  />
        <CardSkeleton accent="red"   />
        <CardSkeleton accent="white" />
    </div>
);

// ── Cards económicas ──────────────────────────────────────────────────────────
/**
 * Props:
 *   eco              — objeto datos_economicos del préstamo o integrante
 *   estadoPrestamo   — data.estado (1=vigente, 3=liquidado)
 *   esVistaIntegrante — boolean
 */
const DatosEconomicosCards = ({ eco, estadoPrestamo, esVistaIntegrante }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Capital */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                {estadoPrestamo === 3 ? 'Capital Total' : 'Capital Pendiente'}
            </p>
            <p className="text-xl font-black text-slate-800">
                S/ {parseFloat(eco?.monto ?? 0).toFixed(2)}
            </p>
            <p className="text-[11px] font-bold text-slate-500 mt-1">
                de S/ {parseFloat(eco?.monto_original ?? 0).toFixed(2)}
            </p>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-slate-700 rounded-full transition-all duration-500"
                    style={{ width: `${((eco?.monto ?? 0) * 100) / (eco?.monto_original || 1)}%` }}
                />
            </div>
        </div>

        {/* Interés */}
        <div className="p-4 bg-brand-gold-light/20 rounded-2xl border border-brand-gold/10">
            <p className="text-[10px] font-black uppercase text-brand-gold-dark mb-1">
                Interés Pendiente
            </p>
            <p className="text-xl font-black text-brand-gold-dark">
                S/ {parseFloat(eco?.interes_monto ?? 0).toFixed(2)}
            </p>
            <p className="text-[11px] font-bold text-brand-gold-dark/70 mt-1">
                de S/ {parseFloat(eco?.interes_original ?? 0).toFixed(2)}
            </p>
            <div className="mt-3 w-full bg-brand-gold/20 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-brand-gold rounded-full transition-all duration-500"
                    style={{ width: `${((eco?.interes_monto ?? 0) * 100) / (eco?.interes_original || 1)}%` }}
                />
            </div>
        </div>

        {/* Saldo total */}
        <div className="p-4 bg-brand-red rounded-2xl shadow-xl shadow-brand-red/20">
            <p className="text-[10px] font-black uppercase text-white/70 mb-1">
                {estadoPrestamo === 3 ? 'Total Cobrado' : 'Saldo Pendiente'}
            </p>
            <p className="text-xl font-black text-white">
                S/ {parseFloat(eco?.total_prestamo ?? 0).toFixed(2)}
            </p>
            <p className="text-[11px] font-bold text-white/70 mt-1">
                de S/ {parseFloat(eco?.total_original ?? 0).toFixed(2)}
            </p>
            <div className="mt-3 w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${((eco?.total_prestamo ?? 0) * 100) / (eco?.total_original || 1)}%` }}
                />
            </div>
        </div>

        {/* Valor cuota + seguro */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                    {esVistaIntegrante ? 'Cuota Individual' : 'Valor Cuota'}
                </p>
                <p className="text-xl font-black text-slate-800">
                    S/ {parseFloat(eco?.valor_cuota ?? 0).toFixed(2)}
                </p>
                <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase">
                    {eco?.frecuencia}
                </p>
                <p className="text-[10px] font-bold text-brand-gold-dark mt-0.5">
                    Tasa: {eco?.interes_porc}%
                </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-[9px] font-black uppercase text-slate-400">Seguro</p>
                <p className="text-sm font-black text-slate-700">
                    S/ {parseFloat(eco?.seguro || 0).toFixed(2)}
                </p>
                <p className={`text-[8px] font-black uppercase mt-1 ${eco?.seguro_financiado ? 'text-brand-gold-dark' : 'text-green-600'}`}>
                    {eco?.seguro_financiado ? 'Financiado' : '✓ Ya Cobrado'}
                </p>
            </div>
        </div>

    </div>
);

export default DatosEconomicosCards;