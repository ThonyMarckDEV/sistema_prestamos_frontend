import React from 'react';
import { useStore } from 'hooks/Operacion/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import PrestamoSearchSelect from 'components/Shared/Comboboxes/PrestamoSearchSelect';
import PagoCuotaModal from './PagoCuotaModal'; 
import AbrirSesionModal from './AbrirSesionModal';
import CerrarSesionModal from './CerrarSesionModal';
import PdfModal from 'components/Shared/Modals/PdfModal'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { CurrencyDollarIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const { 
        loading, sesionActiva, alert, setAlert,
        tipoOperacion, setTipoOperacion,
        prestamoSeleccionado, handleSelectPrestamo, prestamoDetalle, handleDesembolsar,
        isPagoModalOpen, setIsPagoModalOpen, cuotaSeleccionada, openPagoModal, handleConfirmarPago,
        isAbrirModalOpen, setIsAbrirModalOpen,
        isCerrarModalOpen, setIsCerrarModalOpen,
        handleAbrirSesion, handleCerrarSesion,
        isPdfModalOpen, setIsPdfModalOpen, pdfTitle, pdfBase64 
    } = useStore();

    if (loading && sesionActiva === undefined) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <PageHeader title="Caja Operativa" icon={CurrencyDollarIcon} />
            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            {sesionActiva === null && !loading ? (
                <div className="mt-10 bg-white p-10 rounded-3xl border border-red-100 shadow-sm text-center animate-in fade-in zoom-in duration-300 max-w-2xl mx-auto">
                    <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LockClosedIcon className="w-12 h-12 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-2">Turno Cerrado</h2>
                    <p className="text-slate-500 text-sm font-medium mb-8 max-w-md mx-auto">
                        Actualmente no tienes ninguna caja asignada. Para realizar cobros o desembolsos, debes abrir un turno.
                    </p>
                    <button 
                        onClick={() => setIsAbrirModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-10 py-4 rounded-xl font-black uppercase text-sm shadow-xl shadow-red-500/30 hover:bg-red-700 transition-all hover:scale-105"
                    >
                        <LockOpenIcon className="w-5 h-5" /> Abrir Turno de Caja
                    </button>
                </div>
            ) : sesionActiva ? (
                <div className="mt-6 space-y-6 animate-in fade-in duration-500">
                    <div className="flex flex-col sm:flex-row items-center justify-between bg-black p-5 rounded-2xl shadow-xl shadow-slate-200 text-white gap-4">
                        <div className="flex flex-col text-center sm:text-left">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Caja en Operación</span>
                            <span className="text-lg font-black">{sesionActiva.caja?.nombre}</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efectivo Físico Esperado</span>
                                <span className="text-xl font-black italic text-green-400">S/ {sesionActiva.saldo_esperado}</span>
                            </div>
                            <div className="border-l border-slate-700 pl-6">
                                <button 
                                    onClick={() => setIsCerrarModalOpen(true)}
                                    className="bg-white text-black px-6 py-2.5 rounded-lg font-black uppercase text-xs hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors border-2 border-transparent"
                                >
                                    Cerrar Turno
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex gap-4 mb-6">
                            <button onClick={() => { setTipoOperacion('cobro'); handleSelectPrestamo(null); }} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase border-2 transition-all ${tipoOperacion === 'cobro' ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>Cobrar Cuota</button>
                            <button onClick={() => { setTipoOperacion('desembolso'); handleSelectPrestamo(null); }} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase border-2 transition-all ${tipoOperacion === 'desembolso' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>Realizar Desembolso</button>
                        </div>

                        <PrestamoSearchSelect 
                            tipoOperacion={tipoOperacion} 
                            onSelect={handleSelectPrestamo} 
                            disabled={loading}
                        />

                        {prestamoSeleccionado && tipoOperacion === 'desembolso' && (
                            <div className="mt-6 p-8 bg-blue-50 rounded-2xl border border-blue-200 text-center animate-in fade-in">
                                <h4 className="font-black text-blue-900 uppercase text-lg mb-2">Autorizar Desembolso</h4>
                                <p className="text-sm font-bold text-blue-700">Cliente: {prestamoSeleccionado.cliente}</p>
                                <h2 className="text-5xl font-black text-blue-600 italic my-6">S/ {prestamoSeleccionado.monto}</h2>
                                <button onClick={handleDesembolsar} disabled={loading} className="px-12 py-4 bg-blue-600 text-white rounded-xl font-black uppercase shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:opacity-50">
                                    {loading ? 'Procesando...' : 'Entregar Dinero Físico'}
                                </button>
                            </div>
                        )}

                        {prestamoSeleccionado && tipoOperacion === 'cobro' && prestamoDetalle && (
                            <div className="mt-6 animate-in fade-in">
                                <h4 className="font-black text-slate-700 uppercase text-xs mb-3">Cronograma de Pagos</h4>
                                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 text-slate-500 uppercase font-black">
                                            <tr>
                                                <th className="px-4 py-3">N°</th>
                                                <th className="px-4 py-3">Vence</th>
                                                <th className="px-4 py-3">Monto + Mora</th>
                                                <th className="px-4 py-3">Estado</th>
                                                <th className="px-4 py-3 text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {prestamoDetalle.cronograma.map((c) => (
                                                <tr key={c.id} className={c.estado === 2 ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50 transition-colors'}>
                                                    <td className="px-4 py-3 font-bold">{c.nro}</td>
                                                    <td className="px-4 py-3 font-medium">{c.vencimiento}</td>
                                                    <td className="px-4 py-3 font-black text-slate-800">
                                                        S/ {(parseFloat(c.monto) + parseFloat(c.mora)).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-[9px] font-black border ${c.estado === 2 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                                            {c.estado === 2 ? 'PAGADO' : 'PENDIENTE'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        {c.estado !== 2 && (
                                                            <button onClick={() => openPagoModal(c)} className="px-4 py-2 bg-black text-white rounded-lg font-black text-[10px] uppercase shadow-md hover:bg-slate-800 transition-colors hover:scale-105">
                                                                Pagar
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            <PagoCuotaModal 
                isOpen={isPagoModalOpen}
                onClose={() => setIsPagoModalOpen(false)}
                cuota={cuotaSeleccionada}
                onConfirm={handleConfirmarPago}
                loading={loading}
            />

            <AbrirSesionModal 
                isOpen={isAbrirModalOpen}
                onClose={() => setIsAbrirModalOpen(false)}
                onConfirm={handleAbrirSesion}
                loading={loading}
            />

            <CerrarSesionModal 
                isOpen={isCerrarModalOpen}
                onClose={() => setIsCerrarModalOpen(false)}
                onConfirm={handleCerrarSesion}
                sesionActiva={sesionActiva}
                loading={loading}
            />

            <PdfModal 
                isOpen={isPdfModalOpen} 
                onClose={() => setIsPdfModalOpen(false)} 
                title={pdfTitle} 
                base64={pdfBase64} 
            />
        </div>
    );
};

export default Store;