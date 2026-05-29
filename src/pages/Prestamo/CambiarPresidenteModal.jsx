import React from 'react';
import ViewModal from 'components/Shared/Modals/ViewModal';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { UserIcon, StarIcon } from '@heroicons/react/24/outline';
import { useCambiarPresidenteModal } from 'hooks/Prestamo/useCambiarPresidenteModal';

const CambiarPresidenteModal = ({ isOpen, onClose, prestamo, onSuccess }) => {
    const {
        loading, alert, setAlert,
        nuevoPresidenteId, setNuevoPresidenteId,
        presidenteActual, candidatos,
        handleSubmit, submitDisabled,
    } = useCambiarPresidenteModal({ isOpen, prestamo, onSuccess });

    if (!prestamo) return null;

    const handleClose = () => { if (!loading) onClose(); };

    return (
        <ViewModal isOpen={isOpen} onClose={handleClose} hideFooter={true} title="Cambiar Presidente del Grupo" size="md">
            <div className="relative p-1 space-y-4">

                {loading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3 rounded-2xl">
                        <div className="w-8 h-8 border-4 border-brand-red/20 border-t-brand-red rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Procesando cambio...</p>
                    </div>
                )}

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-brand-gold/10 rounded-lg">
                        <StarIcon className="w-5 h-5 text-brand-gold-dark" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Presidente Actual</p>
                        <p className="text-sm font-black text-slate-800 uppercase">{presidenteActual?.nombre ?? 'Sin presidente'}</p>
                    </div>
                </div>

                <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nuevo Presidente *</label>
                        {candidatos.length === 0 ? (
                            <p className="text-xs text-red-500 font-bold">No hay integrantes disponibles para asumir la presidencia.</p>
                        ) : (
                            <div className="space-y-2">
                                {candidatos.map(int => (
                                    <div key={int.id} onClick={() => !loading && setNuevoPresidenteId(int.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${
                                            nuevoPresidenteId === int.id ? 'border-brand-red bg-brand-red-light/30' : 'border-slate-100 hover:border-brand-red/30 bg-white'}`}>
                                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${nuevoPresidenteId === int.id ? 'border-brand-red bg-brand-red' : 'border-slate-300'}`} />
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-slate-100 rounded-lg"><UserIcon className="w-4 h-4 text-slate-500" /></div>
                                            <div>
                                                <p className="text-[11px] font-black text-slate-700 uppercase">{int.nombre}</p>
                                                <p className="text-[9px] font-bold text-brand-gold-dark uppercase">{int.cargo}</p>
                                            </div>
                                        </div>
                                        <span className="ml-auto text-xs font-black text-brand-red">S/ {int.monto}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={handleClose} disabled={loading}
                            className="px-4 py-2 text-xs font-black text-slate-500 hover:bg-slate-100 rounded-xl uppercase disabled:opacity-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={submitDisabled}
                            className="flex items-center gap-2 px-6 py-2 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-black uppercase rounded-xl transition-all shadow-md disabled:opacity-50">
                            {loading ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Procesando...</> : <><StarIcon className="w-4 h-4" /> Confirmar Cambio</>}
                        </button>
                    </div>
                </form>
            </div>
        </ViewModal>
    );
};

export default CambiarPresidenteModal;