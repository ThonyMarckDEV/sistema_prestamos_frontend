import React from 'react';

const BarraRiesgoSBS = ({ titulo, sbs }) => {
    if (!sbs) return null;
    
    const { calificacion, dias_atraso, color } = sbs;

    // Estructura de la barra Sentinel
    const niveles = [
        { id: 'NORMAL', label: 'NORMAL', bgColor: 'bg-green-500' },
        { id: 'CPP', label: 'CPP', bgColor: 'bg-yellow-400' },
        { id: 'DEFICIENTE', label: 'DEFIC.', bgColor: 'bg-orange-500' },
        { id: 'DUDOSO', label: 'DUDOSO', bgColor: 'bg-red-500' },
        { id: 'PERDIDA', label: 'PÉRDIDA', bgColor: 'bg-slate-900' },
    ];

    return (
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative hover:shadow-md transition-all w-full h-full">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">
                {titulo}
            </h4>
            
            {/* Contenedor de la Barra SBS */}
            <div className="w-full max-w-[280px] flex flex-col">
                
                {/* 1. Fila de Flechas (Indicador) */}
                <div className="flex w-full mb-1.5 h-3">
                    {niveles.map((nivel) => (
                        <div key={`arrow-${nivel.id}`} className="flex-1 flex justify-center items-end">
                            {calificacion === nivel.id && (
                                /* Triángulo dibujado con CSS (Bordes) + Animación de caída */
                                <div className="w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent border-t-slate-800 animate-in slide-in-from-top-3 fade-in duration-500"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 2. Fila de Colores (La Barra Principal) */}
                <div className="flex w-full h-3.5 rounded-sm overflow-hidden shadow-inner">
                    {niveles.map((nivel) => (
                        <div key={`bar-${nivel.id}`} className={`flex-1 ${nivel.bgColor}`}></div>
                    ))}
                </div>

                {/* 3. Fila de Textos (Etiquetas) */}
                <div className="flex w-full mt-2">
                    {niveles.map((nivel) => (
                        <div key={`label-${nivel.id}`} className="flex-1 text-center text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                            {nivel.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Detalles Inferiores (Badge y Días) */}
            <div className="mt-6 text-center flex flex-col items-center">
                {/* El color del badge viene desde tu backend de Laravel */}
                <span className={`text-[10px] px-4 py-1.5 rounded-lg font-black uppercase border shadow-sm ${color}`}>
                    {calificacion}
                </span>
                <span className="text-xs text-slate-500 font-bold mt-2.5 uppercase tracking-wide">
                    {dias_atraso} Días de atraso
                </span>
            </div>
        </div>
    );
};

export default BarraRiesgoSBS;