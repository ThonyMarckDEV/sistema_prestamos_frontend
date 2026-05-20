import React from 'react';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import EmpleadoSearchSelect from 'components/Shared/Comboboxes/EmpleadoSearchSelect';
import { useStore } from 'hooks/Pin/useStore';
import { ShieldCheckIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const {
        loading, alert, setAlert,
        pinGenerado, setPinGenerado,
        copiado, usuarioKey,
        form, handleChange,
        handleGenerar, handleCopiar,
    } = useStore({ isOpen: true });

    return (
        <div className="container mx-auto p-4 sm:p-6 w-full max-w-full xl:max-w-lg">
            <PageHeader title="Generar PIN de Autorización" icon={ShieldCheckIcon} />

            <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

                {!pinGenerado ? (
                    <div className="flex flex-col gap-5">

                        {/* Usuario destinatario */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">
                                Usuario Destinatario
                                <span className="text-slate-400 normal-case font-medium ml-1">(vacío = cualquiera)</span>
                            </label>
                            <EmpleadoSearchSelect
                                key={usuarioKey}
                                onSelect={(u) => handleChange('usuario_id', u ? u.id : null)}
                                clearOnSelect={false}
                            />
                            {form.usuario_id && (
                                <p className="text-[9px] text-green-600 font-bold mt-1">
                                    ✓ Solo este usuario podrá usar el PIN
                                </p>
                            )}
                        </div>

                        {/* Usos */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">
                                Número de Usos
                                <span className="text-slate-400 normal-case font-medium ml-1">(0 = ilimitado)</span>
                            </label>
                            <input
                                type="number" min="0" max="100"
                                value={form.usos_maximos}
                                onChange={e => handleChange('usos_maximos', parseInt(e.target.value) || 0)}
                                className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-slate-50 focus:ring-2 focus:ring-brand-red outline-none"
                            />
                        </div>

                        {/* Expiración */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">
                                Expiración
                                <span className="text-slate-400 normal-case font-medium ml-1">(0 = sin expiración)</span>
                            </label>
                            <div className="flex gap-2">
                                {[1, 5, 10, 30, 0].map(m => (
                                    <button
                                        key={m} type="button"
                                        onClick={() => handleChange('expira_minutos', m)}
                                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black border-2 transition-all
                                            ${form.expira_minutos === m
                                                ? 'border-brand-red bg-brand-red-light text-brand-red'
                                                : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                    >
                                        {m === 0 ? '∞' : `${m}m`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button" onClick={handleGenerar} disabled={loading}
                            className="w-full bg-brand-red text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-brand-red/25 hover:bg-brand-red-dark transition-all disabled:opacity-30 flex items-center justify-center gap-2 active:scale-95"
                        >
                            {loading
                                ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Generando...</>
                                : <><ShieldCheckIcon className="w-4 h-4" /> Generar PIN</>
                            }
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-5 py-2">
                        <div className="p-3 rounded-2xl bg-green-50 border border-green-200">
                            <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                        </div>

                        <p className="text-xs font-black text-slate-700 uppercase">PIN Generado Exitosamente</p>

                        {/* PIN grande */}
                        <div className="bg-slate-900 rounded-2xl px-10 py-6 flex items-center gap-5">
                            <span className="font-mono text-5xl font-black text-white tracking-[0.4em]">
                                {pinGenerado.pin}
                            </span>
                            <button onClick={handleCopiar} type="button" className="text-slate-400 hover:text-white transition-colors">
                                {copiado
                                    ? <CheckIcon className="w-6 h-6 text-green-400" />
                                    : <ClipboardDocumentIcon className="w-6 h-6" />
                                }
                            </button>
                        </div>

                        {/* Detalles */}
                        <div className="w-full space-y-2 bg-slate-50 rounded-xl p-4">
                            <div className="flex justify-between text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Destinatario</span>
                                <span className="font-black text-slate-700">{pinGenerado.para_usuario}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Usos</span>
                                <span className="font-black text-slate-700">
                                    {pinGenerado.usos_maximos === 0 ? 'Ilimitado' : pinGenerado.usos_maximos}
                                </span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-slate-400 font-bold uppercase">Expira</span>
                                <span className="font-black text-slate-700">
                                    {pinGenerado.expira_at
                                        ? new Date(pinGenerado.expira_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
                                        : 'Sin expiración'}
                                </span>
                            </div>
                        </div>

                        <p className="text-[10px] text-slate-400 text-center font-medium px-4">
                            Comparte este PIN solo con el usuario autorizado. No lo guardes en ningún lugar.
                        </p>

                        <button
                            type="button"
                            onClick={() => setPinGenerado(null)}
                            className="w-full border-2 border-brand-red text-brand-red py-3.5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-brand-red-light transition-all"
                        >
                            Generar Otro PIN
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Store;