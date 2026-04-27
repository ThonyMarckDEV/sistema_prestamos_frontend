import React from 'react';

const niveles = [
    { id: 'NORMAL',     label: 'NORMAL',  bgColor: 'bg-green-500'  },
    { id: 'CPP',        label: 'CPP',      bgColor: 'bg-yellow-400' },
    { id: 'DEFICIENTE', label: 'DEFIC.',   bgColor: 'bg-orange-500' },
    { id: 'DUDOSO',     label: 'DUDOSO',   bgColor: 'bg-red-500'    },
    { id: 'PERDIDA',    label: 'PÉRDIDA',  bgColor: 'bg-slate-900'  },
];

const BarraRiesgoSBS = ({ titulo, sbs }) => {
    const actual = sbs?.actual ?? null;

    return (
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all w-full h-full">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">
                {titulo}
            </h4>

            <div className="w-full max-w-[280px] flex flex-col">
                {/* Flecha indicadora */}
                <div className="flex w-full mb-1.5 h-3">
                    {niveles.map((nivel) => (
                        <div key={`arrow-${nivel.id}`} className="flex-1 flex justify-center items-end">
                            {actual && actual.calificacion === nivel.id && (
                                <div className="w-0 h-0 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent border-t-slate-800 animate-in slide-in-from-top-3 fade-in duration-500" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Barra */}
                <div className={`flex w-full h-3.5 rounded-sm overflow-hidden shadow-inner ${!actual ? 'opacity-20' : ''}`}>
                    {niveles.map((n) => (
                        <div key={`bar-${n.id}`} className={`flex-1 ${n.bgColor}`} />
                    ))}
                </div>

                {/* Etiquetas */}
                <div className="flex w-full mt-2">
                    {niveles.map((n) => (
                        <div key={`label-${n.id}`} className={`flex-1 text-center text-[9px] font-bold uppercase tracking-tight ${actual ? 'text-slate-400' : 'text-slate-300'}`}>
                            {n.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Badge */}
            <div className="mt-6 text-center flex flex-col items-center">
                {actual ? (
                    <>
                        <span className={`text-[10px] px-4 py-1.5 rounded-lg font-black uppercase border shadow-sm ${actual.color}`}>
                            {actual.calificacion}
                        </span>
                        <span className="text-xs text-slate-500 font-bold mt-2.5 uppercase tracking-wide">
                            {actual.dias_atraso} días de atraso
                        </span>

                        {/* Contexto préstamo */}
                        {actual.prestamo_id && (
                            <div className="mt-3 text-center text-[11px] text-slate-700 font-bold space-y-0.5 border-t border-slate-100 pt-3 w-full">
                                <p>
                                    Préstamo #{String(actual.prestamo_id).padStart(5, '0')}
                                    {actual.es_grupal && actual.grupo_nombre && (
                                        <span className="ml-1"> — GRUPO: {actual.grupo_nombre}</span>
                                    )}
                                </p>
                                <p>Cuota N° {actual.numero_cuota}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <span className="text-[10px] px-4 py-1.5 rounded-lg font-black uppercase border shadow-sm bg-slate-100 text-slate-400 border-slate-200">
                            SIN DATOS
                        </span>
                        <span className="text-xs text-slate-400 font-bold mt-2.5 uppercase tracking-wide">
                            Sin préstamos vigentes
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default BarraRiesgoSBS;