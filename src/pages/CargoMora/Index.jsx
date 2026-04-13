import React from 'react';
import { Link } from 'react-router-dom';
import { useIndex } from 'hooks/CargoMora/useIndex';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { ScaleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const Index = () => {
    const { cargos, alert, setAlert, loading } = useIndex();

    if (loading && cargos.length === 0) {
        return <LoadingScreen />;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <PageHeader 
                title="Configuración de Moras" 
                icon={ScaleIcon} 
                buttonText="+ Nuevo Rango" 
                buttonLink="/cargoMora/agregar" 
            />
            
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            
            {/* Si terminó de cargar y no hay cargos, mostramos un mensaje amigable */}
            {!loading && cargos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 mt-6">
                    <ScaleIcon className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">No hay rangos de mora configurados.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                    {cargos.map(c => (
                        <div key={c.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-600 rounded-xl">
                                        <ScaleIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-black text-slate-800 uppercase tracking-tighter italic">
                                        {c.dias}
                                    </span>
                                </div>
                                <Link to={`/cargoMora/editar/${c.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                    <PencilSquareIcon className="w-5 h-5" />
                                </Link>
                            </div>

                            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <MontoDisplay label="300 - 1k" valor={c.monto_300_1000} />
                                <MontoDisplay label="1k - 2k" valor={c.monto_1001_2000} />
                                <MontoDisplay label="2k - 3k" valor={c.monto_2001_3000} />
                                <MontoDisplay label="3k - 4k" valor={c.monto_3001_4000} />
                                <MontoDisplay label="4k - 5k" valor={c.monto_4001_5000} />
                                <MontoDisplay label="5k - 6k" valor={c.monto_5001_6000} />
                                <MontoDisplay label="6k a más" valor={c.monto_mas_6000} highlight />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const MontoDisplay = ({ label, valor, highlight }) => (
    <div className={`p-2 rounded-xl border ${highlight ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
        <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">{label}</span>
        <span className={`text-xs font-black ${highlight ? 'text-red-600' : 'text-slate-700'}`}>
            S/ {parseFloat(valor || 0).toFixed(2)}
        </span>
    </div>
);

export default Index;