import React from 'react';
import { useStore } from 'hooks/Pago/useStore';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { CreditCardIcon, CloudArrowUpIcon, TicketIcon } from '@heroicons/react/24/outline';

const Store = () => {
    const {
        loading, alert, setAlert,
        misPrestamos, prestamoSeleccionado, handleSelectPrestamo,
        isModalOpen, setIsModalOpen, cuotaParaPagar, setCuotaParaPagar,
        handleConfirmarPagoVirtual
    } = useStore();

    // Si está cargando los préstamos al inicio
    if (loading && misPrestamos.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
            <PageHeader title="Mi Portal de Pagos" icon={CreditCardIcon} />
            
            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                onClose={() => setAlert(null)} 
            />

            <div className="space-y-6 mt-6">
                {/* 1. SELECCIÓN DE PRÉSTAMO */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                        Selecciona uno de tus préstamos activos
                    </label>
                    <select 
                        onChange={(e) => handleSelectPrestamo(e.target.value)}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                    >
                        <option value="">-- Elige el préstamo que deseas pagar --</option>
                        {misPrestamos.map(p => (
                            <option key={p.id} value={p.id}>
                                Préstamo #{p.id} - Monto: S/ {p.monto} (Desembolsado: {p.fecha_desembolso})
                            </option>
                        ))}
                    </select>
                </div>

                {/* 2. CRONOGRAMA DE CUOTAS */}
                {prestamoSeleccionado && (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-black text-slate-800 uppercase text-xs tracking-tighter">Estado de mis cuotas</h3>
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                PRÉSTAMO #{prestamoSeleccionado.id}
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-white text-slate-400 uppercase font-black">
                                    <tr>
                                        <th className="px-6 py-4">N°</th>
                                        <th className="px-6 py-4">Vencimiento</th>
                                        <th className="px-6 py-4">Monto Total</th>
                                        <th className="px-6 py-4 text-center">Estado</th>
                                        <th className="px-6 py-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {prestamoSeleccionado.cronograma?.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-400">#{c.nro}</td>
                                            <td className="px-6 py-4 font-bold">{c.vencimiento}</td>
                                            <td className="px-6 py-4 font-black text-slate-900 text-sm">
                                                S/ {(parseFloat(c.monto) + parseFloat(c.mora)).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                                                    c.estado === 2 ? 'bg-green-50 text-green-600 border-green-100' :
                                                    c.estado === 5 ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                }`}>
                                                    {c.estado === 2 ? 'PAGADO' : c.estado === 5 ? 'EN REVISIÓN' : 'PENDIENTE'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {c.estado === 1 && (
                                                    <button 
                                                        onClick={() => { setCuotaParaPagar(c); setIsModalOpen(true); }}
                                                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 transition-all"
                                                    >
                                                        <CloudArrowUpIcon className="w-4 h-4" /> Pagar Cuota
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

            {/* MODAL PARA SUBIR EL BOUCHER */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                                <TicketIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Reportar Pago</h2>
                            <p className="text-slate-400 text-xs font-bold mt-1">
                                Cuota #{cuotaParaPagar.nro} • S/ {(parseFloat(cuotaParaPagar.monto) + parseFloat(cuotaParaPagar.mora)).toFixed(2)}
                            </p>
                        </div>
                        
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const data = { numero_operacion: e.target.numero_operacion.value };
                            const file = e.target.comprobante.files[0];
                            handleConfirmarPagoVirtual(data, file);
                        }} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 ml-1 mb-1">N° de Operación (Yape / Plin / Banco)</label>
                                <input name="numero_operacion" required type="text" className="w-full p-4 bg-slate-100 border-none rounded-2xl font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: 832912" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 ml-1 mb-1">Foto del Comprobante</label>
                                <input name="comprobante" required type="file" accept="image/*" className="w-full text-xs font-bold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            
                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black uppercase text-xs text-slate-400 hover:text-slate-600">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={loading} className="flex-1 py-4 bg-black text-white font-black uppercase text-xs rounded-2xl shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50">
                                    {loading ? 'Subiendo...' : 'Enviar Pago'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Store;