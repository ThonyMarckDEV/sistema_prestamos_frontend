import React from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/Parametro/useIndex';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import {
    AdjustmentsHorizontalIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';

const Index = () => {
    const { loading, parametros, alert, setAlert } = useIndex();

    if (loading) return <LoadingScreen />;

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-5">
            <PageHeader
                title="Parámetros del Sistema"
                icon={AdjustmentsHorizontalIcon}
            />

            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                details={alert?.details}
                onClose={() => setAlert(null)}
            />

            <div className="mt-6 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Desktop */}
                <div className="hidden md:block">
                    {/* Header */}
                    <div className="grid grid-cols-12 px-6 py-4 bg-slate-50 border-b border-slate-100">
                        <span className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Clave
                        </span>

                        <span className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Valor
                        </span>

                        <span className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Descripción
                        </span>

                        <span className="col-span-1"></span>
                    </div>

                    {parametros.length === 0 ? (
                        <div className="py-16 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                            No hay parámetros registrados
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {parametros.map((p) => (
                                <div
                                    key={p.id}
                                    className="grid grid-cols-12 px-6 py-5 items-center hover:bg-slate-50 transition-all"
                                >
                                    <div className="col-span-3">
                                        <span className="inline-flex items-center bg-slate-900 text-white text-[11px] font-black px-4 py-2 rounded-xl uppercase tracking-wide break-all">
                                            {p.clave}
                                        </span>
                                    </div>

                                    <div className="col-span-3">
                                        <span className="text-xl font-black text-brand-red break-words">
                                            {p.valor}
                                        </span>
                                    </div>

                                    <div className="col-span-5">
                                        <span className="text-sm text-slate-500 font-medium leading-relaxed">
                                            {p.descripcion || '—'}
                                        </span>
                                    </div>

                                    <div className="col-span-1 flex justify-end">
                                        <Link
                                            to={`/parametro/editar/${p.id}`}
                                            className="p-2.5 text-slate-400 hover:text-brand-red hover:bg-brand-red-light rounded-xl transition-all"
                                        >
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    {parametros.length === 0 ? (
                        <div className="py-14 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                            No hay parámetros registrados
                        </div>
                    ) : (
                        <div className="p-4 space-y-4">
                            {parametros.map((p) => (
                                <div
                                    key={p.id}
                                    className="border border-slate-100 rounded-2xl p-4 shadow-sm bg-white"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <span className="inline-flex max-w-full bg-slate-900 text-white text-[10px] font-black px-3 py-2 rounded-xl uppercase tracking-wide break-all">
                                                {p.clave}
                                            </span>

                                            <div className="mt-3">
                                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                                                    Valor
                                                </p>

                                                <p className="text-2xl font-black text-brand-red break-words">
                                                    {p.valor}
                                                </p>
                                            </div>

                                            <div className="mt-3">
                                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                                                    Descripción
                                                </p>

                                                <p className="text-sm text-slate-500 leading-relaxed break-words">
                                                    {p.descripcion || '—'}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/parametro/editar/${p.id}`}
                                            className="shrink-0 p-3 text-slate-400 hover:text-brand-red hover:bg-brand-red-light rounded-xl transition-all border border-slate-100"
                                        >
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-5 text-center leading-relaxed px-2">
                Los parámetros afectan el comportamiento global del sistema.
                Modifícalos con cuidado.
            </p>
        </div>
    );
};

export default Index;