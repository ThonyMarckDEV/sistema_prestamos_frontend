import React, { useEffect, useState } from 'react';
import { useRegistrar } from 'hooks/Asistencia/useRegistrar';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { QrCodeIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const SCANNER_ID = 'qr-reader-asistencia';

const Registrar = () => {
    // Toda la lógica pesada vive en el hook, como debe ser
    const { 
        loading, alert, resultado, camaraError, 
        iniciarCamara, detenerCamara, resetearEscaneo 
    } = useRegistrar(SCANNER_ID);
    
    const [intento, setIntento] = useState(0);

    useEffect(() => {
        iniciarCamara();
        return () => detenerCamara();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intento]); 

    return (
        <div className="container mx-auto p-4 sm:p-6 transition-colors">
            <PageHeader
                title="Registrar Asistencia"
                icon={QrCodeIcon}
                buttonText="Ver Historial"
                buttonLink="/asistencia/listar"
            />

            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                details={alert?.details} 
                onClose={resetearEscaneo} 
            />

            <div className="mt-6 max-w-xl mx-auto">
                {/* Contenedor Principal (Claro / Oscuro) */}
                <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-2xl shadow-sm dark:shadow-black/20 border border-slate-100 dark:border-dark-border transition-colors duration-300">

                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-dark-border pb-3">
                        <h3 className="text-base font-black text-slate-800 dark:text-dark-text flex items-center gap-2 uppercase tracking-wide transition-colors">
                            <QrCodeIcon className="w-6 h-6 text-brand-red dark:text-brand-gold" /> 
                            Escáner de Credencial
                        </h3>
                        {loading && (
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-red dark:text-brand-gold animate-pulse">
                                <div className="w-2 h-2 bg-brand-red dark:bg-brand-gold rounded-full"></div>
                                Procesando
                            </span>
                        )}
                    </div>

                    {/* Marco de la Cámara */}
                    <div className="relative bg-slate-100 dark:bg-dark-surface-alt rounded-xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-dark-border min-h-[300px] flex items-center justify-center transition-colors">
                        
                        {/* El lector de cámara */}
                        <div
                            id={SCANNER_ID}
                            className={`w-full h-full ${camaraError ? 'hidden' : 'block'}`}
                        />

                        {/* Mensaje de Error de Cámara adaptado al tema */}
                        {camaraError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-dark-surface-alt">
                                <div className="p-4 bg-amber-100 dark:bg-amber-500/10 rounded-full mb-4 border border-amber-200 dark:border-amber-500/20">
                                    <ExclamationTriangleIcon className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                                </div>
                                <p className="text-slate-800 dark:text-dark-text font-black uppercase text-sm mb-2">
                                    Cámara no disponible
                                </p>
                                <p className="text-slate-500 dark:text-dark-text-muted text-xs font-medium mb-6 max-w-xs leading-relaxed">
                                    Verifica que le diste permiso de cámara a esta página web o que ninguna otra aplicación la esté usando.
                                </p>
                               <button
                                    type="button"
                                    onClick={() => setIntento(prev => prev + 1)}
                                    className="px-6 py-2.5 bg-red-800 hover:bg-red-900 dark:bg-brand-red-glow dark:hover:bg-red-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-[0.98]"
                                >
                                    Reintentar Cámara
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                {/* Tarjeta de Éxito (Sincronizada con los colores de tu Index.jsx) */}
                {resultado && (
                    <div className="mt-6 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-6 flex items-center gap-4 transition-colors animate-in fade-in slide-in-from-bottom-4 shadow-sm">
                        <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-xl border border-green-200 dark:border-green-500/30 shrink-0">
                            <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-green-800 dark:text-green-400 font-black uppercase text-sm tracking-wide">
                                {resultado.tipo === 'ingreso' ? 'Ingreso registrado' : 'Salida registrada'}
                            </p>
                            <p className="text-green-700 dark:text-green-500 text-xs font-bold mt-1 opacity-90">
                                Hora de marca: {resultado.hora}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Registrar;