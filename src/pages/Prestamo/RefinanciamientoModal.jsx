import React, { useEffect, useState } from 'react';
import Modal from 'components/Shared/Modals/ViewModal';
import ProductoSearchSelect from 'components/Shared/Comboboxes/ProductoSearchSelect';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import CalculadoraCuota from 'components/Shared/CalculadoraCuota';
import { refinanciar } from 'services/prestamoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { ArrowPathRoundedSquareIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { toUpper } from 'utilities/Validations/validations';

const RefinanciamientoModal = ({ isOpen, onClose, data, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [alert,   setAlert]   = useState(null);

    const [formData, setFormData] = useState({
        producto_id:        '',
        tasa_interes:       '',
        cuotas_solicitadas: '',
        frecuencia:         'SEMANAL',
        incluir_mora:       true,
        observaciones:      '',
    });

    // Limpiar al abrir con préstamo diferente
    useEffect(() => {
        if (isOpen && data) {
            setFormData({
                producto_id:        '',
                tasa_interes:       '',
                cuotas_solicitadas: '',
                frecuencia:         'SEMANAL',
                incluir_mora:       true,
                observaciones:      '',
            });
            setAlert(null);
        }
        // eslint-disable-next-line 
    }, [isOpen, data?.prestamo_id, data?.cliente_id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        let finalValue = value;
        if (type === 'checkbox') {
            finalValue = checked;
        } else if (name === 'observaciones') {
            finalValue = toUpper(value);
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert(null);
        setLoading(true);
        try {
            await refinanciar({
                ...formData,
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

    const montoBase = formData.incluir_mora ? (data.deuda + data.mora) : data.deuda;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Refinanciar Préstamo" size="md">
            <div className="p-1">
                {/* Resumen deuda */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-4 flex gap-3 items-start">
                    <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                        <h4 className="text-[11px] font-black text-amber-800 uppercase">Cliente: {data.cliente_nombre}</h4>
                        <p className="text-[10px] text-amber-700 font-bold mt-1">
                            Deuda Base: S/ {data.deuda.toFixed(2)} | Mora: S/ {data.mora.toFixed(2)}
                        </p>
                        <p className="text-sm font-black text-brand-red mt-2">
                            Total a Refinanciar: S/ {montoBase.toFixed(2)}
                        </p>
                    </div>
                </div>

                <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Producto Financiero *</label>
                        <ProductoSearchSelect onSelect={p => setFormData(prev => ({ ...prev, producto_id: p?.id }))} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">N° Cuotas *</label>
                            <input type="number" name="cuotas_solicitadas" required min="1"
                                value={formData.cuotas_solicitadas} onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-brand-red outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tasa Interés (%) *</label>
                            <input type="number" name="tasa_interes" required min="0" step="0.01"
                                value={formData.tasa_interes} onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-brand-red outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Frecuencia *</label>
                            <select name="frecuencia" value={formData.frecuencia} onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-brand-red outline-none bg-white">
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

                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Observaciones</label>
                        <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows="2"
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-brand-red outline-none" />
                    </div>

                    {/* Calculadora reutilizable */}
                    <CalculadoraCuota
                        monto={montoBase}
                        tasa={formData.tasa_interes}
                        cuotas={formData.cuotas_solicitadas}
                    />

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={loading}
                            className="px-4 py-2 text-xs font-black text-slate-500 hover:bg-slate-100 rounded-xl uppercase disabled:opacity-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading || !formData.producto_id || !formData.cuotas_solicitadas || !formData.tasa_interes}
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