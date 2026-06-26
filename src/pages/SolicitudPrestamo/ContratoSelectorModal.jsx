import React from 'react';
import { XMarkIcon, DocumentArrowDownIcon, UserIcon } from '@heroicons/react/24/outline';

const ContratoSelectorModal = ({ isOpen, onClose, data, onSelectContrato }) => {
    if (!isOpen || !data) return null;

    const { title, pdf, contratos_individuales = [] } = data;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden border-t sm:border border-slate-700 max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
                    <div className="min-w-0">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">
                            {title || 'Contratos disponibles'}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase">
                            Selecciona el contrato que deseas ver
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors shrink-0"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2 overflow-y-auto">
                    {/* Contrato grupal */}
                    <button
                        type="button"
                        onClick={() =>
                            onSelectContrato({
                                pdf: pdf,
                                title: title || 'Contrato Grupal',
                            })
                        }
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-brand-red hover:bg-brand-red-light transition-colors text-left"
                    >
                        <div className="w-10 h-10 rounded-lg bg-brand-red-light flex items-center justify-center shrink-0">
                            <DocumentArrowDownIcon className="w-5 h-5 text-brand-red" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800">Contrato Grupal</p>
                            <p className="text-[11px] text-slate-500">Documento completo del grupo</p>
                        </div>
                    </button>

                    {contratos_individuales.length > 0 && (
                        <>
                            <p className="text-[10px] font-bold text-slate-400 uppercase px-1 pt-3">
                                Integrantes
                            </p>
                            {contratos_individuales.map((integrante) => (
                                <button
                                    type="button"
                                    key={integrante.cliente_id}
                                    onClick={() =>
                                        onSelectContrato({
                                            pdf: integrante.pdf,
                                            title: `Contrato — ${integrante.cliente_nombre}`,
                                        })
                                    }
                                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                        <UserIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">
                                            {integrante.cliente_nombre}
                                        </p>
                                        <p className="text-[11px] text-slate-500 uppercase font-medium">
                                            {integrante.cargo}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContratoSelectorModal;