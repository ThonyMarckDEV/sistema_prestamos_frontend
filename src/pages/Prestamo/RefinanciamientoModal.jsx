import React from 'react';
import Modal from 'components/Shared/Modals/ViewModal';
import ProductoSearchSelect from 'components/Shared/Comboboxes/ProductoSearchSelect';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import CalculadoraCuota from 'components/Shared/CalculadoraCuota';
import { useRefinanciamientoModal } from 'hooks/Prestamo/useRefinanciamientoModal';
import { ArrowPathRoundedSquareIcon, ExclamationTriangleIcon, UserIcon } from '@heroicons/react/24/outline';

const RefinanciamientoModal = ({ isOpen, onClose, data, integrantesGrupo, onSuccess }) => {
    const {
        formData,
        setFormData,
        loading,
        alert,
        setAlert,
        integrantesRestantes,
        esPresidenteRefinanciado,
        handleChange,
        handleSubmit,
        montoBase,
        montoCalc,
        submitDisabled,
    } = useRefinanciamientoModal({ isOpen, data, integrantesGrupo, onSuccess });

    if (!data) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Refinanciar Integrante" size="lg">
            <div className="p-1">
                {/* Resumen deuda */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-4 flex gap-3 items-start">
                    <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                        <h4 className="text-[11px] font-black text-amber-800 uppercase">Cliente: {data.cliente_nombre}</h4>
                        <p className="text-[10px] text-amber-700 font-bold mt-1">
                            Deuda Base: S/ {data.deuda.toFixed(2)} | Mora: S/ {data.mora.toFixed(2)}
                        </p>
                        {data.excedente > 0 && (
                            <p className="text-[10px] text-purple-700 font-bold mt-0.5">
                                Excedente aplicado: -S/ {data.excedente.toFixed(2)}
                            </p>
                        )}
                        <p className="text-sm font-black text-brand-red mt-2">
                            Total a Refinanciar: S/ {montoBase.toFixed(2)}
                        </p>
                    </div>
                </div>

                <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">

                    {/* Producto */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Producto Financiero *</label>
                        <ProductoSearchSelect onSelect={p => setFormData(prev => ({ ...prev, producto_id: p?.id }))} />
                    </div>

                    {/* ── Selector de Nuevo Presidente (SOLO SI SE VA EL ACTUAL Y QUEDAN 2 O MÁS) ── */}
                    {esPresidenteRefinanciado && integrantesRestantes.length > 1 && (
                        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/50">
                            <label className="flex items-center gap-1.5 text-[10px] font-black text-blue-700 uppercase mb-2">
                                <UserIcon className="w-4 h-4" />
                                Actualizar Presidente del Grupo Original *
                            </label>
                            <select name="nuevo_presidente_id" value={formData.nuevo_presidente_id} onChange={handleChange}
                                className="w-full border border-blue-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-400 outline-none bg-white">
                                {integrantesRestantes.map(int => (
                                    <option key={int.id} value={int.id}>
                                        {int.nombre} (Cargo actual: {int.cargo})
                                    </option>
                                ))}
                            </select>
                            <p className="text-[9px] text-blue-500 font-bold mt-1.5 uppercase">
                                El integrante seleccionado asumirá la titularidad (PRESIDENTE) del préstamo grupal que queda activo.
                            </p>
                        </div>
                    )}

                    {/* ── Mensaje Automático (SOLO SI SE VA EL ACTUAL Y QUEDA 1 SOLO) ── */}
                    {esPresidenteRefinanciado && integrantesRestantes.length === 1 && (
                        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/50 flex flex-col gap-1">
                            <label className="flex items-center gap-1.5 text-[10px] font-black text-blue-700 uppercase">
                                <UserIcon className="w-4 h-4" />
                                Actualización Automática de Titular
                            </label>
                            <p className="text-[10px] text-blue-800 font-bold uppercase mt-1">
                                Al ser el único integrante restante, <span className="font-black">{integrantesRestantes[0].nombre}</span> asumirá automáticamente como PRESIDENTE del préstamo original.
                            </p>
                        </div>
                    )}

                    {/* Cuotas + Tasa */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">N° Cuotas *</label>
                            <input type="number" name="cuotas_solicitadas" required min="1"
                                value={formData.cuotas_solicitadas} onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-brand-red outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tasa Interés (%) *</label>
                            <input type="number" name="tasa_interes" required min="0" step="0.01"
                                value={formData.tasa_interes} onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-brand-red outline-none" />
                        </div>
                    </div>

                    {/* Frecuencia + Incluir mora */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Frecuencia *</label>
                            <select name="frecuencia" value={formData.frecuencia} onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-brand-red outline-none bg-white">
                                <option value="SEMANAL">SEMANAL</option>
                                <option value="CATORCENAL">CATORCENAL</option>
                                <option value="MENSUAL">MENSUAL</option>
                            </select>
                        </div>
                        <div className="flex items-center mt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="incluir_mora" checked={formData.incluir_mora} onChange={handleChange}
                                    className="w-4 h-4 text-brand-red border-slate-300 rounded focus:ring-brand-red" />
                                <span className="text-[11px] font-black text-slate-700 uppercase">Incluir Mora al Capital</span>
                            </label>
                        </div>
                    </div>

                    {/* ── Seguro ── */}
                    <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="tiene_seguro" checked={formData.tiene_seguro} onChange={handleChange}
                                className="w-4 h-4 text-brand-red border-slate-300 rounded focus:ring-brand-red" />
                            <span className="text-[11px] font-black text-slate-700 uppercase">Aplicar Seguro</span>
                        </label>

                        {formData.tiene_seguro && (
                            <div className="grid grid-cols-2 gap-4 pt-1">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                                        Monto Seguro (S/) *
                                    </label>
                                    <input
                                        type="number" name="seguro" required min="0.01" step="0.01"
                                        value={formData.seguro} onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-brand-red outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                                        Modalidad Seguro *
                                    </label>
                                    <select name="seguro_financiado" value={formData.seguro_financiado}
                                        onChange={e => setFormData(prev => ({ ...prev, seguro_financiado: e.target.value === 'true' }))}
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-brand-red outline-none bg-white">
                                        <option value="true">Financiado en cuotas</option>
                                        <option value="false">Cobrado por separado</option>
                                    </select>
                                    <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">
                                        {formData.seguro_financiado
                                            ? 'Se suma al capital y se paga dentro de las cuotas'
                                            : 'Se cobra aparte, no afecta el monto de cuotas'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Código recaudo */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Código de Recaudo *</label>
                        <input type="text" name="codigo_recaudo" required
                            value={formData.codigo_recaudo} onChange={handleChange}
                            placeholder="Ingrese el código único"
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold uppercase focus:ring-2 focus:ring-brand-red outline-none" />
                    </div>

                    {/* Observaciones */}
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Observaciones</label>
                        <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows="2"
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-brand-red outline-none" />
                    </div>

                    <CalculadoraCuota
                        monto={montoCalc}
                        tasa={formData.tasa_interes}
                        cuotas={formData.cuotas_solicitadas}
                        seguro={formData.seguro}
                        frecuencia={formData.frecuencia}
                    />

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={loading}
                            className="px-4 py-2 text-xs font-black text-slate-500 hover:bg-slate-100 rounded-xl uppercase disabled:opacity-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={submitDisabled}
                            className="flex items-center gap-2 px-6 py-2 bg-brand-gold hover:bg-brand-gold-dark text-white text-xs font-black uppercase rounded-xl transition-all shadow-md disabled:opacity-50">
                            {loading ? 'Procesando...' : <><ArrowPathRoundedSquareIcon className="w-4 h-4" /> Aplicar Refinanciamiento</>}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default RefinanciamientoModal;