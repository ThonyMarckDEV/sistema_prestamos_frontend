import { useState, useEffect, useMemo } from 'react';
import { refinanciar } from 'services/prestamoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useRefinanciamientoModal = ({ isOpen, data, integrantesGrupo, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const [formData, setFormData] = useState({
        producto_id: '',
        tasa_interes: '',
        cuotas_solicitadas: '',
        frecuencia: 'SEMANAL',
        codigo_recaudo: '',
        incluir_mora: true,
        observaciones: '',
        tiene_seguro: false,
        seguro: '',
        seguro_financiado: true,
        nuevo_presidente_id: '',
    });

    // Filtramos a los integrantes que se quedan en el grupo
    const integrantesRestantes = useMemo(() => {
        if (!integrantesGrupo || !data?.cliente_id) return [];
        return integrantesGrupo.filter(int => int.id !== data.cliente_id);
    }, [integrantesGrupo, data?.cliente_id]);

    // Reseteo e inicialización al abrir el modal
    useEffect(() => {
        if (isOpen && data) {
            let presiInicial = '';
            if (integrantesRestantes.length > 0) {
                const actual = integrantesRestantes.find(i => i.cargo === 'PRESIDENTE');
                presiInicial = actual ? actual.id : integrantesRestantes[0].id;
            }

            setFormData({
                producto_id: '',
                tasa_interes: '',
                cuotas_solicitadas: '',
                frecuencia: 'SEMANAL',
                codigo_recaudo: '',
                incluir_mora: true,
                observaciones: '',
                tiene_seguro: false,
                seguro: '',
                seguro_financiado: true,
                nuevo_presidente_id: presiInicial,
            });
            setAlert(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, data?.prestamo_id, data?.cliente_id, integrantesRestantes]);

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
                seguro: formData.tiene_seguro ? parseFloat(formData.seguro || 0) : 0,
                seguro_financiado: formData.tiene_seguro ? formData.seguro_financiado : false,
                prestamo_refinanciado_id: data.prestamo_id,
                cliente_refinanciado_id: data.cliente_id,
            });
            onSuccess();
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    // Cálculos financieros
    const montoBase = formData.incluir_mora ? ((data?.deuda || 0) + (data?.mora || 0)) : (data?.deuda || 0);
    const seguroValor = formData.tiene_seguro ? parseFloat(formData.seguro || 0) : 0;
    const montoCalc = formData.tiene_seguro && formData.seguro_financiado
        ? montoBase + seguroValor
        : montoBase;

    // Validación del botón de submit
    const submitDisabled = loading
        || !formData.producto_id
        || !formData.cuotas_solicitadas
        || !formData.tasa_interes
        || !formData.codigo_recaudo?.trim()
        || (formData.tiene_seguro && (!formData.seguro || parseFloat(formData.seguro) <= 0));

    return {
        formData,
        setFormData,
        loading,
        alert,
        setAlert,
        integrantesRestantes,
        handleChange,
        handleSubmit,
        montoBase,
        montoCalc,
        submitDisabled,
    };
};