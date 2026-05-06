import React, { useEffect, useState } from 'react';
import Modal from 'components/Shared/Modals/ViewModal';
import ProductoSearchSelect from 'components/Shared/Comboboxes/ProductoSearchSelect';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import CalculadoraCuota from 'components/Shared/CalculadoraCuota';
import { refinanciar } from 'services/prestamoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { ArrowPathRoundedSquareIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const RefinanciamientoModal = ({ isOpen, onClose, data, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [alert,   setAlert]   = useState(null);

    const [formData, setFormData] = useState({
        producto_id:        '',
        tasa_interes:       '',
        cuotas_solicitadas: '',
        frecuencia:         'SEMANAL',
        codigo_recaudo:     '',
        incluir_mora:       true,
        observaciones:      '',
        // Seguro
        tiene_seguro:       false,
        seguro:             '',
        seguro_financiado:  true,  // true = financiado en cuotas | false = cobrado aparte
    });

    useEffect(() => {
        if (isOpen && data) {
            setFormData({
                producto_id:        '',
                tasa_interes:       '',
                cuotas_solicitadas: '',
                frecuencia:         'SEMANAL',
                codigo_recaudo:     '',
                incluir_mora:       true,
                observaciones:      '',
                tiene_seguro:       false,
                seguro:             '',
                seguro_financiado:  true,
            });
            setAlert(null);
        }
        // eslint-disable-next-line
    }, [isOpen, data?.prestamo_id, data?.cliente_id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert(null);
        setLoading(true);
        try {
            await refinanciar({
                ...formData,
                // Si no tiene seguro, mandamos 0
                seguro:            formData.tiene_seguro ? parseFloat(formData.seguro || 0) : 0,
                seguro_financiado: formData.tiene_seguro ? formData.seguro_financiado : false,
                prestamo_refinanciado_id: data.prestamo_id,
                cliente_refinanciado_id:  data.cliente_id,
            });
            onSuccess();
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    if (!data) return null;

    const montoBase    = formData.incluir_mora ? (data.deuda + data.mora) : data.deuda;
    const seguroValor  = formData.tiene_seguro ? parseFloat(formData.seguro || 0) : 0;
    // Si el seguro es financiado se suma al capital para la calculadora
    const montoCalc    = formData.tiene_seguro && formData.seguro_financiado
        ? montoBase + seguroValor
        : montoBase;

    const submitDisabled = loading
        || !formData.producto_id
        || !formData.cuotas_solicitadas
        || !formData.tasa_interes
        || !formData.codigo_recaudo.trim()
        || (formData.tiene_seguro && (!formData.seguro || parseFloat(formData.seguro) <= 0));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Refinanciar Préstamo" size="lg">
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

                    {/* ── Seguro ──────────────────────────────────────────────── */}
                    <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
                        {/* Toggle tiene_seguro */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="tiene_seguro" checked={formData.tiene_seguro} onChange={handleChange}
                                className="w-4 h-4 text-brand-red border-slate-300 rounded focus:ring-brand-red" />
                            <span className="text-[11px] font-black text-slate-700 uppercase">Aplicar Seguro</span>
                        </label>

                        {formData.tiene_seguro && (
                            <div className="grid grid-cols-2 gap-4 pt-1">
                                {/* Monto seguro */}
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

                                {/* Modalidad seguro */}
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

                    {/* Calculadora — usa montoCalc que ya incluye seguro financiado si aplica */}
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