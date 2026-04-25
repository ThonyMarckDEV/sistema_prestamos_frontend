import React from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/Parametro/useIndex';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { AdjustmentsHorizontalIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const { loading, parametros, alert, setAlert } = useIndex();

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
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

            <div className="mt-6 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                {/* Header tabla */}
                <div className="grid grid-cols-12 px-6 py-3 bg-slate-50 border-b border-slate-100">
                    <span className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clave</span>
                    <span className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</span>
                    <span className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</span>
                    <span className="col-span-1"></span>
                </div>

                {parametros.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                        No hay parámetros registrados
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {parametros.map((p) => (
                            <div key={p.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/60 transition-all">
                                <div className="col-span-3">
                                    <span className="inline-block bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wide">
                                        {p.clave}
                                    </span>
                                </div>
                                <div className="col-span-3">
                                    <span className="text-lg font-black text-brand-red">
                                        {p.valor}
                                    </span>
                                </div>
                                <div className="col-span-5">
                                    <span className="text-xs text-slate-500 font-medium">
                                        {p.descripcion || '—'}
                                    </span>
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <Link
                                        to={`/parametro/editar/${p.id}`}
                                        className="p-2 text-slate-400 hover:text-brand-red hover:bg-brand-red-light rounded-xl transition-all border border-transparent hover:border-brand-red/20 shadow-sm"
                                        title="Editar parámetro"
                                    >
                                        <PencilSquareIcon className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 text-center">
                Los parámetros afectan el comportamiento global del sistema. Modifícalos con cuidado.
            </p>
        </div>
    );
};

export default Index;