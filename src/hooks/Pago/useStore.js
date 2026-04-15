import { useState, useEffect, useCallback } from 'react';
import { index, show } from 'services/prestamoService'; 
import { store as registrarPago } from 'services/pagoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

export const useStore = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [misPrestamos, setMisPrestamos] = useState([]);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cuotaParaPagar, setCuotaParaPagar] = useState(null);

    // 1. Cargar préstamos del cliente logueado
    const fetchMisPrestamos = useCallback(async () => {
        setLoading(true);
        try {
            const res = await index(1, { tipo_operacion: 'cobro' });
            setMisPrestamos(res.data.data || res.data || []);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMisPrestamos(); }, [fetchMisPrestamos]);

    // 2. Cargar detalle de un préstamo específico
    const handleSelectPrestamo = async (id) => {
        if (!id) {
            setPrestamoSeleccionado(null);
            return;
        }
        setLoading(true);
        try {
            const res = await show(id);
            setPrestamoSeleccionado(res.data || res);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    // 3. Enviar el pago a MinIO y DB
    const handleConfirmarPagoVirtual = async (data, file) => {
        if (!file) {
            setAlert({ type: 'error', message: 'Debes subir la foto del comprobante.' });
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('cuota_id', cuotaParaPagar.id);
            formData.append('monto_pagado', data.monto_pagado); 
            formData.append('numero_operacion', data.numero_operacion);
            formData.append('comprobante', file);

            await registrarPago(formData);
            
            setAlert({ type: 'success', message: '¡Boucher enviado! Espera la validación.' });
            setIsModalOpen(false);
            
            // Refrescar cronograma
            handleSelectPrestamo(prestamoSeleccionado.id);
        } catch (err) {
            setAlert(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return {
        loading, alert, setAlert,
        misPrestamos, prestamoSeleccionado, handleSelectPrestamo,
        isModalOpen, setIsModalOpen, cuotaParaPagar, setCuotaParaPagar,
        handleConfirmarPagoVirtual
    };
};